export interface HybridCommand {
    info: Record<string, any>,
    legacy: Function,
    slash: Function
}