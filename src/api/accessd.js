export default (ApiClient, client) => ({
  listSubscriptions(token) {
    const url = `${client.accessdUrl}/subscriptions?recurse=true`;

    return ApiClient.callApi(url, 'get', null, ApiClient.getHeaders(token));
  },
  createSubscription(token, { productSku, name, startDate, contractDate, autoRenew, term }) {
    const url = `${client.accessdUrl}/subscriptions`;
    const body = {
      product_sku: productSku,
      name,
      start_date: startDate,
      contract_date: contractDate,
      auto_renew: autoRenew,
      term
    };

    return ApiClient.callApi(url, 'post', body, ApiClient.getHeaders(token));
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
