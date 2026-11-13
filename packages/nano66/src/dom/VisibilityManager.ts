export class VisibilityManager {
  private concealedElements: Set<HTMLElement> = new Set();
  private originalInlineStyles: Map<HTMLElement, string | null> = new Map();
  private styleSheet: HTMLStyleElement | null = null;
  private readonly CLASS_NAME = "nano66-concealed";

  constructor() {
    this.injectStyles();
  }

  private injectStyles(): void {
    if (typeof document === "undefined") return;

    if (!document.getElementById("nano66-visibility-styles")) {
      const style = document.createElement("style");
      style.id = "nano66-visibility-styles";
      style.textContent = `
        .${this.CLASS_NAME} {
          visibility: hidden !important;
          pointer-events: none !important;
        }
        .nano66-revealing {
          animation: nano66FadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes nano66FadeIn {
          from {
            opacity: 0;
            visibility: visible;
          }
          to {
            opacity: 1;
            visibility: visible;
          }
        }
      `;
      document.head.appendChild(style);
      this.styleSheet = style;
    }
  }

  /**
   * Conceal an element visually without affecting layout
   */
  public conceal(el: HTMLElement): void {
    if (this.concealedElements.has(el)) return;

    // Save previous inline style if any
    this.originalInlineStyles.set(el, el.getAttribute("style"));
    el.classList.add(this.CLASS_NAME);
    this.concealedElements.add(el);
  }

  /**
   * Reveal an element smoothly
   */
  public reveal(el: HTMLElement): void {
    if (!this.concealedElements.has(el)) return;

    el.classList.remove(this.CLASS_NAME);
    el.classList.add("nano66-revealing");
    this.concealedElements.delete(el);

    // Remove animation class after transition completes
    setTimeout(() => {
      el.classList.remove("nano66-revealing");
    }, 400);
  }

  /**
   * Reveal all remaining concealed elements immediately
   */
  public revealAll(): void {
    for (const el of this.concealedElements) {
      el.classList.remove(this.CLASS_NAME);
    }
    this.concealedElements.clear();
  }

  /**
   * Restore all DOM elements to their exact original state
   */
  public restore(): void {
    this.revealAll();

    for (const [el, originalStyle] of this.originalInlineStyles) {
      if (originalStyle !== null) {
        el.setAttribute("style", originalStyle);
      } else {
        el.removeAttribute("style");
      }
      el.classList.remove("nano66-revealing");
      el.classList.remove(this.CLASS_NAME);
    }

    this.originalInlineStyles.clear();

    if (this.styleSheet && this.styleSheet.parentNode) {
      this.styleSheet.parentNode.removeChild(this.styleSheet);
      this.styleSheet = null;
    }
  }
}
