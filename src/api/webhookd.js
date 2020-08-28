/* @flow */
import ApiRequester from '../utils/api-requester';
import Subscription from '../domain/Subscription';

type CreatePayload = {
  config: {
    body: string,
    content_type: string,
    method: string,
    url: string,
    verify_certificate: string
  },
  events: string[],
  name: string,
  service: string,
  tags: Object
}

export default (client: ApiRequester, baseUrl: string) => ({
  getSubscriptions: (): Promise<Subscription[]> =>
    client.get(`${baseUrl}/agents/by-id/users/me/subscriptions`).then(Subscription.parseMany),

  getSubscription: (uuid: string): Promise<Subscription> =>
    client.get(`${baseUrl}/agents/by-id/users/me/subscriptions/${uuid}`).then(Subscription.parse),

  createSubscription: (payload: CreatePayload): Promise<Subscription> =>
    client.post(`${baseUrl}/agents/by-id/users/me/subscriptions`, payload),

  removeSubscription: (uuid: string): Promise<Subscription> =>
    client.delete(`${baseUrl}/agents/by-id/users/me/subscriptions/${uuid}`),
});
