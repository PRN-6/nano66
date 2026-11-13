import { describe, it, expect, vi } from "vitest";
import { StateManager } from "../../src/core/StateManager";
import { EventEmitter } from "../../src/core/EventEmitter";

describe("StateManager", () => {
  it("transitions between states and notifies listener", () => {
    const callback = vi.fn();
    const sm = new StateManager(callback);

    expect(sm.getState()).toBe("idle");
    expect(sm.is("idle")).toBe(true);

    const changed = sm.transitionTo("scanning");
    expect(changed).toBe(true);
    expect(sm.getState()).toBe("scanning");
    expect(sm.getPreviousState()).toBe("idle");
    expect(callback).toHaveBeenCalledWith("scanning", "idle");

    // Idempotent transition should return false
    expect(sm.transitionTo("scanning")).toBe(false);

    sm.transitionTo("constructing");
    expect(sm.isRunning()).toBe(true);
  });
});

describe("EventEmitter", () => {
  it("registers listeners and emits events with arguments", () => {
    const emitter = new EventEmitter();
    const startFn = vi.fn();
    const progressFn = vi.fn();

    const unsubStart = emitter.on("start", startFn);
    emitter.on("progress", progressFn);

    emitter.emit("start");
    expect(startFn).toHaveBeenCalledTimes(1);

    emitter.emit("progress", 0.75);
    expect(progressFn).toHaveBeenCalledWith(0.75);

    unsubStart();
    emitter.emit("start");
    expect(startFn).toHaveBeenCalledTimes(1);
  });
});
