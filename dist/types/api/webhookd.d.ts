import ApiRequester from '../utils/api-requester';
import Subscription from '../domain/Subscription';
type CreatePayload = {
    config: {
        body: string;
        content_type: string;
        method: string;
        url: string;
        verify_certificate: string;
    };
    events: string[];
    name: string;
    service: string;
    tags: Record<string, any>;
};
declare const _default: (client: ApiRequester, baseUrl: string) => {
    getSubscriptions: () => Promise<Subscription[]>;
    getSubscription: (uuid: string) => Promise<Subscription>;
    createSubscription: (payload: CreatePayload) => Promise<Subscription>;
    removeSubscription: (uuid: string) => Promise<Subscription>;
};
export default _default;
//# sourceMappingURL=webhookd.d.ts.map