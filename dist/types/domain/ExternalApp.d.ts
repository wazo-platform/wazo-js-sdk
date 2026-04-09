type Response = {
    name: string;
    configuration: Record<string, any>;
};
type ListResponse = {
    items: Response[];
};
type Arguments = {
    name?: string;
    configuration?: Record<string, any>;
};
export default class ExternalApp {
    name: string | undefined;
    type: string;
    configuration?: Record<string, any>;
    static parse(plain: Response): ExternalApp;
    static parseMany(plain: ListResponse): ExternalApp[];
    static newFrom(profile: ExternalApp): any;
    constructor({ name, configuration, }?: Arguments);
}
export {};
//# sourceMappingURL=ExternalApp.d.ts.map