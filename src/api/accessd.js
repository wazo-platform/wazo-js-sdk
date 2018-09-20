/* @flow */
import { callApi, getHeaders } from '../utils';

export default (baseUrl: string) => ({
  listSubscriptions(token: string) {
    return callApi(`${baseUrl}/subscriptions?recurse=true`, 'get', null, getHeaders(token));
  },
  createSubscription(
    token: string,
    { tenantUuid, productSku, name, startDate, contractDate, autoRenew, term }: Object
  ) {
    const body = {
      product_sku: productSku,
      name,
      start_date: startDate,
      contract_date: contractDate,
      auto_renew: autoRenew,
      term
    };

    const headers = getHeaders(token);
    if (tenantUuid) {
      headers['Wazo-Tenant'] = tenantUuid;
    }

    return callApi(`${baseUrl}/subscriptions`, 'post', body, headers);
  },
  getSubscription(token: string, uuid: string) {
    return callApi(`${baseUrl}/subscriptions/${uuid}`, 'get', null, getHeaders(token));
  },
  listAuthorizations(token: string, subscriptionUuid: string) {
    return callApi(`${baseUrl}/subscriptions/${subscriptionUuid}/authorizations`, 'get', null, getHeaders(token));
  },
  getAuthorization(token: string, subscriptionUuid: string, uuid: string) {
    const url = `${baseUrl}/subscriptions/${subscriptionUuid}/authorizations/${uuid}`;

    return callApi(url, 'get', null, getHeaders(token));
  },
  createAuthorization(token: string, subscriptionUuid: string, { startDate, term, service, rules, autoRenew }: Object) {
    const url = `${baseUrl}/subscriptions/${subscriptionUuid}/authorizations`;
    const body = {
      start_date: startDate,
      term,
      service,
      rules,
      auto_renew: autoRenew
    };

    return callApi(url, 'post', body, getHeaders(token));
  }
});
