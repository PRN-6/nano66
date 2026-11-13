export class CursorAttraction {
  private cursorX: number = 0;
  private cursorY: number = 0;
  private hasCursorMoved: boolean = false;
  private isListening: boolean = false;

  constructor() {
    this.cursorX = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
    this.cursorY = typeof window !== "undefined" ? window.innerHeight / 2 : 500;
  }

  public startListening(): void {
    if (this.isListening || typeof window === "undefined") return;

    window.addEventListener("mousemove", this.handleMouseMove, { passive: true });
    window.addEventListener("pointermove", this.handleMouseMove, { passive: true });
    window.addEventListener("touchmove", this.handleTouchMove, { passive: true });
    this.isListening = true;
  }

  private handleMouseMove = (e: MouseEvent | PointerEvent): void => {
    this.cursorX = e.clientX;
    this.cursorY = e.clientY;
    this.hasCursorMoved = true;
  };

  private handleTouchMove = (e: TouchEvent): void => {
    const touch = e.touches[0];
    if (touch) {
      this.cursorX = touch.clientX;
      this.cursorY = touch.clientY;
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
