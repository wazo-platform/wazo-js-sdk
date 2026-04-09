export type RecordingResponse = {
    deleted: boolean;
    end_time: string | null | undefined;
    filename: string;
    start_time: string;
    uuid: string;
};
type RecordingArguments = {
    deleted: boolean;
    end: Date | null | undefined;
    fileName: string;
    start: Date;
    uuid: string;
};
export default class Recording {
    deleted: boolean;
    end: Date | null | undefined;
    fileName: string;
    start: Date;
    uuid: string;
    static parseMany(recordings?: RecordingResponse[]): Recording[];
    static parse(plain: RecordingResponse): Recording;
    constructor({ deleted, end, fileName, start, uuid, }: RecordingArguments);
}
export {};
//# sourceMappingURL=Recording.d.ts.map