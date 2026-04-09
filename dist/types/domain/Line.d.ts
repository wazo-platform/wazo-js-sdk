import type { ExtensionRelation, Link } from './types';
export type Endpoint = {
    id: number;
    links: Link[];
    username?: string;
};
export type LineResponse = {
    endpoint_custom: Endpoint | null | undefined;
    endpoint_sccp: Endpoint | null | undefined;
    endpoint_sip: Endpoint | null | undefined;
    extensions: ExtensionRelation[];
    id: number;
};
type LineArguments = {
    id?: number;
    extensions?: ExtensionRelation[];
    endpointCustom?: Endpoint | null;
    endpointSccp?: Endpoint | null;
    endpointSip?: Endpoint | null;
};
export default class Line {
    type: string;
    id: number | undefined;
    extensions: ExtensionRelation[] | undefined;
    endpointCustom: Endpoint | null;
    endpointSccp: Endpoint | null;
    endpointSip: Endpoint | null;
    static parse(plain: LineResponse): Line;
    static newFrom(profile: Line): any;
    is(line: Line | null | undefined): boolean;
    hasExtension(extension: string): boolean;
    constructor({ id, extensions, endpointCustom, endpointSccp, endpointSip, }?: LineArguments);
}
export {};
//# sourceMappingURL=Line.d.ts.map