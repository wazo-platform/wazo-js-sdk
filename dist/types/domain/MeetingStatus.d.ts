export type MeetingStatusResponse = {
    full: boolean;
};
export default class MeetingStatus {
    type: string;
    full: boolean;
    constructor({ full, }?: Record<string, any>);
    static parse(plain: MeetingStatusResponse): MeetingStatus;
}
//# sourceMappingURL=MeetingStatus.d.ts.map