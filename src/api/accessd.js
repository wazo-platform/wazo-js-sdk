/* @flow */
import ApiRequester from '../utils/api-requester';

export default (client: ApiRequester, baseUrl: string) => ({
  listSubscriptions(token: string) {
    return client.get(`${baseUrl}/subscriptions?recurse=true`, null, token);
  },
  createSubscription(token: string, { productSku, name, startDate, contractDate, autoRenew, term }: Object) {
    const body = {
      product_sku: productSku,
      name,
      start_date: startDate,
      contract_date: contractDate,
      auto_renew: autoRenew,
      term,
    };

    return client.post(`${baseUrl}/subscriptions`, body, token);
  },
  getSubscription(token: string, uuid: string) {
    return client.get(`${baseUrl}/subscriptions/${uuid}`, null, token);
  },
  deleteSubscription(token: string, uuid: string) {
    return client.delete(`${baseUrl}/subscriptions/${uuid}`, null, token);
  },
  createSubscriptionToken(token: string) {
    return client.post(`${baseUrl}/subscriptions/token`, null, token);
  },
  listAuthorizations(token: string, subscriptionUuid: string) {
    return client.get(`${baseUrl}/subscriptions/${subscriptionUuid}/authorizations`, null, token);
  },
  getAuthorization(token: string, subscriptionUuid: string, uuid: string) {
    return client.get(`${baseUrl}/subscriptions/${subscriptionUuid}/authorizations/${uuid}`, null, token);
  },
  deleteAuthorization(token: string, subscriptionUuid: string, uuid: string) {
    return client.delete(`${baseUrl}/subscriptions/${subscriptionUuid}/authorizations/${uuid}`, null, token);
  },
  createAuthorization(token: string, subscriptionUuid: string, { startDate, term, service, rules, autoRenew }: Object) {
    const url = `${baseUrl}/subscriptions/${subscriptionUuid}/authorizations`;
    const body = {
      start_date: startDate,
      term,
      service,
      rules,
      auto_renew: autoRenew,
    };

    return client.post(url, body, token);
  },
});
