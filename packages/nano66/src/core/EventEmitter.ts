import type { Nano66Event, Nano66EventMap, Nano66EventListener } from "../types/events";

export class EventEmitter {
  private listeners: Map<Nano66Event, Set<Nano66EventListener<any>>> = new Map();

  public on<E extends Nano66Event>(event: E, listener: Nano66EventListener<E>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event)!;
    set.add(listener);

    return () => this.off(event, listener);
  }

  public off<E extends Nano66Event>(event: E, listener: Nano66EventListener<E>): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(listener);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  public emit<E extends Nano66Event>(event: E, ...args: Parameters<Nano66EventMap[E]>): void {
    const set = this.listeners.get(event);
    if (set) {
      for (const listener of set) {
        try {
          (listener as (...args: any[]) => void)(...args);
        } catch (err) {
          console.error(`[Nano66] Error in event listener for "${event}":`, err);
        }
      }
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
