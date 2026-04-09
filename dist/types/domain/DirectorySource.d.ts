import type { UUID } from './types';
export type DirectorySource = {
    backend: string;
    name: string;
    tenant_uuid: UUID;
    uuid: UUID;
};
export type DirectorySources = {
    filtered: number;
    total: number;
    items: DirectorySource[];
};
//# sourceMappingURL=DirectorySource.d.ts.map