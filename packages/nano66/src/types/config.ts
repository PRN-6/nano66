/**
 * Nano66 Configuration Types
 */

export type ThemeMode = "auto" | "dark" | "light";

export type AnimationMode = "sequential" | "grouped" | "parallel";

export type PerformancePreset = "low" | "balanced" | "ultra";

export interface IntroConfig {
  /**
   * Whether to play the 50-particle goldfish prologue animation.
   * The particles assemble into a swimming goldfish that undulates across the screen,
   * bursts/scatters outward, and then initiates website element construction.
   * Default: true
   */
  enabled?: boolean;

  /**
   * Number of particles forming the high-definition 3D goldfish prologue.
   * Default: 350
   */
  particleCount?: number;

  /**
   * Duration of the goldfish swimming sequence in milliseconds before scattering.
   * Default: 2600
   */
  duration?: number;

  /**
   * Color palette for the goldfish particles.
   * Default: ['#FFB800', '#FF8C00', '#FFA500', '#FFE082', '#FFFFFF']
   */
  colors?: string[];
}

export interface AnimationConfig {
  /**
   * Construction mode:
   * - 'sequential': Elements are formed one after another
   * - 'grouped': Elements sharing the same data-nano-group are formed together
   * - 'parallel': Elements are constructed with continuous staggered overlapping
   */
  mode?: AnimationMode;

  /**
   * Approximate total duration in milliseconds (if set), or per-element base duration
   */
  duration?: number;

  /**
   * Delay in milliseconds between element constructions in sequential/grouped mode
   */
  elementDelay?: number;

  /**
   * Whether particles are attracted into shapes
   */
  particleAttraction?: boolean;

  /**
   * Whether remaining particles converge toward cursor after all elements are formed
   */
  cursorExit?: boolean;

  /**
   * Progress threshold (0.1 to 1.0) at which the original HTML element is revealed.
   * Default: 0.8 (revealed when 80% formed)
   */
  revealThreshold?: number;

  /**
   * Stagger delay between parallel streams in ms
   */
  stagger?: number;

  /**
   * Whether particles from completed elements assemble into an organic swimming fish formation
   * and smoothly travel to the next element before scattering onto its target points.
   * Default: true
   */
  fishTransition?: boolean;

  /**
   * Base duration in ms of the swimming fish transition between consecutive elements.
   * Default: 750
   */
  transitionDuration?: number;
}

export interface ParticlesConfig {
  /**
   * Total particle count. If undefined, computed based on performance preset.
   */
  count?: number;

  /**
   * Particle size in CSS pixels: single number or [min, max] range.
   * Default: [1.2, 2.8]
   */
  size?: number | [number, number];

  /**
   * Particle color(s):
   * - 'auto': auto-detected based on background theme
   * - string: single hex/rgb color
   * - string[]: palette array
   */
  color?: string | string[] | "auto";

  /**
   * Particle velocity/speed multiplier.
   * Default: 1.0
   */
  speed?: number;

  /**
   * Particle opacity: single number or [min, max]
   * Default: [0.3, 0.95]
   */
  opacity?: number | [number, number];

  /**
   * Particle glow effect (additive blending)
   * Default: true
   */
  glow?: boolean;

  /**
   * Deterministic random seed for reproducible trajectories
   */
  seed?: number;
}

export interface PerformanceConfig {
  /**
   * Preset determining default particle count and quality:
   * - 'low': ~1,500 particles, simplified streams
   * - 'balanced': ~4,000 particles (default)
   * - 'ultra': ~8,000 particles, maximum fidelity
   */
  preset?: PerformancePreset;

  /**
   * Automatically scale particle count based on device capability & screen size
   * Default: true
   */
  adaptive?: boolean;

  /**
   * Maximum target FPS (typically 60 or 120)
   * Default: 60
   */
  maxFPS?: number;
}

export interface AccessibilityConfig {
  /**
   * If true, respects user's prefers-reduced-motion OS preference.
   * Default: true
   */
  respectReducedMotion?: boolean;

  /**
   * If reduced motion is active, immediately reveal elements without particle animation.
   * Default: true
   */
  immediateReveal?: boolean;
}

export interface Nano66Options {
  /**
   * Target container to scan and animate.
   * Can be a CSS selector string or HTMLElement.
   * Default: 'body'
   */
  target?: string | HTMLElement;

  /**
   * Animation options
   */
  animation?: AnimationConfig;

  /**
   * Particle simulation options
   */
  particles?: ParticlesConfig;

  /**
   * Background theme detection mode: 'auto' | 'dark' | 'light'
   * Default: 'auto'
   */
  theme?: ThemeMode;

  /**
   * Performance settings
   */
  performance?: PerformanceConfig;

  /**
   * Accessibility settings
   */
  accessibility?: AccessibilityConfig;

  /**
   * Cinematic intro options (50-particle swimming goldfish prologue)
   */
  intro?: IntroConfig;
}

/**
 * Normalized configuration with all defaults resolved.
 */
export interface ResolvedNano66Config {
  target: HTMLElement;
  animation: Required<AnimationConfig>;
  particles: {
    count: number;
    size: [number, number];
    color: string | string[] | "auto";
    speed: number;
    opacity: [number, number];
    glow: boolean;
    seed: number;
  };
  theme: ThemeMode;
  performance: Required<PerformanceConfig>;
  accessibility: Required<AccessibilityConfig>;
  intro: Required<IntroConfig>;
}
