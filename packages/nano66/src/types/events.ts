import type { NanoElement, NanoState } from "./index";

export interface Nano66EventMap {
  ready: () => void;
  introStart: () => void;
  introScatter: () => void;
  start: () => void;
  elementStart: (element: NanoElement) => void;
  elementReveal: (element: NanoElement) => void;
  elementComplete: (element: NanoElement) => void;
  progress: (progress: number) => void;
  complete: () => void;
  error: (error: Error) => void;
  destroy: () => void;
  pause: () => void;
  resume: () => void;
  stateChange: (state: NanoState, previousState: NanoState) => void;
}

export type Nano66Event = keyof Nano66EventMap;
export type Nano66EventListener<E extends Nano66Event> = Nano66EventMap[E];
