import type { Answer, StateProperties } from "@/cis-r/types";
import { State } from "@/cis-r/classes";
export * from "@/cis-r/classes";
export * from "@/cis-r/types";
export declare const _overall_navigation: (ans: Answer | undefined, state: State) => "overall-follow-up" | null;
export declare const _state_properties: StateProperties;
export declare const cis: State;
export declare const CIS: () => State;
