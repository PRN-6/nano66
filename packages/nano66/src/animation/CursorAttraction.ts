export class CursorAttraction {
  private cursorX: number = 0;
  private cursorY: number = 0;
  private hasCursorMoved: boolean = false;
  private isListening: boolean = false;

  constructor() {
    const scrollX = typeof window !== "undefined" ? window.scrollX || 0 : 0;
    const scrollY = typeof window !== "undefined" ? window.scrollY || 0 : 0;
    this.cursorX = typeof window !== "undefined" ? window.innerWidth / 2 + scrollX : 500;
    this.cursorY = typeof window !== "undefined" ? window.innerHeight / 2 + scrollY : 500;
  }

  public startListening(): void {
    if (this.isListening || typeof window === "undefined") return;

    window.addEventListener("mousemove", this.handleMouseMove, { passive: true });
    window.addEventListener("pointermove", this.handleMouseMove, { passive: true });
    window.addEventListener("touchmove", this.handleTouchMove, { passive: true });
    this.isListening = true;
  }

  private handleMouseMove = (e: MouseEvent | PointerEvent): void => {
    const scrollX = typeof window !== "undefined" ? window.scrollX || 0 : 0;
    const scrollY = typeof window !== "undefined" ? window.scrollY || 0 : 0;
    this.cursorX = e.clientX + scrollX;
    this.cursorY = e.clientY + scrollY;
    this.hasCursorMoved = true;
  };

  private handleTouchMove = (e: TouchEvent): void => {
    const touch = e.touches[0];
    if (touch) {
      const scrollX = typeof window !== "undefined" ? window.scrollX || 0 : 0;
      const scrollY = typeof window !== "undefined" ? window.scrollY || 0 : 0;
      this.cursorX = touch.clientX + scrollX;
      this.cursorY = touch.clientY + scrollY;
      this.hasCursorMoved = true;
    }
  };

  public getCursorPosition(): { x: number; y: number; moved: boolean } {
    return {
      x: this.cursorX,
      y: this.cursorY,
      moved: this.hasCursorMoved,
    };
  }

  public stopListening(): void {
    if (!this.isListening || typeof window === "undefined") return;

    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("pointermove", this.handleMouseMove);
    window.removeEventListener("touchmove", this.handleTouchMove);
    this.isListening = false;
  }

  public destroy(): void {
    this.stopListening();
  }
}
