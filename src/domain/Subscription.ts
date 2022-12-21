import { $Shape } from 'utility-types';

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
  config: string;
  uuid: string;
  service: string;
  eventsUserUuid: string;
  eventsWazoUuid: string;
  metadata: Record<string, any>;
  ownerTenantUuid: string;
  ownerUserUuid: string;
};

class Subscription {
  name: string;

  events: string[];

  config: string;

  uuid: string;

  service: string;

  eventsUserUuid: string;

  eventsWazoUuid: string;

  metadata: Record<string, any>;

  ownerTenantUuid: string;

  ownerUserUuid: string;

  static parse(plain: SubscriptionResponse): Subscription {
    return new Subscription({
      name: plain.name,
      events: plain.events,
      config: plain.config,
      uuid: plain.uuid,
      service: plain.service,
      eventsUserUuid: plain.events_user_uuid,
      eventsWazoUuid: plain.events_wazo_uuid,
      metadata: plain.metadata,
      ownerTenantUuid: plain.owner_tenant_uuid,
      ownerUserUuid: plain.owner_user_uuid,
    });
  }

  static parseMany(response: {
    items: SubscriptionResponse[];
  }): Subscription[] {
    return response.items.map(payload => Subscription.parse(payload));
  }

  constructor({
    name,
    events,
    config,
    uuid,
    service,
    eventsUserUuid,
    eventsWazoUuid,
    metadata,
    ownerTenantUuid,
    ownerUserUuid,
  }: $Shape<SubscriptionArguments>) {
    this.name = name;
    this.events = events;
    this.config = config;
    this.uuid = uuid;
    this.service = service;
    this.eventsUserUuid = eventsUserUuid;
    this.eventsWazoUuid = eventsWazoUuid;
    this.metadata = metadata;
    this.ownerTenantUuid = ownerTenantUuid;
    this.ownerUserUuid = ownerUserUuid;
  }

}

export default Subscription;
