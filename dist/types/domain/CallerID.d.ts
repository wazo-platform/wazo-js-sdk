type Response = {
    number?: string;
    type: 'main' | 'associated' | 'anonymous';
    caller_id_name?: string;
};
type ListResponse = {
    items: Response[];
};
type Arguments = {
    number?: string;
    type: 'main' | 'associated' | 'anonymous';
    callerIdName?: string;
};
export default class CallerID {
    number?: string;
    idType: 'main' | 'associated' | 'anonymous';
    type: string;
    callerIdName?: string;
    static parse(plain: Response): CallerID;
    static parseMany(plain: ListResponse): CallerID[];
    static newFrom(profile: CallerID): any;
    constructor({ type, number, callerIdName, }: Arguments);
}
export {};
//# sourceMappingURL=CallerID.d.ts.map