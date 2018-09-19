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
Alternatively, you may load the Wazo SDK from a CDN. If you choose to, you'll also have to load Axios as the SDK depends on it. Use one of the following Content Delivery Networks:

#### UNPKG
```
<script src="https://unpkg.com/axios"></script>
<script src="https://unpkg.com/@wazo/sdk"></script>
```

#### jsDelivr
```
<script src="https://cdn.jsdelivr.net/npm/axios"></script>
<script src="https://cdn.jsdelivr.net/npm/@wazo/sdk"></script>
```

### Require / Import
Depending on your preference, you may require or add the Wazo SDK to your own client application one of the following ways:
* `const { WazoApiClient } = require('@wazo/sdk');`
* `import { WazoApiClient } from '@wazo/sdk';`

### Init
```js
const client = new WazoApiClient({
  server: 'demo.wazo.community' // required string
});
```

### Log In
```js
client.logIn({
  expiration, // optional integer. Session life in number of seconds. If omitted, defaults to 3600 (an hour).
  username, // required string
  password, // required string
  backend, // optional string. If omitted, defaults to wazo_user
}).then({
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
  expires_at
  xivo_user_uuid
});
// or
const result = await client.login(/* ... */);
```

### Log Out
```
client.logOut().then(/* ... */);
// or
await client.logOut();
```

### Check token
```
client.checkToken(token).then(valid);
// or
const valid = await client.checkToken(token);
```

### Application
```
client.calls() // list calls
client.hangupCall() // hangup a call
client.answerCall()  // answer a call
client.listNodes() // list nodes
client.listCallsNodes() // list calls in a node
client.removeCallNodes() // remove call from node (no hangup)
client.addCallNodes() // add call in a node
client.playCall() // play a sound into a call
```

### WebRTCPhone
```
import { WazoWebRTCClient } from '@wazo/sdk';
const config = {
  wsServer: 'my_wazo',
  displayName: 'My Display Name',
  authorizationUser: 'user',
  password: 'password',
};
const phone = new WazoWebRTCClient(config, ev_callback);
phone.call('1234')

function ev_callback(ev_name, ev_value) {
  console.log(ev_name);
  console.log(ev_value);
}
```

### Wazo Websocket
```
import { WazoWebSocketClient } from '@wazo/sdk';
const ws = new WazoWebSocket({
  host: // wazo websocket host
  token: // valid token
  callback: (ws) => {
    console.log(ws);
  }
})
ws.init();
```
