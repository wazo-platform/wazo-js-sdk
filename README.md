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
<script src="https://unpkg.com/@wazo/sdk/dist/wazo-sdk.js"></script>
```

#### jsDelivr
```
<script src="https://cdn.jsdelivr.net/npm/@wazo/sdk"></script>
```

### Require / Import
Depending on your preference, you may require or add the Wazo SDK to your own client application one of the following ways:
* `const { WazoApiClient } = require('@wazo/sdk');`
* `import { WazoApiClient } from '@wazo/sdk';`

Depending on your environment you can import:
* `@wazo/sdk/esm`: compatible with (most) **browsers only**.
* `@wazo/sdk/lib`: runnable on `node` env.

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
  mobile, // optional boolean. If omitted, defaults to false: tells if the current user uses a mobile application
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
client.auth.createUser(token, username, password, firstname, lastname);
client.auth.addUserEmail(token, userUuid, email, main);
client.auth.addUserPolicy(token, userUuid, policyUuid);
client.auth.deleteUser(token);
client.auth.listUsers(token);
client.auth.listGroups(token);
client.auth.createPolicy(token, name);
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

### Dird
```js
client.dird.search(token, context, term);
client.dird.listPersonalContacts(token);
client.dird.addContact(token, newContact);
client.dird.editContact(token, contact);
client.dird.deleteContact(token, contactUuid);
client.dird.listFavorites(token, context);
client.dird.markAsFavorite(token, source, sourceId);
client.dird.removeFavorite(token, source, sourceId);
```

### Call Logd
```js
client.callLogd.search(token, search, limit);
client.callLogd.listCallLogs(token, offset, limit);
client.callLogd.listCallLogsFromDate(token, from, number);
```

### Ctid Ng
```js
client.ctidNg.updatePresence(token, presence);
client.ctidNg.listMessages(token, participantUuid, limit);
client.ctidNg.sendMessage(token, alias, msg, toUserId);
client.ctidNg.makeCall(token, extension, fromMobile, lineId);
client.ctidNg.cancelCall(token, callId);
client.ctidNg.listCalls(token);
client.ctidNg.relocateCall(token, callId, destination, lineId);
client.ctidNg.listVoicemails(token);
client.ctidNg.deleteVoicemail(token, voicemailId);
client.ctidNg.getPresence(token, contactUuid};
client.ctidNg.getStatus(token, lineUuid);
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

const phone = new WazoWebRTCClient({
  displayName: 'From WEB',
  host: 'demo.wazo.community',
  authorizationUser: lineData.username,
  password: lineData.secret,
  media: {
    audio: boolean,
    video: boolean | document.getElementById('video'), // pointing to a `<video id="video" />` element
    localVideo: boolean | document.getElementById('video'), // pointing to a `<video id="video" />` element
  }
});
// eventName can be on the of events : 
// - transport: `connected`, `disconnected`, `transportError`, `message`, `closed`, `keepAliveDebounceTimeout`
// - webrtc: `registered`, `unregistered`, `registrationFailed`, `invite`, `inviteSent`, `transportCreated`, `newTransaction`, `transactionDestroyed`, `notify`, `outOfDialogReferRequested`, `message`.
phone.on('invite', (session: SIP.sessionDescriptionHandler, hasVideo: boolean, shouldAutoAnswer: boolean) => {
  this.currentSession = session;
  // ...
});

phone.call('1234');
```

### Calling a number
```js
phone.call(number: string);
```

### Be notified to a phone call
```js
phone.on('invite', (session: SIP.sessionDescriptionHandler) => {
  this.currentSession = session;
});
```

### Answering a call
```js
phone.answer(session: SIP.sessionDescriptionHandler);
```

## Hangup a call
```js
phone.hangup(session: SIP.sessionDescriptionHandler);
```

## Rejecting a call
```js
phone.reject(session: SIP.sessionDescriptionHandler);
```

## Muting a call
```js
phone.mute(session: SIP.sessionDescriptionHandler);
```

## Umuting a call
```js
phone.unmute(session: SIP.sessionDescriptionHandler);
```

## Holding a call
```js
phone.hold(session: SIP.sessionDescriptionHandler);
```

## Unholding a call
```js
phone.unhold(session: SIP.sessionDescriptionHandler);
```

## Transferring a call
```js
phone.transfert(session: SIP.sessionDescriptionHandler, target: string);
```

## Sending a DTMF tone
```js
phone.sendDTMF(session: SIP.sessionDescriptionHandler, tone: string);
```

## Sending a message
```js
phone.message(message: string, destination: string);
```

## Closing the RTC connection
```js
phone.close();
```

## Merging sessions in one conference
```js
phone.merge(sessions: Array<SIP.InviteClientContext>);
```

## Add a session to a conference
```js
phone.addToMerge(session: SIP.InviteClientContext);
```

## Remove a session from a conference
```js
phone.removeFromMerge(session: SIP.InviteClientContext, shouldHold: boolean);
// shouldHold indicate if the session should be held after removed from session
```

## Unmerge a sessions from a conference
```js
phone.unmerge(sessions: Array<SIP.InviteClientContext>)
```

### Wazo Websocket
```js
import { WazoWebSocketClient } from '@wazo/sdk';

const ws = new WazoWebSocket({
  host, // wazo websocket host
  token, // valid Wazo token
});

// eventName can be on the of events here: http://documentation.wazo.community/en/stable/api_sdk/websocket.html
ws.on('eventName', (data: mixed) => {
});

ws.connect();
```

## Closing the socket
```js
ws.close();
```
