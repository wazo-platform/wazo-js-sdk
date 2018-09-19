export default (ApiClient, client) => ({
  listSubscriptions(token) {
    const url = `${client.accessdUrl}/subscriptions?recurse=true`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  createSubscription(token, { productSku, name, startDate, contractDate, autoRenew, term, tenantUuid }) {
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
    headers['Wazo-Tenant'] = tenantUuid;

    return ApiClient.callApi(url, 'post', body, headers);
  },
  getSubscription(token, uuid) {
    const url = `${client.accessdUrl}/subscriptions/${uuid}`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  listAuthorizations(token) {
    const url = `${client.accessdUrl}/authorizations?recurse=true`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  getAuthorization(token, uuid) {
    const url = `${client.accessdUrl}/authorizations/${uuid}`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  }
});
