declare const _default: ({
    name: string;
    check: (server: string, session: import("../..").WazoSession) => Promise<void>;
} | {
    name: string;
    check: (server: string, session: any, externalAppConfig: Record<string, any>) => Promise<unknown>;
})[];
export default _default;
//# sourceMappingURL=index.d.ts.map