import type { Particle } from "../particles/Particle";
import type { ParticlePool } from "../particles/ParticlePool";
import { ColorUtils } from "../utils/ColorUtils";

export interface GoldfishPointDef {
  u: number; // forward/backward: +0.75 (snout) to -1.35 (tail filament tip)
  v: number; // lateral: -0.7 to +0.7
  waveWeight: number; // 0.0 (head) to 1.6 (tail tip)
  color: string;
  size: number;
}

/**
 * 50 precisely placed anatomical points forming a majestic goldfish:
 * Snout, head, luminous white pearl eyes, arched dorsal body, belly,
 * high dorsal fin, fluttering pectoral & pelvic fins, and double flowing veil tail.
 */
export const GOLDFISH_50_POINTS: GoldfishPointDef[] = [
  // --- 1. Snout, Head & Luminous Pearl Eyes (7 points) ---
  { u: 0.75, v: 0.0, waveWeight: 0.0, color: "#FFA000", size: 2.8 }, // Snout tip
  { u: 0.62, v: 0.12, waveWeight: 0.02, color: "#FFB300", size: 2.6 }, // Forehead
  { u: 0.62, v: -0.12, waveWeight: 0.02, color: "#FFA726", size: 2.6 }, // Chin
  { u: 0.48, v: 0.22, waveWeight: 0.04, color: "#FF8F00", size: 2.9 }, // Head crown
  { u: 0.48, v: -0.22, waveWeight: 0.04, color: "#FF8F00", size: 2.9 }, // Throat
  { u: 0.52, v: 0.16, waveWeight: 0.02, color: "#FFFFFF", size: 2.4 }, // Left Eye (glowing pearl white)
  { u: 0.52, v: -0.16, waveWeight: 0.02, color: "#FFFFFF", size: 2.4 }, // Right Eye (glowing pearl white)

  // --- 2. Main Torso, Scales & Core (16 points) ---
  // Spine & core
  { u: 0.35, v: 0.0, waveWeight: 0.08, color: "#FFC107", size: 3.2 },
  { u: 0.18, v: 0.0, waveWeight: 0.14, color: "#FFD54F", size: 3.5 },
  { u: 0.0, v: 0.0, waveWeight: 0.22, color: "#FFCA28", size: 3.6 },
  { u: -0.18, v: 0.0, waveWeight: 0.32, color: "#FFB300", size: 3.3 },
  { u: -0.35, v: 0.0, waveWeight: 0.45, color: "#FFA000", size: 2.9 },
  // Dorsal upper body curve
  { u: 0.32, v: 0.30, waveWeight: 0.08, color: "#FF8F00", size: 2.8 },
  { u: 0.15, v: 0.38, waveWeight: 0.14, color: "#FF9800", size: 3.0 },
  { u: -0.02, v: 0.40, waveWeight: 0.22, color: "#FFA726", size: 3.0 },
  { u: -0.20, v: 0.35, waveWeight: 0.32, color: "#FFB300", size: 2.8 },
  { u: -0.36, v: 0.25, waveWeight: 0.44, color: "#FF9800", size: 2.6 },
  // Ventral lower body curve (belly)
  { u: 0.32, v: -0.30, waveWeight: 0.08, color: "#FF8F00", size: 2.8 },
  { u: 0.15, v: -0.38, waveWeight: 0.14, color: "#FF9800", size: 3.0 },
  { u: -0.02, v: -0.40, waveWeight: 0.22, color: "#FFA726", size: 3.0 },
  { u: -0.20, v: -0.35, waveWeight: 0.32, color: "#FFB300", size: 2.8 },
  { u: -0.36, v: -0.25, waveWeight: 0.44, color: "#FF9800", size: 2.6 },
  // Shimmering flank highlight
  { u: 0.08, v: 0.18, waveWeight: 0.16, color: "#FFE082", size: 2.4 },

  // --- 3. Dorsal Fin (Top Fin) (4 points) ---
  { u: -0.05, v: 0.55, waveWeight: 0.25, color: "#FFD54F", size: 2.2 },
  { u: -0.18, v: 0.65, waveWeight: 0.35, color: "#FFE082", size: 2.4 },
  { u: -0.30, v: 0.62, waveWeight: 0.45, color: "#FFD54F", size: 2.1 },
  { u: -0.40, v: 0.50, waveWeight: 0.52, color: "#FFCA28", size: 1.9 },

  // --- 4. Pectoral & Ventral Fins (5 points) ---
  { u: 0.28, v: -0.50, waveWeight: 0.10, color: "#FFCA28", size: 2.0 },
  { u: 0.16, v: -0.62, waveWeight: 0.16, color: "#FFE082", size: 2.2 },
  { u: 0.04, v: -0.55, waveWeight: 0.22, color: "#FFD54F", size: 2.0 },
  { u: -0.28, v: -0.50, waveWeight: 0.36, color: "#FFCA28", size: 2.0 },
  { u: -0.40, v: -0.42, waveWeight: 0.48, color: "#FFB300", size: 1.8 },

  // --- 5. Tail Peduncle & Flowing Double Veil Tail (18 points) ---
  // Tail stem (Peduncle)
  { u: -0.50, v: 0.12, waveWeight: 0.55, color: "#FF8F00", size: 2.6 },
  { u: -0.50, v: -0.12, waveWeight: 0.55, color: "#FF8F00", size: 2.6 },
  { u: -0.60, v: 0.0, waveWeight: 0.68, color: "#FFA000", size: 2.4 },
  // Upper flowing veil fin (7 points)
  { u: -0.75, v: 0.22, waveWeight: 0.85, color: "#FFB74D", size: 2.3 },
  { u: -0.90, v: 0.40, waveWeight: 1.05, color: "#FFCA28", size: 2.2 },
  { u: -1.08, v: 0.55, waveWeight: 1.25, color: "#FFE082", size: 2.1 },
  { u: -1.25, v: 0.68, waveWeight: 1.45, color: "#FFF59D", size: 1.9 },
  { u: -1.38, v: 0.72, waveWeight: 1.60, color: "#FFF9C4", size: 1.7 }, // Feather tip
  { u: -0.95, v: 0.20, waveWeight: 1.00, color: "#FFCC80", size: 2.1 },
  { u: -1.15, v: 0.32, waveWeight: 1.30, color: "#FFE082", size: 1.9 },
  // Lower flowing veil fin (7 points)
  { u: -0.75, v: -0.22, waveWeight: 0.85, color: "#FFB74D", size: 2.3 },
  { u: -0.90, v: -0.40, waveWeight: 1.05, color: "#FFCA28", size: 2.2 },
  { u: -1.08, v: -0.55, waveWeight: 1.25, color: "#FFE082", size: 2.1 },
  { u: -1.25, v: -0.68, waveWeight: 1.45, color: "#FFF59D", size: 1.9 },
  { u: -1.38, v: -0.72, waveWeight: 1.60, color: "#FFF9C4", size: 1.7 }, // Feather tip
  { u: -0.95, v: -0.20, waveWeight: 1.00, color: "#FFCC80", size: 2.1 },
  { u: -1.15, v: -0.32, waveWeight: 1.30, color: "#FFE082", size: 1.9 },
  // Central flowing streamer (1 point)
  { u: -0.85, v: 0.0, waveWeight: 0.95, color: "#FFA726", size: 2.1 },
];

export interface GoldfishParticleData {
  particle: Particle;
  def: GoldfishPointDef;
  scatterVx: number;
  scatterVy: number;
}

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

  // Previous center for heading angle calculation
  private prevCenterX: number = 0;
  private prevCenterY: number = 0;
  private currentHeading: number = 0;

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
   * Spawn and initialize the 50 goldfish particles
   */
  public start(screenWidth: number, screenHeight: number): void {
    this.updateDimensions(screenWidth, screenHeight);
    this.elapsedTime = 0;
    this.isFinished = false;
    this.hasScattered = false;
    this.fishParticles = [];

    const startX = this.screenWidth * 0.18;
    const startY = this.screenHeight * 0.58;
    this.prevCenterX = startX - 10;
    this.prevCenterY = startY;
    this.currentHeading = 0;

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
      p.alpha = 0.05; // starts with a subtle fade-in

      // Prepare random radial scatter velocity for the later burst
      const angle = Math.atan2(def.v, def.u) + (Math.random() - 0.5) * 0.6;
      const speed = 7.0 + Math.random() * 8.5;
      const scatterVx = Math.cos(angle) * speed;
      const scatterVy = Math.sin(angle) * speed;

      this.fishParticles.push({
        particle: p,
        def,
        scatterVx,
        scatterVy,
      });
    }
  }

  /**
   * Update the goldfish swimming motion, undulating tail wave, and scatter burst
   */
  public update(delta: number, _timestamp: number): boolean {
    if (this.isFinished) return true;

    this.elapsedTime += delta;
    const progress = Math.min(1.0, this.elapsedTime / this.duration);
    const dt = Math.min(delta / 16.67, 2.0);

    const swimEndThreshold = 0.72; // 72% of time swimming, 28% scattering

    if (progress < swimEndThreshold) {
      // --- PHASE 1: ORGANIC GOLDFISH SWIMMING ---
      const swimProgress = progress / swimEndThreshold; // [0, 1]

      // Cubic smooth curve from lower-left to center-screen
      const startX = this.screenWidth * 0.15;
      const endX = this.screenWidth * 0.52;
      const startY = this.screenHeight * 0.62;
      const endY = this.screenHeight * 0.44;

      // S-curve lateral wave displacement
      const s = swimProgress;
      const ease = s < 0.5 ? 2 * s * s : 1 - Math.pow(-2 * s + 2, 2) / 2;

      const curCenterX =
        startX + (endX - startX) * ease + Math.sin(s * Math.PI * 2.2) * (this.screenWidth * 0.09);
      const curCenterY =
        startY + (endY - startY) * ease + Math.cos(s * Math.PI * 1.8) * (this.screenHeight * 0.07);

      // Calculate forward heading direction vector
      const dx = curCenterX - this.prevCenterX;
      const dy = curCenterY - this.prevCenterY;
      if (Math.hypot(dx, dy) > 0.1) {
        const targetHeading = Math.atan2(dy, dx);
        // Smooth heading angular interpolation
        this.currentHeading = this.currentHeading + (targetHeading - this.currentHeading) * 0.25;
      }
      this.prevCenterX = curCenterX;
      this.prevCenterY = curCenterY;

      const cosH = Math.cos(this.currentHeading);
      const sinH = Math.sin(this.currentHeading);

      // Swimming tail wag wave frequency (~1.6 Hz)
      const wagTime = this.elapsedTime * 0.011;
      const scale = Math.min(125, Math.max(75, this.screenWidth * 0.08));

      for (const item of this.fishParticles) {
        const { particle: p, def } = item;

        // Smooth fade-in on first 300ms
        if (p.alpha < 0.95) {
          p.alpha = Math.min(0.95, p.alpha + 0.05 * dt);
        }

        // Biological sinusoidal wave traveling down the spine to the veil tail
        const waveOffset = Math.sin(wagTime - def.u * 3.0) * def.waveWeight * 20;
        // Secondary micro-flutter on delicate tail fin rays
        const finFlutter = Math.cos(wagTime * 1.4 + def.v * 2) * (def.waveWeight > 0.8 ? 2.5 : 0);

        const localX = def.u * scale;
        const localY = def.v * scale + waveOffset + finFlutter;

        // Rotate into heading direction and translate to screen center
        p.x = curCenterX + (localX * cosH - localY * sinH);
        p.y = curCenterY + (localX * sinH + localY * cosH);
        p.active = true;
      }
    } else {
      // --- PHASE 2: INCANDESCENT BURST & 360-DEGREE RADIAL SCATTER ---
      if (!this.hasScattered) {
        this.hasScattered = true;
        this.onScatterCallback?.();

        // Apply radial explosive impulse
        for (const item of this.fishParticles) {
          item.particle.vx = item.scatterVx;
          item.particle.vy = item.scatterVy;
        }
      }

      // Scatter physics: particles fly outward across screen with atmospheric drag
      for (const item of this.fishParticles) {
        const p = item.particle;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        p.vx *= 0.92;
        p.vy *= 0.92;

        // Subtle shimmering expansion
        p.size = Math.max(1.2, p.size - 0.015 * dt);
      }

      if (progress >= 1.0 && !this.isFinished) {
        this.isFinished = true;
        this.onCompleteCallback?.();
        return true;
      }
    }

    return false;
  }

  public finish(): void {
    this.isFinished = true;
  }

  public getActiveParticles(): Particle[] {
    return this.fishParticles.map((item) => item.particle);
  }

  public isDone(): boolean {
    return this.isFinished;
  }
}
