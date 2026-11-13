import type { Particle } from "../particles/Particle";
import type { ParticlePool } from "../particles/ParticlePool";
import { ColorUtils } from "../utils/ColorUtils";

export interface GoldfishPointDef {
  u: number; // longitudinal X: +0.95 (snout) to -1.55 (veil tail tip)
  v: number; // vertical Y: +0.82 (dorsal crest) to -0.82 (lower veil lobe)
  w: number; // lateral 3D thickness Z: +0.55 (left) to -0.55 (right)
  waveWeight: number; // 0.0 (head) to 1.6 (tail tip)
  color: string;
  size: number;
}

/**
 * 50 precisely placed anatomical 3D coordinates forming a true volumetric goldfish:
 * Snout, head, bilateral stereoscopic pearl eyes (on opposite sides of the head in Z),
 * volumetric arched torso, high vertical dorsal fin, left/right pectoral fin wings,
 * pelvic fins, and 3D bifurcated double veil tail ribbons with independent depth splay.
 */
export const GOLDFISH_50_POINTS: GoldfishPointDef[] = [
  // --- 1. Snout, Head & Bilateral Stereoscopic Pearl Eyes (7 points) ---
  { u: 0.95, v: 0.0, w: 0.0, waveWeight: 0.0, color: "#FFA000", size: 3.2 }, // Snout tip
  { u: 0.78, v: 0.22, w: 0.0, waveWeight: 0.02, color: "#FFB300", size: 2.8 }, // Forehead
  { u: 0.78, v: -0.18, w: 0.0, waveWeight: 0.02, color: "#FFA726", size: 2.8 }, // Chin
  { u: 0.60, v: 0.32, w: 0.0, waveWeight: 0.04, color: "#FF8F00", size: 3.0 }, // Head crown
  { u: 0.60, v: -0.28, w: 0.0, waveWeight: 0.04, color: "#FF8F00", size: 3.0 }, // Throat
  // True stereoscopic pearl eyes on opposite sides (+Z left, -Z right)
  { u: 0.68, v: 0.16, w: 0.32, waveWeight: 0.02, color: "#FFFFFF", size: 2.6 }, // Left Pearl Eye
  { u: 0.68, v: 0.16, w: -0.32, waveWeight: 0.02, color: "#FFFFFF", size: 2.6 }, // Right Pearl Eye

  // --- 2. Volumetric 3D Torso, Scales & Flanks (16 points) ---
  // Spine & core
  { u: 0.40, v: 0.06, w: 0.0, waveWeight: 0.08, color: "#FFC107", size: 3.5 },
  { u: 0.20, v: 0.06, w: 0.0, waveWeight: 0.14, color: "#FFD54F", size: 3.8 },
  { u: 0.00, v: 0.05, w: 0.0, waveWeight: 0.22, color: "#FFCA28", size: 4.0 },
  { u: -0.20, v: 0.02, w: 0.0, waveWeight: 0.32, color: "#FFB300", size: 3.5 },
  { u: -0.38, v: 0.00, w: 0.0, waveWeight: 0.45, color: "#FFA000", size: 3.0 },
  // Dorsal upper curve (top ridge)
  { u: 0.35, v: 0.38, w: 0.0, waveWeight: 0.08, color: "#FF8F00", size: 3.0 },
  { u: 0.15, v: 0.48, w: 0.0, waveWeight: 0.14, color: "#FF9800", size: 3.2 },
  { u: -0.05, v: 0.50, w: 0.0, waveWeight: 0.22, color: "#FFA726", size: 3.2 },
  { u: -0.22, v: 0.42, w: 0.0, waveWeight: 0.32, color: "#FFB300", size: 2.9 },
  { u: -0.38, v: 0.30, w: 0.0, waveWeight: 0.44, color: "#FF9800", size: 2.7 },
  // Ventral lower belly curve
  { u: 0.35, v: -0.34, w: 0.0, waveWeight: 0.08, color: "#FF8F00", size: 3.0 },
  { u: 0.15, v: -0.44, w: 0.0, waveWeight: 0.14, color: "#FF9800", size: 3.2 },
  { u: -0.05, v: -0.45, w: 0.0, waveWeight: 0.22, color: "#FFA726", size: 3.2 },
  { u: -0.22, v: -0.38, w: 0.0, waveWeight: 0.32, color: "#FFB300", size: 2.9 },
  // Volumetric 3D flank scales (bulging laterally in +Z and -Z)
  { u: 0.10, v: 0.02, w: 0.44, waveWeight: 0.16, color: "#FFE082", size: 2.8 }, // Left Flank Scale
  { u: 0.10, v: 0.02, w: -0.44, waveWeight: 0.16, color: "#FFE082", size: 2.8 }, // Right Flank Scale

  // --- 3. 3D High Dorsal Fin (Top Crest) (4 points) ---
  { u: -0.08, v: 0.68, w: 0.0, waveWeight: 0.25, color: "#FFD54F", size: 2.4 },
  { u: -0.22, v: 0.82, w: 0.0, waveWeight: 0.35, color: "#FFE082", size: 2.5 },
  { u: -0.34, v: 0.78, w: 0.0, waveWeight: 0.45, color: "#FFD54F", size: 2.3 },
  { u: -0.45, v: 0.60, w: 0.0, waveWeight: 0.52, color: "#FFCA28", size: 2.0 },

  // --- 4. 3D Bilateral Pectoral & Pelvic Fins (5 points) ---
  // Left/Right pectoral fins extending outwards in 3D (+Z and -Z)
  { u: 0.32, v: -0.35, w: 0.55, waveWeight: 0.10, color: "#FFCA28", size: 2.4 }, // Left Pectoral
  { u: 0.32, v: -0.35, w: -0.55, waveWeight: 0.10, color: "#FFCA28", size: 2.4 }, // Right Pectoral
  { u: -0.05, v: -0.52, w: 0.35, waveWeight: 0.22, color: "#FFE082", size: 2.2 }, // Left Pelvic
  { u: -0.05, v: -0.52, w: -0.35, waveWeight: 0.22, color: "#FFE082", size: 2.2 }, // Right Pelvic
  { u: -0.35, v: -0.45, w: 0.0, waveWeight: 0.48, color: "#FFB300", size: 2.0 }, // Ventral keel

  // --- 5. 3D Tail Peduncle & Bifurcated Twin Veil Tail (18 points) ---
  // Caudal Peduncle (tail stem with 3D width)
  { u: -0.55, v: 0.10, w: 0.08, waveWeight: 0.55, color: "#FF8F00", size: 2.7 },
  { u: -0.55, v: -0.10, w: -0.08, waveWeight: 0.55, color: "#FF8F00", size: 2.7 },
  { u: -0.68, v: 0.00, w: 0.00, waveWeight: 0.68, color: "#FFA000", size: 2.5 },
  // Upper Left Flowing Veil Fin (splayed into +Z and +Y) (7 points)
  { u: -0.85, v: 0.28, w: 0.22, waveWeight: 0.85, color: "#FFB74D", size: 2.4 },
  { u: -1.02, v: 0.46, w: 0.32, waveWeight: 1.05, color: "#FFCA28", size: 2.3 },
  { u: -1.22, v: 0.62, w: 0.42, waveWeight: 1.25, color: "#FFE082", size: 2.1 },
  { u: -1.40, v: 0.75, w: 0.48, waveWeight: 1.45, color: "#FFF59D", size: 1.9 },
  { u: -1.55, v: 0.82, w: 0.52, waveWeight: 1.60, color: "#FFF9C4", size: 1.7 }, // Filament tip
  { u: -1.08, v: 0.24, w: 0.18, waveWeight: 1.00, color: "#FFCC80", size: 2.2 },
  { u: -1.28, v: 0.36, w: 0.26, waveWeight: 1.30, color: "#FFE082", size: 2.0 },
  // Lower Right Flowing Veil Fin (splayed into -Z and -Y) (7 points)
  { u: -0.85, v: -0.28, w: -0.22, waveWeight: 0.85, color: "#FFB74D", size: 2.4 },
  { u: -1.02, v: -0.46, w: -0.32, waveWeight: 1.05, color: "#FFCA28", size: 2.3 },
  { u: -1.22, v: -0.62, w: -0.42, waveWeight: 1.25, color: "#FFE082", size: 2.1 },
  { u: -1.40, v: -0.75, w: -0.48, waveWeight: 1.45, color: "#FFF59D", size: 1.9 },
  { u: -1.55, v: -0.82, w: -0.52, waveWeight: 1.60, color: "#FFF9C4", size: 1.7 }, // Filament tip
  { u: -1.08, v: -0.24, w: -0.18, waveWeight: 1.00, color: "#FFCC80", size: 2.2 },
  { u: -1.28, v: -0.36, w: -0.26, waveWeight: 1.30, color: "#FFE082", size: 2.0 },
  // Central trailing veil streamer
  { u: -0.96, v: 0.00, w: 0.00, waveWeight: 0.95, color: "#FFA726", size: 2.2 },
];

export interface GoldfishParticleData {
  particle: Particle;
  def: GoldfishPointDef;
  scatterVx: number;
  scatterVy: number;
  scatterVz: number;
}

/**
 * GoldfishIntro — 3D Cinematic Goldfish Engine
 *
 * Implements a true 3D particle animation with:
 * - Volumetric 3D coordinates (length, height, depth)
 * - 3D trajectory through deep water and surfacing
 * - Full 3D rotation matrix: Heading (yaw), Pitch (dive/climb), and organic Roll (banking into turns)
 * - Traveling sinusoidal biological wave undulation in 3D
 * - Real perspective projection camera with depth scaling & shading
 * - 360-degree spherical radial scatter explosion
 */
export class GoldfishIntro {
  private pool: ParticlePool;
  private duration: number;
  private elapsedTime: number = 0;
  private isFinished: boolean = false;
  private hasScattered: boolean = false;
  private fishParticles: GoldfishParticleData[] = [];
  private screenWidth: number = 1920;
  private screenHeight: number = 1080;
  private onScatterCallback?: () => void;
  private onCompleteCallback?: () => void;

  // 3D Kinematics Tracking
  private prevCenterX: number = 0;
  private prevCenterY: number = 0;
  private prevCenterZ: number = 0;
  private currentHeading: number = 0; // Yaw
  private currentPitch: number = 0;   // Pitch
  private currentRoll: number = 0;    // Roll (banking)

  constructor(
    pool: ParticlePool,
    duration: number = 2800,
    onScatter?: () => void,
    onComplete?: () => void
  ) {
    this.pool = pool;
    this.duration = Math.max(100, duration);
    this.onScatterCallback = onScatter;
    this.onCompleteCallback = onComplete;
  }

  public updateDimensions(width: number, height: number): void {
    this.screenWidth = Math.max(200, width);
    this.screenHeight = Math.max(200, height);
  }

  /**
   * Spawn and initialize the 50 3D goldfish particles
   */
  public start(screenWidth: number, screenHeight: number): void {
    this.updateDimensions(screenWidth, screenHeight);
    this.elapsedTime = 0;
    this.isFinished = false;
    this.hasScattered = false;
    this.fishParticles = [];

    const startX = this.screenWidth * 0.15;
    const startY = this.screenHeight * 0.65;
    const startZ = 280; // Starts in the deep background

    this.prevCenterX = startX - 10;
    this.prevCenterY = startY;
    this.prevCenterZ = startZ;
    this.currentHeading = 0.2;
    this.currentPitch = 0.0;
    this.currentRoll = 0.0;

    // Acquire exactly 50 particles from the pool
    for (let i = 0; i < GOLDFISH_50_POINTS.length; i++) {
      const def = GOLDFISH_50_POINTS[i];
      if (!def) continue;

      const p = this.pool.acquire();
      if (!p) break;

      const colorNum = ColorUtils.toHexNumber(def.color);
      p.spawn(
        startX + def.u * 80,
        startY + def.v * 80,
        startX + def.u * 80,
        startY + def.v * 80,
        colorNum,
        def.size,
        0.95,
        1.0,
        "goldfish-intro",
        i + 1
      );
      p.alpha = 0.05; // smooth luminous fade-in

      // 3D spherical scatter velocity for the final burst
      const theta = Math.atan2(def.v, def.u) + (Math.random() - 0.5) * 0.6;
      const phi = def.w * 2.2 + (Math.random() - 0.5) * 0.8;
      const speed = 7.0 + Math.random() * 8.5;

      const scatterVx = Math.cos(theta) * Math.cos(phi) * speed;
      const scatterVy = Math.sin(theta) * Math.cos(phi) * speed;
      const scatterVz = Math.sin(phi) * speed;

      this.fishParticles.push({
        particle: p,
        def,
        scatterVx,
        scatterVy,
        scatterVz,
      });
    }
  }

  /**
   * Update 3D swimming trajectory, 3D rotation matrix, undulation, and perspective projection
   */
  public update(delta: number, _timestamp: number): boolean {
    if (this.isFinished) return true;

    this.elapsedTime += delta;
    const progress = Math.min(1.0, this.elapsedTime / this.duration);
    const dt = Math.min(delta / 16.67, 2.0);

    const swimEndThreshold = 0.72; // 72% swimming, 28% scatter explosion

    if (progress < swimEndThreshold) {
      // --- PHASE 1: TRUE 3D GOLDFISH SWIMMING & BANKING ---
      const swimProgress = progress / swimEndThreshold; // [0, 1]

      // 3D Trajectory Spline:
      // The fish swims from lower-left deep water (Z > 0), surfaces close to the camera (Z < 0),
      // and curves into the viewport center
      const startX = this.screenWidth * 0.12;
      const endX = this.screenWidth * 0.52;
      const startY = this.screenHeight * 0.66;
      const endY = this.screenHeight * 0.44;

      const s = swimProgress;
      const ease = s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2;

      // X, Y lateral S-curve
      const curCenterX =
        startX + (endX - startX) * ease + Math.sin(s * Math.PI * 2.2) * (this.screenWidth * 0.09);
      const curCenterY =
        startY + (endY - startY) * ease + Math.cos(s * Math.PI * 1.8) * (this.screenHeight * 0.07);

      // Z Depth: dives from deep (+260px) up close to the camera (-120px), then levels out to 0
      const curCenterZ = Math.cos(s * Math.PI * 1.6) * 190;

      // 3D Velocity & Direction Vector
      const dx = curCenterX - this.prevCenterX;
      const dy = curCenterY - this.prevCenterY;
      const dz = curCenterZ - this.prevCenterZ;
      const horizDist = Math.hypot(dx, dy);

      if (horizDist > 0.1) {
        const targetHeading = Math.atan2(dy, dx);
        const headingDiff = targetHeading - this.currentHeading;

        // Smooth Heading (Yaw)
        this.currentHeading += headingDiff * 0.28;

        // Dynamic 3D Banking (Roll): Tilts into turns like a real fish in water
        const targetRoll = -Math.max(-0.65, Math.min(0.65, headingDiff * 3.2));
        this.currentRoll += (targetRoll - this.currentRoll) * 0.20;

        // 3D Pitch (climbing and diving)
        const targetPitch = Math.atan2(-dz, horizDist * 1.2);
        this.currentPitch += (targetPitch - this.currentPitch) * 0.25;
      }

      this.prevCenterX = curCenterX;
      this.prevCenterY = curCenterY;
      this.prevCenterZ = curCenterZ;

      // 3D Rotation Matrix Components
      const cosY = Math.cos(this.currentHeading);
      const sinY = Math.sin(this.currentHeading);
      const cosP = Math.cos(this.currentPitch);
      const sinP = Math.sin(this.currentPitch);
      const cosR = Math.cos(this.currentRoll);
      const sinR = Math.sin(this.currentRoll);

      // Swimming wag frequency (~1.6 Hz)
      const wagTime = this.elapsedTime * 0.012;
      const fishScale = Math.min(135, Math.max(75, this.screenWidth * 0.085));
      const fov = 900; // Perspective Camera Focal Length

      for (const item of this.fishParticles) {
        const { particle: p, def } = item;

        // Fade in rapidly on first 300ms
        if (p.alpha < 0.95) {
          p.alpha = Math.min(0.95, p.alpha + 0.05 * dt);
        }

        // Biological sinusoidal wave traveling down the spine in lateral Z
        const waveOffsetZ = Math.sin(wagTime - def.u * 3.2) * def.waveWeight * 18;
        // Secondary micro-flutter on fins in vertical Y
        const flutterY = Math.cos(wagTime * 1.6 + def.w * 2.5) * (def.waveWeight > 0.8 ? 2.8 : 0);

        // Local 3D Coordinates
        const lx = def.u * fishScale;
        const ly = (def.v * fishScale) + flutterY;
        const lz = (def.w * fishScale) + waveOffsetZ;

        // 3D Euler Rotation (Roll -> Pitch -> Yaw)
        // 1. Roll around X
        const rx1 = lx;
        const ry1 = ly * cosR - lz * sinR;
        const rz1 = ly * sinR + lz * cosR;

        // 2. Pitch around Z/lateral
        const rx2 = rx1 * cosP + rz1 * sinP;
        const ry2 = ry1;
        const rz2 = -rx1 * sinP + rz1 * cosP;

        // 3. Heading (Yaw) in horizontal plane
        const rx3 = rx2 * cosY - ry2 * sinY;
        const ry3 = rx2 * sinY + ry2 * cosY;
        const rz3 = rz2;

        // World 3D Coordinates
        const worldX = curCenterX + rx3;
        const worldY = curCenterY + ry3;
        const worldZ = curCenterZ + rz3;

        // Perspective Camera Projection
        const depthScale = fov / (fov + worldZ);

        p.x = curCenterX + (worldX - curCenterX) * depthScale;
        p.y = curCenterY + (worldY - curCenterY) * depthScale;

        // Realistic depth-based particle size & luminance
        p.size = def.size * Math.max(0.6, Math.min(2.1, depthScale));
        p.alpha = Math.min(0.98, Math.max(0.25, 0.95 * depthScale));
        p.active = true;
      }
    } else {
      // --- PHASE 2: 3D SPHERICAL INCANDESCENT BURST & SCATTER ---
      if (!this.hasScattered) {
        this.hasScattered = true;
        this.onScatterCallback?.();

        // Apply 3D radial explosive impulse
        for (const item of this.fishParticles) {
          const p = item.particle;
          p.vx = item.scatterVx;
          p.vy = item.scatterVy;
        }
      }

      const scatterProgress = (progress - swimEndThreshold) / (1.0 - swimEndThreshold); // [0, 1]

      for (const item of this.fishParticles) {
        const p = item.particle;

        // Physics drag
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Flare and sparkle during explosion
        p.alpha = Math.max(0.25, 1.0 - scatterProgress * 0.7);
        p.size = item.def.size * (1.0 + Math.sin(scatterProgress * Math.PI) * 0.4);
      }
    }

    if (progress >= 1.0) {
      this.finish();
      return true;
    }

    return false;
  }

  public finish(): void {
    if (this.isFinished) return;
    this.isFinished = true;
    this.onCompleteCallback?.();
  }

  public getActiveParticles(): Particle[] {
    return this.fishParticles.map((item) => item.particle);
  }

  public isDone(): boolean {
    return this.isFinished;
  }
}
