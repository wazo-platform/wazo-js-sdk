import type Session from '../domain/Session';
declare class Checker {
    session: Session;
    server: string;
    externalAppConfig: Record<string, any>;
    checks: Record<string, any>[];
    constructor(server: string, session: Session, externalAppConfig?: Record<string, any>);
    check(onCheckBegin?: (...args: Array<any>) => any, onCheckResult?: (...args: Array<any>) => any): Promise<void>;
    addCheck(check: Record<string, any>): void;
    _addEngineVersion(): Promise<void>;
}
export default Checker;
//# sourceMappingURL=Checker.d.ts.map