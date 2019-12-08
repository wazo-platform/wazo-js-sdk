/* @flow */
import ApiRequester from '../utils/api-requester';

export default (client: ApiRequester, baseUrl: string) => ({
  listSubscriptions: () => client.get(`${baseUrl}/subscriptions`),

  createSubscription: ({ productSku, name, startDate, contractDate, autoRenew, term }: Object) => {
    const body = {
      product_sku: productSku,
      name,
      start_date: startDate,
      contract_date: contractDate,
      auto_renew: autoRenew,
      term,
    };

    return client.post(`${baseUrl}/subscriptions`, body);
  },

  getSubscription: (uuid: string) => client.get(`${baseUrl}/subscriptions/${uuid}`),

  deleteSubscription: (uuid: string) => client.delete(`${baseUrl}/subscriptions/${uuid}`),

  createSubscriptionToken: () => client.post(`${baseUrl}/subscriptions/token`),

  listAuthorizations: (subscriptionUuid: string) =>
    client.get(`${baseUrl}/subscriptions/${subscriptionUuid}/authorizations`),

  getAuthorization: (subscriptionUuid: string, uuid: string) =>
    client.get(`${baseUrl}/subscriptions/${subscriptionUuid}/authorizations/${uuid}`),

  deleteAuthorization: (subscriptionUuid: string, uuid: string) =>
    client.delete(`${baseUrl}/subscriptions/${subscriptionUuid}/authorizations/${uuid}`),

  createAuthorization: (subscriptionUuid: string, { startDate, term, service, rules, autoRenew }: Object) => {
    const url = `${baseUrl}/subscriptions/${subscriptionUuid}/authorizations`;
    const body = {
      start_date: startDate,
      term,
      service,
      rules,
      auto_renew: autoRenew,
    };

    return client.post(url, body);
  },
});
