import type { Answer, CounterOperation, ItemProperties, NextItemFun, ProcessAnswerFun, StateProperties } from "./types";
import { ItemType } from "./types";
export declare class State {
    readonly counters: CounterSet;
    readonly items: Item[];
    readonly onComplete: (state: State) => void;
    private _data;
    current_item: Item | undefined;
    item_history: Item[];
    constructor(props: StateProperties);
    next_q(ans: Answer | undefined): void;
    last_q(): void;
    getItemById(id: string): Item;
    get data(): any;
    set data(value: any);
}
export declare class Counter {
    _name: string;
    _operations: CounterOperation[];
    _initial_value: number;
    constructor(name: string, initial_value?: number);
    set name(s: string);
    get name(): string;
    /**
     * Register an Item's setting of the counter value
     */
    set_value(new_value: number, source: Item): void;
    get value(): number;
    /**
     * Register an Item's incrementing of the counter value
     */
    increment_value(increment: number, source: Item): void;
    /**
     * Remove all operations associated with an Item
     */
    revert(source: Item): void;
}
export declare class CounterSet {
    counters: Counter[];
    private readonly _state;
    constructor(state: State);
    _find_counter(name: string): Counter;
    _create_counter(name: string, initial_value: number): Counter;
    /**
     * Return the value of a counter, or default_value if the counter
     * does not exist yet. If default_value is null and the counter
     * does not yet exist, throw an error.
     */
    get(name: string, default_value?: number | null): number;
    /**
     * Register Item setting Counter to Value
     */
    set(name: string, value: number, source?: Item): void;
    /**
     * Register Item incrementing Counter by Value
     */
    increment(name: string, value: number, source?: Item): void;
    /**
     * Remove all Item's actions for all counters
     */
    revert(source: Item): void;
}
export declare class Item {
    readonly id: string;
    readonly question: string;
    readonly answer_options: Answer[];
    readonly type: ItemType;
    readonly handleAnswer: ProcessAnswerFun;
    readonly getNextItemId: NextItemFun;
    readonly conditional_routing: boolean;
    private _answer;
    constructor(props: ItemProperties);
    get answer(): Answer | undefined;
    set answer(value: Answer | undefined);
    next_item(answer: Answer | undefined, state: State): Item | undefined;
}