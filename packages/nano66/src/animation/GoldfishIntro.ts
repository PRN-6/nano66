import type { Particle } from "../particles/Particle";
import type { ParticlePool } from "../particles/ParticlePool";
import { ColorUtils } from "../utils/ColorUtils";

export interface GoldfishPointDef {
  u: number; // longitudinal X: +1.0 (snout) to -1.65 (veil tail tip)
  v: number; // vertical Y: +0.88 (dorsal crest) to -0.88 (lower veil lobe)
  w: number; // lateral 3D thickness Z: +0.65 (left) to -0.65 (right)
  waveWeight: number; // 0.0 (head) to 1.8 (tail tip)
  color: string;
  size: number;
}

/**
 * 50 core anatomical reference points (kept for backward compatibility and unit tests)
 */
export const GOLDFISH_50_POINTS: GoldfishPointDef[] = [
  // --- 1. Snout, Head & Bilateral Stereoscopic Pearl Eyes (7 points) ---
  { u: 0.95, v: 0.0, w: 0.0, waveWeight: 0.0, color: "#FFA000", size: 3.2 },
  { u: 0.78, v: 0.22, w: 0.0, waveWeight: 0.02, color: "#FFB300", size: 2.8 },
  { u: 0.78, v: -0.18, w: 0.0, waveWeight: 0.02, color: "#FFA726", size: 2.8 },
  { u: 0.60, v: 0.32, w: 0.0, waveWeight: 0.04, color: "#FF8F00", size: 3.0 },
  { u: 0.60, v: -0.28, w: 0.0, waveWeight: 0.04, color: "#FF8F00", size: 3.0 },
  { u: 0.68, v: 0.16, w: 0.32, waveWeight: 0.02, color: "#FFFFFF", size: 2.6 },
  { u: 0.68, v: 0.16, w: -0.32, waveWeight: 0.02, color: "#FFFFFF", size: 2.6 },

  // --- 2. Volumetric 3D Torso, Scales & Flanks (16 points) ---
  { u: 0.40, v: 0.06, w: 0.0, waveWeight: 0.08, color: "#FFC107", size: 3.5 },
  { u: 0.20, v: 0.06, w: 0.0, waveWeight: 0.14, color: "#FFD54F", size: 3.8 },
  { u: 0.00, v: 0.05, w: 0.0, waveWeight: 0.22, color: "#FFCA28", size: 4.0 },
  { u: -0.20, v: 0.02, w: 0.0, waveWeight: 0.32, color: "#FFB300", size: 3.5 },
  { u: -0.38, v: 0.00, w: 0.0, waveWeight: 0.45, color: "#FFA000", size: 3.0 },
  { u: 0.35, v: 0.38, w: 0.0, waveWeight: 0.08, color: "#FF8F00", size: 3.0 },
  { u: 0.15, v: 0.48, w: 0.0, waveWeight: 0.14, color: "#FF9800", size: 3.2 },
  { u: -0.05, v: 0.50, w: 0.0, waveWeight: 0.22, color: "#FFA726", size: 3.2 },
  { u: -0.22, v: 0.42, w: 0.0, waveWeight: 0.32, color: "#FFB300", size: 2.9 },
  { u: -0.38, v: 0.30, w: 0.0, waveWeight: 0.44, color: "#FF9800", size: 2.7 },
  { u: 0.35, v: -0.34, w: 0.0, waveWeight: 0.08, color: "#FF8F00", size: 3.0 },
  { u: 0.15, v: -0.44, w: 0.0, waveWeight: 0.14, color: "#FF9800", size: 3.2 },
  { u: -0.05, v: -0.45, w: 0.0, waveWeight: 0.22, color: "#FFA726", size: 3.2 },
  { u: -0.22, v: -0.38, w: 0.0, waveWeight: 0.32, color: "#FFB300", size: 2.9 },
  { u: 0.10, v: 0.02, w: 0.44, waveWeight: 0.16, color: "#FFE082", size: 2.8 },
  { u: 0.10, v: 0.02, w: -0.44, waveWeight: 0.16, color: "#FFE082", size: 2.8 },

  // --- 3. 3D High Dorsal Fin (4 points) ---
  { u: -0.08, v: 0.68, w: 0.0, waveWeight: 0.25, color: "#FFD54F", size: 2.4 },
  { u: -0.22, v: 0.82, w: 0.0, waveWeight: 0.35, color: "#FFE082", size: 2.5 },
  { u: -0.34, v: 0.78, w: 0.0, waveWeight: 0.45, color: "#FFD54F", size: 2.3 },
  { u: -0.45, v: 0.60, w: 0.0, waveWeight: 0.52, color: "#FFCA28", size: 2.0 },

  // --- 4. 3D Bilateral Pectoral & Pelvic Fins (5 points) ---
  { u: 0.32, v: -0.35, w: 0.55, waveWeight: 0.10, color: "#FFCA28", size: 2.4 },
  { u: 0.32, v: -0.35, w: -0.55, waveWeight: 0.10, color: "#FFCA28", size: 2.4 },
  { u: -0.05, v: -0.52, w: 0.35, waveWeight: 0.22, color: "#FFE082", size: 2.2 },
  { u: -0.05, v: -0.52, w: -0.35, waveWeight: 0.22, color: "#FFE082", size: 2.2 },
  { u: -0.35, v: -0.45, w: 0.0, waveWeight: 0.48, color: "#FFB300", size: 2.0 },

  // --- 5. 3D Bifurcated Twin Veil Tail (18 points) ---
  { u: -0.55, v: 0.10, w: 0.08, waveWeight: 0.55, color: "#FF8F00", size: 2.7 },
  { u: -0.55, v: -0.10, w: -0.08, waveWeight: 0.55, color: "#FF8F00", size: 2.7 },
  { u: -0.68, v: 0.00, w: 0.00, waveWeight: 0.68, color: "#FFA000", size: 2.5 },
  { u: -0.85, v: 0.28, w: 0.22, waveWeight: 0.85, color: "#FFB74D", size: 2.4 },
  { u: -1.02, v: 0.46, w: 0.32, waveWeight: 1.05, color: "#FFCA28", size: 2.3 },
  { u: -1.22, v: 0.62, w: 0.42, waveWeight: 1.25, color: "#FFE082", size: 2.1 },
  { u: -1.40, v: 0.75, w: 0.48, waveWeight: 1.45, color: "#FFF59D", size: 1.9 },
  { u: -1.55, v: 0.82, w: 0.52, waveWeight: 1.60, color: "#FFF9C4", size: 1.7 },
  { u: -1.08, v: 0.24, w: 0.18, waveWeight: 1.00, color: "#FFCC80", size: 2.2 },
  { u: -1.28, v: 0.36, w: 0.26, waveWeight: 1.30, color: "#FFE082", size: 2.0 },
  { u: -0.85, v: -0.28, w: -0.22, waveWeight: 0.85, color: "#FFB74D", size: 2.4 },
  { u: -1.02, v: -0.46, w: -0.32, waveWeight: 1.05, color: "#FFCA28", size: 2.3 },
  { u: -1.22, v: -0.62, w: -0.42, waveWeight: 1.25, color: "#FFE082", size: 2.1 },
  { u: -1.40, v: -0.75, w: -0.48, waveWeight: 1.45, color: "#FFF59D", size: 1.9 },
  { u: -1.55, v: -0.82, w: -0.52, waveWeight: 1.60, color: "#FFF9C4", size: 1.7 },
  { u: -1.08, v: -0.24, w: -0.18, waveWeight: 1.00, color: "#FFCC80", size: 2.2 },
  { u: -1.28, v: -0.36, w: -0.26, waveWeight: 1.30, color: "#FFE082", size: 2.0 },
  { u: -0.96, v: 0.00, w: 0.00, waveWeight: 0.95, color: "#FFA726", size: 2.2 },
];

/**
 * Generate an ultra-high-definition volumetric 3D goldfish particle model.
 * Produces dense cross-sectional body rings, bilateral stereoscopic pearl eyes,
 * high dorsal fin rays, multi-ray 3D pectoral fin wings, and flowing silky twin veil tail ribbons.
 */
export function generateHighDensity3DGoldfish(targetCount: number = 350): GoldfishPointDef[] {
  if (targetCount <= 50) {
    return GOLDFISH_50_POINTS.slice(0, targetCount);
  }

  const points: GoldfishPointDef[] = [];

  // --- 1. Snout & Mouth (14 particles) ---
  points.push({ u: 1.02, v: 0.0, w: 0.0, waveWeight: 0.0, color: "#FFA000", size: 3.2 });
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    points.push({
      u: 0.92,
      v: Math.sin(angle) * 0.12,
      w: Math.cos(angle) * 0.12,
      waveWeight: 0.01,
      color: "#FFB300",
      size: 2.8,
    });
  }
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    points.push({
      u: 0.82,
      v: Math.sin(angle) * 0.20,
      w: Math.cos(angle) * 0.20,
      waveWeight: 0.02,
      color: "#FFA726",
      size: 2.7,
    });
  }

  // --- 2. Head, Cranial Wen & Bilateral Stereoscopic Pearl Eyes (24 particles) ---
  // Left eye cluster (luminous white core + golden orbital iris)
  points.push({ u: 0.70, v: 0.16, w: 0.35, waveWeight: 0.02, color: "#FFFFFF", size: 3.2 });
  points.push({ u: 0.73, v: 0.18, w: 0.33, waveWeight: 0.02, color: "#FFFFFF", size: 2.4 });
  points.push({ u: 0.67, v: 0.14, w: 0.36, waveWeight: 0.02, color: "#FFE082", size: 2.2 });
  // Right eye cluster (luminous white core + golden orbital iris)
  points.push({ u: 0.70, v: 0.16, w: -0.35, waveWeight: 0.02, color: "#FFFFFF", size: 3.2 });
  points.push({ u: 0.73, v: 0.18, w: -0.33, waveWeight: 0.02, color: "#FFFFFF", size: 2.4 });
  points.push({ u: 0.67, v: 0.14, w: -0.36, waveWeight: 0.02, color: "#FFE082", size: 2.2 });

  // Forehead wen & throat
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    points.push({
      u: 0.68,
      v: Math.sin(angle) * 0.28 + 0.05,
      w: Math.cos(angle) * 0.26,
      waveWeight: 0.03,
      color: "#FF8F00",
      size: 2.8,
    });
  }
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    points.push({
      u: 0.55,
      v: Math.sin(angle) * 0.38 + 0.06,
      w: Math.cos(angle) * 0.34,
      waveWeight: 0.05,
      color: "#FF9800",
      size: 3.0,
    });
  }

  // --- 3. Volumetric 3D Torso (12 cross-sectional rings, ~140 particles) ---
  const ringCount = 12;
  const ringParticles = 12;
  for (let r = 0; r < ringCount; r++) {
    const t = r / (ringCount - 1); // 0 (front torso) to 1 (rear peduncle)
    const u = 0.45 - t * 1.05; // from +0.45 to -0.60

    // Ryukin rounded egg profile: arched dorsal hump and deep rounded belly
    const hump = Math.sin(Math.PI * Math.pow(t, 0.75));
    const radiusY = Math.max(0.12, 0.48 * hump);
    const radiusZ = Math.max(0.10, 0.42 * Math.sin(Math.PI * t));
    const centerY = 0.06 * Math.sin(Math.PI * t);
    const waveWeight = 0.08 + t * 0.45;

    for (let p = 0; p < ringParticles; p++) {
      const phi = (p / ringParticles) * Math.PI * 2;
      const v = centerY + Math.sin(phi) * radiusY;
      const w = Math.cos(phi) * radiusZ;

      // Color mapping: dorsal ridge is deep orange, flanks are gleaming gold, belly is soft cream gold
      let color = "#FFB300";
      if (Math.sin(phi) > 0.4) {
        color = p % 2 === 0 ? "#FF8F00" : "#FFA000";
      } else if (Math.sin(phi) < -0.4) {
        color = "#FFF8E1";
      } else {
        color = p % 2 === 0 ? "#FFCA28" : "#FFE082";
      }

      points.push({
        u,
        v,
        w,
        waveWeight,
        color,
        size: 2.8 + (1 - t) * 0.8,
      });
    }
  }

  // --- 4. 3D High Dorsal Fin Crest (24 particles) ---
  for (let ray = 0; ray < 6; ray++) {
    const rayT = ray / 5;
    const baseU = -0.05 - rayT * 0.42;
    const maxHeight = 0.82 - Math.abs(rayT - 0.4) * 0.25;

    for (let pt = 1; pt <= 4; pt++) {
      const ptT = pt / 4;
      points.push({
        u: baseU - ptT * 0.08,
        v: 0.35 + ptT * (maxHeight - 0.35),
        w: ((ray % 2 === 0 ? 1 : -1) * 0.03) * ptT,
        waveWeight: 0.25 + rayT * 0.30 + ptT * 0.20,
        color: pt === 4 ? "#FFF9C4" : "#FFD54F",
        size: 2.2 - ptT * 0.4,
      });
    }
  }

  // --- 5. 3D Bilateral Pectoral Fin Wings (32 particles) ---
  // Left wing (+Z) and Right wing (-Z)
  for (const side of [1, -1]) {
    for (let ray = 0; ray < 4; ray++) {
      const rayT = ray / 3;
      for (let step = 1; step <= 4; step++) {
        const stepT = step / 4;
        points.push({
          u: 0.35 - stepT * 0.22 - rayT * 0.08,
          v: -0.18 - stepT * 0.24,
          w: side * (0.32 + stepT * 0.40 + rayT * 0.12),
          waveWeight: 0.12 + stepT * 0.25,
          color: step === 4 ? "#FFE082" : "#FFCA28",
          size: 2.3 - stepT * 0.5,
        });
      }
    }
  }

  // --- 6. Pelvic & Ventral Keel Fins (16 particles) ---
  for (const side of [1, -1]) {
    for (let pt = 1; pt <= 4; pt++) {
      const t = pt / 4;
      points.push({
        u: -0.05 - t * 0.15,
        v: -0.38 - t * 0.20,
        w: side * (0.18 + t * 0.18),
        waveWeight: 0.20 + t * 0.20,
        color: "#FFE082",
        size: 2.1,
      });
    }
  }
  // Ventral keel fin
  for (let pt = 1; pt <= 8; pt++) {
    const t = pt / 8;
    points.push({
      u: -0.32 - t * 0.22,
      v: -0.28 - t * 0.22,
      w: (pt % 2 === 0 ? 0.04 : -0.04) * t,
      waveWeight: 0.40 + t * 0.25,
      color: "#FFB300",
      size: 2.2 - t * 0.4,
    });
  }

  // --- 7. Flowing Twin Bifurcated Veil Tail Ribbons (~120 particles) ---
  // Left Veil Fin (+Z) and Right Veil Fin (-Z)
  for (const side of [1, -1]) {
    const ribbonCount = 6;
    const ptsPerRibbon = 10;

    for (let rib = 0; rib < ribbonCount; rib++) {
      const ribT = rib / (ribbonCount - 1); // 0 (top lobe) to 1 (bottom lobe)
      const lobeCurveY = Math.cos(ribT * Math.PI) * 0.82; // curves from +0.82 to -0.82
      const lobeSplayZ = side * (0.22 + Math.sin(ribT * Math.PI) * 0.38);

      for (let pt = 1; pt <= ptsPerRibbon; pt++) {
        const ptT = pt / ptsPerRibbon; // 0.1 to 1.0 (tips)
        const u = -0.62 - ptT * 1.02; // trails back to -1.64
        const v = 0.08 * Math.cos(ribT * Math.PI) + ptT * lobeCurveY;
        const w = lobeSplayZ * (0.6 + ptT * 0.7);
        const waveWeight = 0.60 + ptT * 1.15;

        // Color gradient: warm amber at peduncle -> gleaming gold -> pale chiffon gold -> luminous white tips
        let color = "#FFB74D";
        if (ptT > 0.85) {
          color = "#FFFFFF"; // Sparkling filament tips
        } else if (ptT > 0.65) {
          color = "#FFF9C4";
        } else if (ptT > 0.35) {
          color = "#FFD54F";
        }

        points.push({
          u,
          v,
          w,
          waveWeight,
          color,
          size: Math.max(1.5, 2.6 - ptT * 1.0),
        });
      }
    }
  }

  // Adjust exact count to targetCount if specified
  if (points.length > targetCount) {
    return points.slice(0, targetCount);
  }

  return points;
}

export interface GoldfishParticleData {
  particle: Particle;
  def: GoldfishPointDef;
  scatterVx: number;
  scatterVy: number;
  scatterVz: number;
}

/**
 * GoldfishIntro — 3D High-Definition Cinematic Goldfish Prologue
 *
 * Implements a high-density volumetric 3D particle goldfish that surfaces from deep water,
 * banks dynamically with Euler rotation into curves, undulates with realistic traveling
 * fluid waves, and detonates in a 3D spherical stardust explosion to ignite element construction.
 */
export class GoldfishIntro {
  private pool: ParticlePool;
  private duration: number;
  private particleCount: number;
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
    particleCountOrOnScatter?: number | (() => void),
    onScatterOrOnComplete?: () => void,
    onComplete?: () => void
  ) {
    this.pool = pool;
    this.duration = Math.max(100, duration);
    if (typeof particleCountOrOnScatter === "number") {
      this.particleCount = Math.max(50, particleCountOrOnScatter);
      this.onScatterCallback = onScatterOrOnComplete;
      this.onCompleteCallback = onComplete;
    } else {
      this.particleCount = 50;
      this.onScatterCallback = particleCountOrOnScatter;
      this.onCompleteCallback = onScatterOrOnComplete;
    }
  }

  public updateDimensions(width: number, height: number): void {
    this.screenWidth = Math.max(200, width);
    this.screenHeight = Math.max(200, height);
  }

  /**
   * Spawn and initialize the high-density 3D goldfish particle cloud
   */
  public start(screenWidth: number, screenHeight: number): void {
    this.updateDimensions(screenWidth, screenHeight);
    this.elapsedTime = 0;
    this.isFinished = false;
    this.hasScattered = false;
    this.fishParticles = [];

    const startX = this.screenWidth * 0.14;
    const startY = this.screenHeight * 0.65;
    const startZ = 300; // Starts in the deep background

    this.prevCenterX = startX - 10;
    this.prevCenterY = startY;
    this.prevCenterZ = startZ;
    this.currentHeading = 0.2;
    this.currentPitch = 0.0;
    this.currentRoll = 0.0;

    // Generate high-density volumetric 3D goldfish model
    const pointsDefs = generateHighDensity3DGoldfish(this.particleCount);

    for (let i = 0; i < pointsDefs.length; i++) {
      const def = pointsDefs[i];
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
      const speed = 7.0 + Math.random() * 9.0;

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
      // Swims from deep background (+300), glides up close to camera (-140), and curves into center
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

      // Z Depth: dives from deep (+280px) up close to camera (-130px), then levels out to 0
      const curCenterZ = Math.cos(s * Math.PI * 1.6) * 210;

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

        // Dynamic 3D Banking (Roll): Tilts body & dorsal crest naturally into turns
        const targetRoll = -Math.max(-0.68, Math.min(0.68, headingDiff * 3.4));
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
      const fishScale = Math.min(140, Math.max(75, this.screenWidth * 0.088));
      const fov = 900; // Perspective Camera Focal Length

      for (const item of this.fishParticles) {
        const { particle: p, def } = item;

        // Fade in rapidly on first 300ms
        if (p.alpha < 0.95) {
          p.alpha = Math.min(0.95, p.alpha + 0.05 * dt);
        }

        // Biological sinusoidal wave traveling down the spine in lateral Z
        const waveOffsetZ = Math.sin(wagTime - def.u * 3.2) * def.waveWeight * 18;
        // Secondary micro-flutter on delicate fin rays in vertical Y
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
        p.size = def.size * Math.max(0.6, Math.min(2.2, depthScale));
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

        // Atmospheric drag
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
