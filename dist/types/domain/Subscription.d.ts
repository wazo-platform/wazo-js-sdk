type SubscriptionResponse = {
    config: Record<string, any>;
    events: string[];
    events_user_uuid: string;
    events_wazo_uuid: string;
    metadata: Record<string, any>;
    name: string;
    owner_tenant_uuid: string;
    owner_user_uuid: string;
    service: string;
    uuid: string;
};
type SubscriptionArguments = {
    name: string;
    events: string[];
    config: Record<string, any>;
    uuid: string;
    service: string;
    eventsUserUuid: string;
    eventsWazoUuid: string;
    metadata: Record<string, any>;
    ownerTenantUuid: string;
    ownerUserUuid: string;
};
declare class Subscription {
    name: string;
    events: string[];
    config: Record<string, any>;
    uuid: string;
    service: string;
    eventsUserUuid: string;
    eventsWazoUuid: string;
    metadata: Record<string, any>;
    ownerTenantUuid: string;
    ownerUserUuid: string;
    static parse(plain: SubscriptionResponse): Subscription;
    static parseMany(response: {
        items: [];
    }): Subscription[];
    constructor({ name, events, config, uuid, service, eventsUserUuid, eventsWazoUuid, metadata, ownerTenantUuid, ownerUserUuid, }: SubscriptionArguments);
}
export default Subscription;
//# sourceMappingURL=Subscription.d.ts.map