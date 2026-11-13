import { Particle } from "./Particle";
import { MathUtils } from "../utils/MathUtils";

export class ParticlePhysics {
  /**
   * Update physics for a single particle over delta ms
   */
  public static update(
    p: Particle,
    delta: number,
    globalTime: number,
    cursorX: number = 0,
    cursorY: number = 0
  ): boolean {
    if (!p.active) return false;

    p.life += delta;
    const dt = Math.min(delta / 16.67, 2.0); // Normalized time step (1.0 = ~60fps)

    switch (p.state) {
      case "streaming": {
        // Fade in rapidly
        if (p.alpha < p.targetAlpha) {
          p.alpha = Math.min(p.targetAlpha, p.alpha + 0.06 * dt);
        }

        // Apply organic curl/flow force
        const flow = MathUtils.flowField(p.x, p.y, globalTime + p.seed * 50);
        const flowWeight = 1.0 * p.speed;

        // Attractive force towards target
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        const pullSpeed = Math.min(5.0, Math.max(1.2, dist * 0.035)) * p.speed;
        const nx = dist > 0 ? dx / dist : 0;
        const ny = dist > 0 ? dy / dist : 0;

        p.vx += (flow.vx * flowWeight + nx * pullSpeed) * dt * 0.4;
        p.vy += (flow.vy * flowWeight + ny * pullSpeed) * dt * 0.4;

        // Drag / air resistance
        p.vx *= 0.93;
        p.vy *= 0.93;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Transition to forming when close to target or after time
        if (dist < 80 || p.life > 1200) {
          p.state = "forming";
        }
        break;
      }

      case "forming": {
        // Fade in to target alpha
        if (p.alpha < p.targetAlpha) {
          p.alpha = Math.min(p.targetAlpha, p.alpha + 0.08 * dt);
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Spring attraction to exact target
        const spring = 0.12 * p.speed;
        const damping = 0.80;

        p.vx += dx * spring * dt;
        p.vy += dy * spring * dt;

        p.vx *= damping;
        p.vy *= damping;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (dist <= p.arrivalDistance || dist < 2.0) {
          p.hasArrived = true;
          // Snap tightly
          if (dist < 1.0) {
            p.x = p.targetX;
            p.y = p.targetY;
            p.vx = 0;
            p.vy = 0;
            p.state = "settled";
          }
        }
        break;
      }

      case "settled": {
        // Microscopic breathing / subtle life jitter
        const t = (globalTime * 0.002 + p.seed) % (Math.PI * 2);
        const jitterX = Math.cos(t) * 0.25;
        const jitterY = Math.sin(t) * 0.25;

        p.x = p.targetX + jitterX;
        p.y = p.targetY + jitterY;
        p.hasArrived = true;
        break;
      }

      case "dissolving": {
        // Gently fade out into the revealed HTML element
        p.alpha -= 0.045 * dt;
        p.size = Math.max(0.1, p.size - 0.02 * dt);
        const t = (globalTime * 0.003 + p.seed) % (Math.PI * 2);
        p.x += Math.cos(t) * 0.3 * dt;
        p.y += Math.sin(t) * 0.3 * dt;

        if (p.alpha <= 0.02) {
          p.active = false;
          p.state = "dead";
          return false;
        }
        break;
      }

      case "attracting": {
        // Converge toward cursor
        const dx = cursorX - p.x;
        const dy = cursorY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 10 || p.alpha < 0.02 || p.size < 0.3) {
          p.active = false;
          p.state = "dead";
          return false; // Particle consumed by cursor
        }

        // Swirling vortex physics toward cursor
        const normalX = dx / dist;
        const normalY = dy / dist;
        const tangentX = -normalY;
        const tangentY = normalX;

        // Combine attraction + orbital swirl
        const pullSpeed = Math.min(12, Math.max(3, dist * 0.08)) * p.speed;
        const swirlStrength = Math.min(5, 80 / (dist + 10));

        p.vx = (normalX * pullSpeed + tangentX * swirlStrength) * dt;
        p.vy = (normalY * pullSpeed + tangentY * swirlStrength) * dt;

        p.x += p.vx;
        p.y += p.vy;

        // Shrink and fade
        p.size = Math.max(0.1, p.size - 0.04 * dt);
        p.alpha = Math.max(0, p.alpha - 0.025 * dt);
        break;
      }

      case "dead": {
        return false;
      }
    }

    return true;
  }
}
