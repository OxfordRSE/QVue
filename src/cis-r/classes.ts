import type {
  Answer,
  CounterOperation,
  ItemProperties,
  NextItemFun,
  ProcessAnswerFun,
  StateProperties,
} from "./types";
import { ItemType } from "./types";

export class State {
  readonly counters: CounterSet;
  readonly items: Item[];
  readonly onComplete: (state: State) => void;

  private _data: any;
  current_item: Item | undefined;
  item_history: Item[] = [];

  constructor(props: StateProperties) {
    this.items = props.items;
    this.onComplete = props.onComplete;
    this.counters = new CounterSet(this);

    this.current_item = this.items[0];
  }

  next_q(ans: Answer | undefined) {
    if (typeof this.current_item === "undefined") {
      throw "Cannot process next_q for undefined current_item";
    }
    // Process answer
    if (!ans && this.current_item.type !== ItemType.NONE) {
      console.warn(`Question ${this.current_item.id} must have an answer.`);
      return;
    }
    this.current_item.answer = ans;
    this.current_item.handleAnswer(ans, this);
    this.item_history.push(this.current_item);
    this.current_item = this.current_item.next_item(ans, this);
    if (!this.current_item) this.onComplete(this);
  }

  last_q() {
    const q = this.item_history.pop();
    if (!q) {
      console.warn("No history to go_back to.");
      return;
    }
    this.counters.revert(q);
    this.current_item = q;
  }

  getItemById(id: string): Item {
    const item = this.items.find(i => i.id === id);
    if (!item) throw `Cannot find item with id ${id}`;
    return item;
  }

  get data(): any {
    return this._data;
  }

  set data(value: any) {
    this._data = value;
  }
}

export class Counter {
  _name: string;
  _operations: CounterOperation[] = [];
  _initial_value: number;

  constructor(name: string, initial_value: number = 0) {
    if (!name.length) throw "A Counter must have a name";
    this._name = name;
    this._initial_value = initial_value;
  }

  set name(s: string) {
    this._name = s;
  }

  get name(): string {
    return this._name;
  }

  /**
   * Register an Item's setting of the counter value
   */
  set_value(new_value: number, source: Item) {
    this._operations.push({
      owner: source,
      operation: () => new_value,
    });
  }

  get value(): number {
    let value: number = this._initial_value;
    this._operations.forEach((o) => (value = o.operation(value)));
    return value;
  }

  /**
   * Register an Item's incrementing of the counter value
   */
  increment_value(increment: number, source: Item): void {
    this._operations.push({
      owner: source,
      operation: (x) => x + increment,
    });
  }

  /**
   * Remove all operations associated with an Item
   */
  revert(source: Item): void {
    this._operations = this._operations.filter((o) => o.owner !== source);
  }
}

export class CounterSet {
  counters: Counter[] = [];
  private readonly _state: State;

  constructor(state: State) {
    this._state = state;
  }

  _find_counter(name: string): Counter {
    const counter: Counter | undefined = this.counters.find(
      (c) => c.name === name
    );
    if (!counter) throw `No counter found named ${name}`;
    return counter;
  }

  _create_counter(name: string, initial_value: number): Counter {
    const counter: Counter = new Counter(name, initial_value);
    this.counters.push(counter);
    return counter;
  }

  get(name: string): number {
    return this._find_counter(name).value;
  }

  /**
   * Register Item setting Counter to Value
   */
  set(name: string, value: number, source?: Item) {
    if (!source) {
      if (this._state.current_item) source = this._state.current_item;
      else throw "Cannot determine counter operation source";
    }
    let counter: Counter;
    try {
      counter = this._find_counter(name);
    } catch (e) {
      counter = this._create_counter(name, value);
    }
    counter.set_value(value, source);
  }

  /**
   * Register Item incrementing Counter by Value
   */
  increment(name: string, value: number, source?: Item): void {
    if (!source) {
      if (this._state.current_item) source = this._state.current_item;
      else throw "Cannot determine counter operation source";
    }
    let counter: Counter;
    try {
      counter = this._find_counter(name);
      counter.increment_value(value, source);
    } catch (e) {
      counter = this._create_counter(name, value);
    }
  }

  /**
   * Remove all Item's actions for all counters
   */
  revert(source: Item) {
    this.counters.forEach((c) => c.revert(source));
  }
}

export class Item {
  readonly id: string;
  readonly question: string;
  readonly answer_options: Answer[];
  readonly type: ItemType;
  readonly handleAnswer: ProcessAnswerFun;
  readonly getNextItemId: NextItemFun;
  private _answer: Answer | undefined;

  constructor(props: ItemProperties) {
    if (!props.id) throw "An Item must have an id";
    this.id = props.id;
    if (!props.question) throw "An Item must have a question";
    this.question = props.question;
    this.answer_options = props.answer_options || [];
    this.type =
      props.type ||
      (this.answer_options.length ? ItemType.RADIO : ItemType.NONE);
    this.handleAnswer = props.process_answer_fun || function () {};
    if (props.next_item_fun) this.getNextItemId = props.next_item_fun;
    else this.getNextItemId = () => props.next_item || null;
  }

  get answer(): Answer | undefined {
    return this._answer;
  }

  set answer(value: Answer | undefined) {
    this._answer = value;
  }

  next_item(answer: Answer | undefined, state: State): Item {
    const item_id = this.getNextItemId(answer, state);
    const item = state.items.find((i) => i.id === item_id);
    if (!item) throw `Cannot find item with id ${item_id}`;
    return item;
  }
}
