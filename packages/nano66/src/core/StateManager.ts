import type { NanoState } from "../types";

export class StateManager {
  private currentState: NanoState = "idle";
  private previousState: NanoState = "idle";
  private onStateChange?: (state: NanoState, previousState: NanoState) => void;

  constructor(onStateChange?: (state: NanoState, previousState: NanoState) => void) {
    this.onStateChange = onStateChange;
  }

  public getState(): NanoState {
    return this.currentState;
  }

  public getPreviousState(): NanoState {
    return this.previousState;
  }

  public is(state: NanoState): boolean {
    return this.currentState === state;
  }

  public isRunning(): boolean {
    return this.currentState === "constructing" || this.currentState === "attracting";
  }

  public transitionTo(nextState: NanoState): boolean {
    if (this.currentState === nextState) return false;
    if (this.currentState === "destroyed") {
      console.warn("[Nano66] Cannot transition state on a destroyed instance.");
      return false;
    }

    const prev = this.currentState;
    this.previousState = prev;
    this.currentState = nextState;

    this.onStateChange?.(nextState, prev);
    return true;
  }

  public reset(): void {
    this.previousState = "idle";
    this.currentState = "idle";
  }
}
