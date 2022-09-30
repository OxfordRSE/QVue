import type { CounterSet, Item, State } from "./classes";

export type StateProperties = {
  items: Item[];
  onComplete: (state: State) => void;
};

export type Answer = {
  value: number;
  text?: string;
};

export type CounterOperation = {
  owner: Item;
  operation: (current_value: number) => number;
};
export type ProcessAnswerFun = (answer: Answer | undefined, state: State) => void;
export type NextItemFun = (answer: Answer | undefined, state: State) => string | null;

export enum ItemType {
  NONE,
  RADIO,
  NUMBER,
}

export type ItemProperties = {
  id: string;
  question: string;
  type?: ItemType;
  answer_options?: Answer[];
  process_answer_fun?: ProcessAnswerFun;
  next_item?: string;
  next_item_fun?: NextItemFun;
};
