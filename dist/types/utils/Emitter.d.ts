import EventEmitter from 'events';
export interface IEmitter {
    eventEmitter: EventEmitter;
    on: (event: string, callback: (...args: Array<any>) => any) => void;
    once: (event: string, callback: (...args: Array<any>) => any) => void;
    off: (event: string, callback: (...args: Array<any>) => any) => void;
    unbind: () => void;
}
export default class Emitter implements IEmitter {
    eventEmitter: EventEmitter;
    constructor();
    on(event: string, callback: (...args: Array<any>) => any): void;
    once(event: string, callback: (...args: Array<any>) => any): void;
    off(event: string, callback: (...args: Array<any>) => any): void;
    unbind(): void;
}
//# sourceMappingURL=Emitter.d.ts.map