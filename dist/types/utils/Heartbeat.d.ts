declare class Heartbeat {
    heartbeatDelay: number;
    heartbeatTimeout: number;
    maxHeartbeats: number;
    hasHeartbeat: boolean;
    _heartbeatDelayTimeout: NodeJS.Timeout | string | number | undefined;
    _heartbeatNotReceivedTimeout: NodeJS.Timeout | string | number | undefined;
    _heartbeatTries: number;
    _sendHeartbeatCallback: ((...args: Array<any>) => any) | null | undefined;
    _onTimeoutCallback: ((...args: Array<any>) => any) | null | undefined;
    constructor(heartbeatDelay?: number, heartbeatTimeout?: number, maxHeartbeats?: number);
    setSendHeartbeat(cb: (...args: Array<any>) => any): void;
    setOnHeartbeatTimeout(cb: (...args: Array<any>) => any): void;
    stop(): void;
    start(): void;
    onHeartbeat(): void;
    _sendHeartbeat(): void;
    _clearTimeouts(): void;
}
export default Heartbeat;
//# sourceMappingURL=Heartbeat.d.ts.map