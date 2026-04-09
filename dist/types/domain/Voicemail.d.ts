import { Calld } from '@wazo/types';
export declare const VoicemailFolder: {
    readonly NEW: "new";
    readonly OLD: "old";
    readonly URGENT: "urgent";
    readonly OTHER: "other";
};
export type VoicemailFolderType = typeof VoicemailFolder[keyof typeof VoicemailFolder];
type MessageResponse = {
    caller_id_name: string;
    caller_id_num: string;
    duration: number;
    id: string;
    folder?: Record<string, any>;
    timestamp: number;
    voicemail?: VoicemailBox;
};
export type VoicemailBox = {
    id: string;
    name: string;
    accesstype: string;
};
export type Response = {
    id: string;
    name: string;
    number: string;
    folders: Array<{
        id: string;
        name: string;
        type: VoicemailFolderType;
        messages: Array<MessageResponse>;
    }>;
    voicemail?: VoicemailBox;
};
type VoicemailArguments = {
    id: string;
    date: Date;
    duration: number;
    caller: {
        name: string;
        number: string;
    };
    unread?: boolean | null | undefined;
    mailbox?: VoicemailBox;
};
export default class Voicemail {
    type: string;
    id: string;
    date: Date;
    duration: number;
    unread: boolean | null | undefined;
    mailbox?: VoicemailBox;
    caller: {
        name: string;
        number: string;
    };
    static parse(plain: MessageResponse): Voicemail;
    static parseMany(plain: Response): Array<Voicemail>;
    static parseListData(plain: Calld.MeVoicemailsMessagesListData): Array<Voicemail>;
    static newFrom(profile: Voicemail): any;
    static getFolderMappingFromType(folder: VoicemailFolderType): 1 | 2 | 3 | 4;
    constructor({ id, date, duration, caller, unread, mailbox, }: VoicemailArguments);
    is(other: Voicemail): boolean;
    acknowledge(): this;
    makeAsUnRead(): this;
    isPersonal(): boolean;
    contains(query: string): boolean;
}
export {};
//# sourceMappingURL=Voicemail.d.ts.map