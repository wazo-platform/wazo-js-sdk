import type { Device } from "./Device";
export default class DebugDevice implements Device {
    connectToCall(): void;
    disconnectFromCall(): void;
    ringback(): void;
    stopRingback(): void;
    playRingtone(): void;
    stopRingtone(): void;
    mute(): void;
    unmute(): void;
    putOnSpeaker(): void;
    putOffSpeaker(): void;
}
//# sourceMappingURL=DebugDevice.d.ts.map