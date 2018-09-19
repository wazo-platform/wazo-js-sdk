export default (ApiClient, client) => ({
  listSubscriptions(token) {
    const url = `${client.accessdUrl}/subscriptions?recurse=true`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  createSubscription(token, { tenantUuid, productSku, name, startDate, contractDate, autoRenew, term }) {
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
  getSubscription(token, uuid) {
    const url = `${client.accessdUrl}/subscriptions/${uuid}`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  listAuthorizations(token, subscriptionUuid) {
    const url = `${client.accessdUrl}/subscriptions/${subscriptionUuid}/authorizations`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  getAuthorization(token, subscriptionUuid, uuid) {
    const url = `${client.accessdUrl}/subscriptions/${subscriptionUuid}/authorizations/${uuid}`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  createAuthorization(token, subscriptionUuid, { name, startDate, term }) {
    const url = `${client.accessdUrl}/subscriptions/${subscriptionUuid}/authorizations`;
    const body = {
      name,
      start_date: startDate,
      term
    };

    return ApiClient.callApi(url, 'post', body, ApiClient.getHeaders(token));
  }
});
