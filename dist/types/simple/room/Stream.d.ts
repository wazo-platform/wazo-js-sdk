import type Participant from './Participant';
declare class Stream {
    htmlStream: MediaStream;
    participant: Participant | undefined;
    static detachStream(stream: MediaStream): void;
    constructor(htmlStream: MediaStream, participant?: Participant);
    attach(rawElement: HTMLVideoElement | null | undefined): HTMLVideoElement;
    detach(): void;
    hasVideo(): boolean;
    get id(): string | null;
}
export default Stream;
//# sourceMappingURL=Stream.d.ts.map