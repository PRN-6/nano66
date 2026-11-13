import type { NanoElement, Point } from "../types";
import { Particle } from "../particles/Particle";
import { ParticlePool } from "../particles/ParticlePool";
import { GOLDFISH_50_POINTS, type GoldfishPointDef } from "./GoldfishIntro";
import { ColorUtils } from "../utils/ColorUtils";

export interface FishTransitionOptions {
  duration?: number;
  speed?: number;
  colors?: number[];
  onScatter?: () => void;
  onComplete?: () => void;
}

interface TransitionParticleItem {
  particle: Particle;
  def: GoldfishPointDef;
  startX: number;
  startY: number;
  scatterVx: number;
  scatterVy: number;
  targetPoint?: Point;
}

/**
 * FishTransition — 3D Inter-Element Particle Goldfish Engine
 *
 * Smoothly transitions particles from a completed website element to the next element
 * by assembling them into a volumetric 3D goldfish that leaps through 3D space, banks
 * naturally into the turn with true 3D rotation and perspective depth, and scatters onto
 * the destination element's target loci.
 */
export class FishTransition {
  private pool: ParticlePool;
  private fromElement: NanoElement;
  private toElement: NanoElement;
  private duration: number;
  private speed: number;
  private colors: number[];
  private onScatterCallback?: () => void;
  private onCompleteCallback?: () => void;

  private elapsedTime: number = 0;
  private isActiveFlag: boolean = false;
  private isFinishedFlag: boolean = false;
  private hasScattered: boolean = false;

  private particles: TransitionParticleItem[] = [];

  // 3D Bezier curve control points
  private p0: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  private p1: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  private p2: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  private p3: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  private pathDistance: number = 0;

  // 3D Kinematics
  private currentHeading: number = 0; // Yaw
  private currentPitch: number = 0;   // Pitch
  private currentRoll: number = 0;    // Roll (banking)

  constructor(
    pool: ParticlePool,
    fromElement: NanoElement,
    toElement: NanoElement,
    options: FishTransitionOptions = {},
    transitionIndex: number = 0
  ) {
    this.pool = pool;
    this.fromElement = fromElement;
    this.toElement = toElement;
    this.speed = Math.max(0.2, options.speed ?? 1.0);
    this.colors = options.colors && options.colors.length > 0 ? options.colors : [0xffa000, 0xffca28, 0xffffff];
    this.onScatterCallback = options.onScatter;
    this.onCompleteCallback = options.onComplete;

    // Calculate start and end centers
    const startX = fromElement.rect.left + fromElement.rect.width / 2;
    const startY = fromElement.rect.top + fromElement.rect.height / 2;
    const endX = toElement.rect.left + toElement.rect.width / 2;
    const endY = toElement.rect.top + toElement.rect.height / 2;

    this.p0 = { x: startX, y: startY, z: 0 };
    this.p3 = { x: endX, y: endY, z: 0 };

    const dx = endX - startX;
    const dy = endY - startY;
    this.pathDistance = Math.hypot(dx, dy);

    // Calculate organic curved trajectory in 3D (alternating curvature left/right)
    const nx = this.pathDistance > 0 ? -dy / this.pathDistance : 0;
    const ny = this.pathDistance > 0 ? dx / this.pathDistance : 1;
    const curveSign = transitionIndex % 2 === 0 ? 1 : -1;
    const lateralBend = Math.min(140, Math.max(40, this.pathDistance * 0.25)) * curveSign;

    // Arches out towards the viewer in Z during transit (-80px closer to camera)
    const leapDepth = -Math.min(120, Math.max(40, this.pathDistance * 0.18));

    this.p1 = {
      x: startX + dx * 0.33 + nx * lateralBend,
      y: startY + dy * 0.33 + ny * lateralBend,
      z: leapDepth * 0.8,
    };
    this.p2 = {
      x: startX + dx * 0.67 + nx * (lateralBend * 0.65),
      y: startY + dy * 0.67 + ny * (lateralBend * 0.65),
      z: leapDepth,
    };

    // Calculate dynamic duration based on distance and speed
    const baseDuration = options.duration ?? 800;
    const distanceScaled = Math.min(1200, Math.max(450, 300 + (this.pathDistance * 0.8) / this.speed));
    this.duration = Math.max(200, Math.min(baseDuration, distanceScaled));
  }

  /**
   * Start the transition: collect particles and assemble them into 3D goldfish formation
   */
  public start(): void {
    this.isActiveFlag = true;
    this.isFinishedFlag = false;
    this.hasScattered = false;
    this.elapsedTime = 0;
    this.particles = [];

    // 1. Collect active particles currently on fromElement
    const candidateParticles = this.pool.getActiveParticles().filter(
      (p) => p.elementId === this.fromElement.id || p.elementId === "goldfish-intro"
    );

    // Ensure we have at least 50 particles to form a glorious 3D fish
    const targetParticleCount = Math.max(50, Math.min(candidateParticles.length, 120));
    const assignedParticles: Particle[] = [...candidateParticles];

    while (assignedParticles.length < targetParticleCount) {
      const p = this.pool.acquire();
      if (!p) break;
      const seed = assignedParticles.length + 1;
      const color = this.colors[seed % this.colors.length] ?? 0xffa000;
      p.spawn(
        this.p0.x + (Math.random() - 0.5) * 40,
        this.p0.y + (Math.random() - 0.5) * 40,
        this.p0.x,
        this.p0.y,
        color,
        2.4,
        0.95,
        this.speed,
        "fish-transition",
        seed
      );
      assignedParticles.push(p);
    }

    // 2. Map particles to anatomical 3D fish coordinates and toElement targets
    const toTargets = this.toElement.targets;
    const pointsCount = GOLDFISH_50_POINTS.length;

    for (let i = 0; i < assignedParticles.length; i++) {
      const p = assignedParticles[i]!;
      p.state = "forming";
      p.elementId = "fish-transition";
      p.hasArrived = false;

      const baseDef = GOLDFISH_50_POINTS[i % pointsCount]!;
      // Volumetric 3D micro-jitter for particles beyond primary 50 points
      const jitterU = i >= pointsCount ? (((i * 17) % 31) - 15) * 0.012 : 0;
      const jitterV = i >= pointsCount ? (((i * 23) % 31) - 15) * 0.012 : 0;
      const jitterW = i >= pointsCount ? (((i * 19) % 31) - 15) * 0.014 : 0;

      const def: GoldfishPointDef = {
        u: baseDef.u + jitterU,
        v: baseDef.v + jitterV,
        w: (baseDef.w ?? 0) + jitterW,
        waveWeight: baseDef.waveWeight,
        color: baseDef.color,
        size: baseDef.size,
      };

      p.color = ColorUtils.toHexNumber(def.color);
      p.size = def.size;

      // Burst velocity for arrival scatter
      const angle = Math.atan2(def.v, def.u) + (Math.random() - 0.5) * 0.7;
      const scatterSpeed = 5.0 + Math.random() * 7.0;
      const scatterVx = Math.cos(angle) * scatterSpeed;
      const scatterVy = Math.sin(angle) * scatterSpeed;

      const targetPoint = toTargets[i % toTargets.length];

      this.particles.push({
        particle: p,
        def,
        startX: p.x,
        startY: p.y,
        scatterVx,
        scatterVy,
        targetPoint,
      });
    }

    // Initial heading angle towards p1
    this.currentHeading = Math.atan2(this.p1.y - this.p0.y, this.p1.x - this.p0.x);
    this.currentPitch = 0.0;
    this.currentRoll = 0.0;
  }

  /**
   * Update 3D kinematics, banking, undulation, and arrival scatter
   */
  public update(delta: number, _timestamp: number): boolean {
    if (!this.isActiveFlag || this.isFinishedFlag) return true;

    this.elapsedTime += delta;
    const progress = Math.min(1.0, this.elapsedTime / this.duration);
    const dt = Math.min(delta / 16.67, 2.0);

    const gatherEnd = 0.22; // 0% - 22%: gather into 3D fish
    const scatterStart = 0.80; // 80% - 100%: scatter into next element

    // 1. Evaluate current point on 3D cubic Bezier curve
    const s = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const u = 1 - s;

    const curX =
      u * u * u * this.p0.x +
      3 * u * u * s * this.p1.x +
      3 * u * s * s * this.p2.x +
      s * s * s * this.p3.x;
    const curY =
      u * u * u * this.p0.y +
      3 * u * u * s * this.p1.y +
      3 * u * s * s * this.p2.y +
      s * s * s * this.p3.y;
    const curZ =
      u * u * u * this.p0.z +
      3 * u * u * s * this.p1.z +
      3 * u * s * s * this.p2.z +
      s * s * s * this.p3.z;

    // Evaluate 3D tangent
    const tx =
      3 * u * u * (this.p1.x - this.p0.x) +
      6 * u * s * (this.p2.x - this.p1.x) +
      3 * s * s * (this.p3.x - this.p2.x);
    const ty =
      3 * u * u * (this.p1.y - this.p0.y) +
      6 * u * s * (this.p2.y - this.p1.y) +
      3 * s * s * (this.p3.y - this.p2.y);
    const tz =
      3 * u * u * (this.p1.z - this.p0.z) +
      6 * u * s * (this.p2.z - this.p1.z) +
      3 * s * s * (this.p3.z - this.p2.z);

    const horizDist = Math.hypot(tx, ty);
    if (horizDist > 0.1) {
      const targetHeading = Math.atan2(ty, tx);
      const headingDiff = targetHeading - this.currentHeading;

      // Yaw
      this.currentHeading += headingDiff * 0.32;

      // 3D Banking (Roll): tilt into turns
      const targetRoll = -Math.max(-0.65, Math.min(0.65, headingDiff * 3.0));
      this.currentRoll += (targetRoll - this.currentRoll) * 0.22;

      // 3D Pitch: dive or rise towards target element
      const targetPitch = Math.atan2(-tz, horizDist * 1.2);
      this.currentPitch += (targetPitch - this.currentPitch) * 0.25;
    }

    // 3D Rotation Matrix Components
    const cosY = Math.cos(this.currentHeading);
    const sinY = Math.sin(this.currentHeading);
    const cosP = Math.cos(this.currentPitch);
    const sinP = Math.sin(this.currentPitch);
    const cosR = Math.cos(this.currentRoll);
    const sinR = Math.sin(this.currentRoll);

    // Swimming wave down spine
    const wagTime = this.elapsedTime * 0.015;
    const fishScale = Math.min(105, Math.max(55, this.pathDistance * 0.15));
    const fov = 900; // Perspective Camera Focal Length

    for (const item of this.particles) {
      const { particle: p, def } = item;

      // Sinusoidal body wave in lateral Z
      const waveOffsetZ = Math.sin(wagTime - def.u * 3.2) * def.waveWeight * 16;
      const flutterY = Math.cos(wagTime * 1.6 + def.w * 2.4) * (def.waveWeight > 0.8 ? 2.5 : 0);

      const lx = def.u * fishScale;
      const ly = (def.v * fishScale) + flutterY;
      const lz = (def.w * fishScale) + waveOffsetZ;

      // 3D Euler Rotation (Roll -> Pitch -> Yaw)
      const rx1 = lx;
      const ry1 = ly * cosR - lz * sinR;
      const rz1 = ly * sinR + lz * cosR;

      const rx2 = rx1 * cosP + rz1 * sinP;
      const ry2 = ry1;
      const rz2 = -rx1 * sinP + rz1 * cosP;

      const rx3 = rx2 * cosY - ry2 * sinY;
      const ry3 = rx2 * sinY + ry2 * cosY;
      const rz3 = rz2;

      // World 3D position
      const worldX = curX + rx3;
      const worldY = curY + ry3;
      const worldZ = curZ + rz3;

      // Perspective Camera Projection
      const depthScale = fov / (fov + worldZ);
      const projectedX = curX + (worldX - curX) * depthScale;
      const projectedY = curY + (worldY - curY) * depthScale;

      if (progress < gatherEnd) {
        // --- PHASE 1: GATHER INTO 3D FISH ---
        const gatherK = progress / gatherEnd;
        const smoothK = gatherK * gatherK * (3 - 2 * gatherK); // smoothstep
        p.x = item.startX + (projectedX - item.startX) * smoothK;
        p.y = item.startY + (projectedY - item.startY) * smoothK;
        p.alpha = Math.min(0.95, p.alpha + 0.06 * dt);
        p.size = def.size * depthScale;
      } else if (progress < scatterStart) {
        // --- PHASE 2: 3D SWIMMING & PERSPECTIVE ---
        p.x = projectedX;
        p.y = projectedY;
        p.size = def.size * Math.max(0.6, Math.min(2.1, depthScale));
        p.alpha = Math.min(0.98, Math.max(0.25, 0.95 * depthScale));
      } else {
        // --- PHASE 3: SCATTER BURST ONTO NEXT ELEMENT TARGETS ---
        if (!this.hasScattered) {
          this.hasScattered = true;
          this.onScatterCallback?.();
        }

        const scatterK = (progress - scatterStart) / (1.0 - scatterStart);
        const easeOut = 1 - Math.pow(1 - scatterK, 2);

        if (item.targetPoint) {
          const targetX = item.targetPoint.x;
          const targetY = item.targetPoint.y;
          const burstX = projectedX + item.scatterVx * (1 - scatterK) * 6;
          const burstY = projectedY + item.scatterVy * (1 - scatterK) * 6;

          p.x = burstX + (targetX - burstX) * easeOut;
          p.y = burstY + (targetY - burstY) * easeOut;
          p.size = def.size * (1.0 - scatterK * 0.2);
        } else {
          p.x = projectedX + item.scatterVx * easeOut * 15;
          p.y = projectedY + item.scatterVy * easeOut * 15;
        }
      }
    }

    if (progress >= 1.0) {
      this.finish();
      return true;
    }

    return false;
  }

  /**
   * Complete transition: retarget particles to toElement, spawn extras if needed, and notify
   */
  public finish(): void {
    if (this.isFinishedFlag) return;
    this.isFinishedFlag = true;
    this.isActiveFlag = false;

    const toTargets = this.toElement.targets;
    const endX = this.p3.x;
    const endY = this.p3.y;

    // Retarget transitioned particles
    for (let i = 0; i < this.particles.length; i++) {
      const item = this.particles[i]!;
      const p = item.particle;

      if (i < toTargets.length) {
        const target = toTargets[i]!;
        p.setTarget(target.x, target.y, this.toElement.id);
        p.state = "forming";
        p.speed = this.speed;
        p.hasArrived = false;
      } else {
        p.dissolve();
      }
    }

    // If toElement has more target points than transitioned particles, emit remaining
    if (toTargets.length > this.particles.length) {
      for (let i = this.particles.length; i < toTargets.length; i++) {
        const target = toTargets[i]!;
        const p = this.pool.acquire();
        if (!p) break;

        const color = this.colors[i % this.colors.length] ?? 0xffffff;
        const seed = i + 1;
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 25;
        p.spawn(
          endX + Math.cos(angle) * radius,
          endY + Math.sin(angle) * radius,
          target.x,
          target.y,
          color,
          target.size ?? 2.0,
          target.alpha ?? 0.9,
          this.speed,
          this.toElement.id,
          seed
        );
        p.state = "forming";
      }
    }

    this.onCompleteCallback?.();
  }

  public isActive(): boolean {
    return this.isActiveFlag && !this.isFinishedFlag;
  }

  public cancel(): void {
    this.isActiveFlag = false;
    this.isFinishedFlag = true;
  }
}
