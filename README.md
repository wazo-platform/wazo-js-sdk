# Wazo's JavaScript Software Development Kit

[![npm version](https://badge.fury.io/js/%40wazo%2Fsdk.svg)](https://badge.fury.io/js/%40wazo%2Fsdk)
[![Greenkeeper badge](https://badges.greenkeeper.io/wazo-pbx/wazo-js-sdk.svg)](https://greenkeeper.io/)

The Wazo JavaScript Software Development Kit is an API wrapper making it easy for you to communicate with your Wazo server. It allows you to add Wazo functionalities to any JavaScript application you are developing.

## Usage

### Install / Add
You may install the Wazo JavaScript Software Development Kit to your project one of the following ways:
* `npm install @wazo/sdk`
* `yarn add @wazo/sdk`

### Content Delivery Networks
Alternatively, you may load the Wazo SDK from a CDN. Use one of the following Content Delivery Networks:

#### UNPKG
```
<script src="https://unpkg.com/@wazo/sdk"></script>
```

#### jsDelivr
```
<script src="https://cdn.jsdelivr.net/npm/@wazo/sdk"></script>
```

### Require / Import
Depending on your preference, you may require or add the Wazo SDK to your own client application one of the following ways:
* `const { WazoApiClient } = require('@wazo/sdk');`
* `import { WazoApiClient } from '@wazo/sdk';`

### Init
```js
const client = new WazoApiClient({
  server: 'demo.wazo.community', // required string
  agent: null // http(s).Agent instance, allows custom proxy, unsecured https, certificate etc.
});
```

### Log In
```js
client.auth.logIn({
  expiration, // optional integer. Session life in number of seconds. If omitted, defaults to 3600 (an hour).
  username, // required string
  password, // required string
  backend, // optional string. If omitted, defaults to wazo_user
}).then(/* undefined if login failed, or : */{
  metadata: {
    username,
    uuid_tenant_uuid,
    xivo_user_uuid,
    groups,
    xivo_uuid,
    tenants: [{ uuid }],
    auth_id
  },
  token, // should be used for other request
  acls,
  utc_expires_at,
  xivo_uuid,
  issued_at,
  utc_issued_at,
  auth_id,
  expires_at,
  xivo_user_uuid
});
// or
const result = await client.auth.login(/* ... */);
```

### Log Out
```js
client.auth.logOut(token).then(/* ... */);
// or
await client.auth.logOut(token);
```

### Check token
```
client.auth.checkToken(token).then(valid);
// or
const valid = await client.auth.checkToken(token);
```

### Other auth methods

```js
client.auth.listTenants(token);
client.auth.createTenant(token, name);
client.auth.deleteTenant(token, uuid);
client.auth.listUsers(token);
client.auth.listGroups(token);
client.auth.listPolicies(token);
```

### Application
```js
client.application.calls(token, applicationUuid); // list calls
client.application.hangupCall(token, applicationUuid, callId); // hangup a call
client.application.answerCall(token, applicationUuid, callId, context, exten, autoanswer);  // answer a call
client.application.listNodes(token, applicationUuid); // list nodes
client.application.listCallsNodes(token, applicationUuid, nodeUuid); // list calls in a node
client.application.removeCallNodes(token, applicationUuid, nodeUuid, callId); // remove call from node (no hangup)
client.application.addCallNodes(token, applicationUuid, nodeUuid, callId); // add call in a node
client.application.playCall(token, applicationUuid, callId, language, uri); // play a sound into a call
```

### Confd
```js
client.confd.listUsers(token);
client.confd.getUser(token, userUuid);
client.confd.getUserLineSip(token, userUuid, lineId);
client.confd.listApplications(token);
```

### Accessd
```js
client.accessd.listSubscriptions(token);
client.accessd.createSubscription(token, { productSku, name, startDate, contractDate, autoRenew, term });
client.accessd.getSubscription(token, uuid);
client.accessd.listAuthorizations(token);
client.accessd.getAuthorization(token, uuid);

```

### WebRTCPhone
```js
import { WazoWebRTCClient } from '@wazo/sdk';

const config = {
  wsServer: 'my_wazo',
  displayName: 'My Display Name',
  authorizationUser: 'user',
  password: 'password',
  media: {
    audio: document.getElementById('audio') // Pointing to a <audio id="audio" /> element
  }
};

const callback = (ev_name, ev_value) => {
  console.log('WebRTC event', ev_name, ev_value);
};

const phone = new WazoWebRTCClient(config, callback);
phone.call('1234')
```

### Wazo Websocket
```js
import { WazoWebSocketClient } from '@wazo/sdk';

const ws = new WazoWebSocket({
  host, // wazo websocket host
  token, // valid Wazo token
  callback: (event) => {
    console.log(event);
  }
});

ws.connect();
```
