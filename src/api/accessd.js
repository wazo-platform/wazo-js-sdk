/* @flow */
import type ApiClient from '../api-client'; // eslint-disable-line

// eslint-disable-next-line
export default (ApiClient: Class<ApiClient>, client: ApiClient) => ({
  listSubscriptions(token: string) {
    const url = `${client.accessdUrl}/subscriptions?recurse=true`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  createSubscription(
    token: string,
    { tenantUuid, productSku, name, startDate, contractDate, autoRenew, term }: Object
  ) {
    const url = `${client.accessdUrl}/subscriptions`;
    const body = {
      product_sku: productSku,
      name,
      start_date: startDate,
      contract_date: contractDate,
      auto_renew: autoRenew,
      term
    };

    const headers = ApiClient.getHeaders(token);
    if (tenantUuid) {
      headers['Wazo-Tenant'] = tenantUuid;
    }

    return ApiClient.callApi(url, 'post', body, headers);
  },
  getSubscription(token: string, uuid: string) {
    const url = `${client.accessdUrl}/subscriptions/${uuid}`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  listAuthorizations(token: string, subscriptionUuid: string) {
    const url = `${client.accessdUrl}/subscriptions/${subscriptionUuid}/authorizations`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  getAuthorization(token: string, subscriptionUuid: string, uuid: string) {
    const url = `${client.accessdUrl}/subscriptions/${subscriptionUuid}/authorizations/${uuid}`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  createAuthorization(token: string, subscriptionUuid: string, { startDate, term, service, rules, autoRenew }: Object) {
    const url = `${client.accessdUrl}/subscriptions/${subscriptionUuid}/authorizations`;
    const body = {
      start_date: startDate,
      term,
      service,
      rules,
      auto_renew: autoRenew
    };

    return ApiClient.callApi(url, 'post', body, ApiClient.getHeaders(token));
  }
});
