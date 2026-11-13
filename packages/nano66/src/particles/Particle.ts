import type { ParticleState } from "../types";

export class Particle {
  public id: number = 0;
  public active: boolean = false;

  // Position
  public x: number = 0;
  public y: number = 0;

  // Target
  public targetX: number = 0;
  public targetY: number = 0;

  // Physics
  public vx: number = 0;
  public vy: number = 0;
  public ax: number = 0;
  public ay: number = 0;
  public speed: number = 1.0;

  // Visuals
  public size: number = 2.0;
  public baseSize: number = 2.0;
  public alpha: number = 0.0;
  public targetAlpha: number = 1.0;
  public color: number = 0xffffff;

  // State & Timing
  public state: ParticleState = "dead";
  public elementId: string = "";
  public life: number = 0;
  public maxLife: number = 1000;
  public seed: number = 0;

  // Progress metrics
  public arrivalDistance: number = 3.0; // distance in px considered "arrived"
  public hasArrived: boolean = false;

  constructor(id: number) {
    this.id = id;
    this.reset();
  }

  public reset(): void {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.speed = 1.0;
    this.size = 2.0;
    this.baseSize = 2.0;
    this.alpha = 0.0;
    this.targetAlpha = 1.0;
    this.color = 0xffffff;
    this.state = "dead";
    this.elementId = "";
    this.life = 0;
    this.maxLife = 1000;
    this.seed = 0;
    this.hasArrived = false;
  }

  public spawn(
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    color: number,
    size: number,
    alpha: number,
    speed: number,
    elementId: string,
    seed: number
  ): void {
    this.active = true;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    this.size = size;
    this.baseSize = size;
    this.alpha = 0.05;
    this.targetAlpha = alpha;
    this.speed = speed;
    this.elementId = elementId;
    this.seed = seed;
    this.state = "streaming";
    this.life = 0;
    this.hasArrived = false;

    // Initial launch velocity directed towards target with slight curve offset
    const dx = targetX - x;
    const dy = targetY - y;
    const launchSpeed = (2.5 + (seed % 3)) * speed;
    const angle = Math.atan2(dy, dx) + ((seed % 100) / 100 - 0.5) * 0.4;

    this.vx = Math.cos(angle) * launchSpeed;
    this.vy = Math.sin(angle) * launchSpeed;
  }

  public setTarget(targetX: number, targetY: number, elementId: string): void {
    this.targetX = targetX;
    this.targetY = targetY;
    this.elementId = elementId;
    this.hasArrived = false;
    this.state = "forming";
  }

  public attractToCursor(cursorX: number, cursorY: number): void {
    this.state = "attracting";
    this.targetX = cursorX;
    this.targetY = cursorY;
  }

  public dissolve(): void {
    if (this.state !== "attracting") {
      this.state = "dissolving";
    }
  }
}
