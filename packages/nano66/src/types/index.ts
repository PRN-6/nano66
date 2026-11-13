export * from "./config";
export * from "./events";

export type NanoState =
  | "idle"
  | "ready"
  | "scanning"
  | "concealing"
  | "intro"
  | "constructing"
  | "attracting"
  | "completed"
  | "paused"
  | "destroyed";

export type NanoElementType =
  | "heading"
  | "text"
  | "button"
  | "image"
  | "card"
  | "icon"
  | "navigation"
  | "container";

export interface Point {
  x: number;
  y: number;
  color?: string;
  alpha?: number;
  size?: number;
}

export type ElementConstructionState = "pending" | "forming" | "revealed" | "complete";

export interface NanoElement {
  id: string;
  element: HTMLElement;
  order: number;
  group: string;
  type: NanoElementType;
  rect: DOMRect;
  computedStyle: {
    color: string;
    backgroundColor: string;
    borderColor: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    lineHeight: string;
    textAlign: string;
    borderRadius: string;
    visibility: string;
    opacity: string;
  };
  targets: Point[];
  state: ElementConstructionState;
  startTime?: number;
  duration?: number;
}

export type ParticleState =
  | "spawning"
  | "streaming"
  | "forming"
  | "settled"
  | "dissolving"
  | "attracting"
  | "dead";
