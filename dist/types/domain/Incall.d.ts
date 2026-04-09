import { ExtensionRelation } from './types';
export type GenericIncall = {
    id: number;
    extensions: ExtensionRelation[];
    [key: string]: any;
};
export type IncallArguments = {
    id?: number;
    extensions?: ExtensionRelation[];
};
export default class Incall {
    id: number | undefined;
    extensions: ExtensionRelation[] | undefined;
    extension: string | undefined;
    readonly type: string;
    constructor({ id, extensions }?: IncallArguments);
    static parse(plain: GenericIncall): Incall;
    static newFrom(profile: Incall): any;
    hasExtension(extension: string): boolean;
}
//# sourceMappingURL=Incall.d.ts.map