import Scope from "../enums/Scope"

export interface HybridCommand {
    info: Record<string, any>;
    legacy: Function,
    slash: Function;
    scope?: Scope[];
}