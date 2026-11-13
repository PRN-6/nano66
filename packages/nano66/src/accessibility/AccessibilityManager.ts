import type { AccessibilityConfig } from "../types";

export class AccessibilityManager {
  private config: Required<AccessibilityConfig>;
  private mediaQueryList: MediaQueryList | null = null;
  private isReducedMotion: boolean = false;
  private onChange?: (reduced: boolean) => void;

  constructor(config: AccessibilityConfig = {}, onChange?: (reduced: boolean) => void) {
    this.config = {
      respectReducedMotion: config.respectReducedMotion ?? true,
      immediateReveal: config.immediateReveal ?? true,
    };
    this.onChange = onChange;
    this.initMediaQuery();
  }

  private initMediaQuery(): void {
    if (typeof window !== "undefined" && window.matchMedia) {
      this.mediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.isReducedMotion = this.mediaQueryList.matches;

      // Listen for runtime changes
      if (this.mediaQueryList.addEventListener) {
        this.mediaQueryList.addEventListener("change", this.handleMediaChange);
      } else if ("addListener" in this.mediaQueryList) {
        // Legacy support
        (this.mediaQueryList as any).addListener(this.handleMediaChange);
      }
    }
  }

  private handleMediaChange = (e: MediaQueryListEvent): void => {
    this.isReducedMotion = e.matches;
    this.onChange?.(this.isReducedMotion);
  };

  public shouldSkipAnimation(): boolean {
    return this.config.respectReducedMotion && this.isReducedMotion && this.config.immediateReveal;
  }

  public getReducedMotion(): boolean {
    return this.isReducedMotion;
  }

  public destroy(): void {
    if (this.mediaQueryList) {
      if (this.mediaQueryList.removeEventListener) {
        this.mediaQueryList.removeEventListener("change", this.handleMediaChange);
      } else if ("removeListener" in this.mediaQueryList) {
        (this.mediaQueryList as any).removeListener(this.handleMediaChange);
      }
      this.mediaQueryList = null;
    }
  }
}
