# Wazo's JavaScript Software Development Kit

[![npm version](https://badge.fury.io/js/%40wazo%2Fsdk.svg)](https://badge.fury.io/js/%40wazo%2Fsdk)
[![Greenkeeper badge](https://badges.greenkeeper.io/wazo-platform/wazo-js-sdk.svg)](https://greenkeeper.io/)

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
  clientId: null, // Set an identifier for your app when using refreshToken
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
  // should be used for other request
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
const { refreshToken, ...result } = await client.auth.login(/* ... */);
```

### Set token (and refresh token)
```js
client.setToken(token);
client.setRefreshToken(refreshToken);
```

### Add an event when the token is refreshed

```js
client.setOnRefreshToken((newToken) => {
  // Do something with the new token (like storing it in the localstorage...).
});
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
client.auth.listTenants();
client.auth.createTenant(name);
client.auth.deleteTenant(uuid);
client.auth.createUser(username, password, firstname, lastname);
client.auth.addUserEmail(userUuid, email, main);
client.auth.addUserPolicy(userUuid, policyUuid);
client.auth.deleteUser();
client.auth.listUsers();
client.auth.listGroups();
client.auth.createPolicy(name);
client.auth.listPolicies();
```

### Application
```js
client.application.calls(applicationUuid); // list calls
client.application.hangupCall(applicationUuid, callId); // hangup a call
client.application.answerCall(applicationUuid, callId, context, exten, autoanswer);  // answer a call
client.application.listNodes(applicationUuid); // list nodes
client.application.listCallsNodes(applicationUuid, nodeUuid); // list calls in a node
client.application.removeCallNodes(applicationUuid, nodeUuid, callId); // remove call from node (no hangup)
client.application.addCallNodes(applicationUuid, nodeUuid, callId); // add call in a node
client.application.playCall(applicationUuid, callId, language, uri); // play a sound into a call
```

### Calld
```js
client.calld.getConferenceParticipantsAsUser(conferenceId); // List participants of a conference the user is part of
```

### Confd
```js
client.confd.listUsers();
client.confd.getUser(userUuid);
client.confd.getUserLineSip(userUuid, lineId);
client.confd.listApplications();
```

### Dird
```js
client.dird.search(context, term);
client.dird.listPersonalContacts();
client.dird.addContact(newContact);
client.dird.editContact(contact);
client.dird.deleteContact(contactUuid);
client.dird.listFavorites(context);
client.dird.markAsFavorite(source, sourceId);
client.dird.removeFavorite(source, sourceId);
```

### Call Logd
```js
client.callLogd.search(search, limit);
client.callLogd.listCallLogs(offset, limit);
client.callLogd.listCallLogsFromDate(from, number);
```

### Calld

Please note, ctidNg endpoint is obsolete but continue to work with old version. Please update your code.

```js
client.calld.answerSwitchboardQueuedCall(switchboardUuid, callId);
client.calld.answerSwitchboardHeldCall(switchboardUuid, callId);
client.calld.cancelCall(callId);
client.calld.deleteVoicemail(voicemailId);
client.calld.fetchSwitchboardHeldCalls(switchboardUuid);
client.calld.fetchSwitchboardQueuedCalls(switchboardUuid);
client.calld.getConferenceParticipantsAsUser(conferenceId);
client.calld.getPresence(contactUuid); //deprecated use chatd in ctidNg, don't work with calld
client.calld.getStatus(lineUuid); //deprecated use chatd in ctidNg, don't work with calld
client.calld.holdSwitchboardCall(switchboardUuid, callId);
client.calld.listCalls();
client.calld.listMessages(participantUuid, limit);
client.calld.listVoicemails();
client.calld.makeCall(extension, fromMobile, lineId);
client.calld.sendFax(extension, fax, callerId);
client.calld.sendMessage(alias, msg, toUserId);
client.calld.relocateCall(callId, destination, lineId);
client.calld.updatePresence(presence);
```

### Accessd
```js
client.accessd.listSubscriptions();
client.accessd.createSubscription({ productSku, name, startDate, contractDate, autoRenew, term });
client.accessd.getSubscription(uuid);
client.accessd.listAuthorizations();
client.accessd.getAuthorization(uuid);
```

### WebRTCPhone
```js
import { WazoWebRTCClient } from '@wazo/sdk';

const session = await client.auth.logIn({ ... });

const phone = new WazoWebRTCClient({
  displayName: 'From WEB',
  host: 'demo.wazo.community',
  media: {
    audio: boolean,
    video: boolean | document.getElementById('video'), // pointing to a `<video id="video" />` element
    localVideo: boolean | document.getElementById('video'), // pointing to a `<video id="video" />` element
  }
}, session);

// eventName can be on the of events : 
// - transport: `connected`, `disconnected`, `transportError`, `message`, `closed`, `keepAliveDebounceTimeout`
// - webrtc: `registered`, `unregistered`, `registrationFailed`, `invite`, `inviteSent`, `transportCreated`, `newTransaction`, `transactionDestroyed`, `notify`, `outOfDialogReferRequested`, `message`.
phone.on('invite', (sipSession: SIP.sessionDescriptionHandler, hasVideo: boolean, shouldAutoAnswer: boolean) => {
  this.currentSipSession = sipSession;
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
phone.on('invite', (sipSession: SIP.sessionDescriptionHandler) => {
  this.currentSipSession = sipSession;
});
```

### Answering a call
```js
phone.answer(sipSession: SIP.sessionDescriptionHandler);
```

## Hangup a call
```js
phone.hangup(sipSession: SIP.sessionDescriptionHandler);
```

## Rejecting a call
```js
phone.reject(sipSession: SIP.sessionDescriptionHandler);
```

## Muting a call
```js
phone.mute(sipSession: SIP.sessionDescriptionHandler);
```

## Umuting a call
```js
phone.unmute(sipSession: SIP.sessionDescriptionHandler);
```

## Holding a call
```js
phone.hold(sipSession: SIP.sessionDescriptionHandler);
```

## Unholding a call
```js
phone.unhold(sipSession: SIP.sessionDescriptionHandler);
```

## Transferring a call
```js
phone.transfert(sipSession: SIP.sessionDescriptionHandler, target: string);
```

## Sending a DTMF tone
```js
phone.sendDTMF(sipSession: SIP.sessionDescriptionHandler, tone: string);
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
phone.addToMerge(sipSession: SIP.InviteClientContext);
```

## Remove a session from a conference
```js
phone.removeFromMerge(sipSession: SIP.InviteClientContext, shouldHold: boolean);
// shouldHold indicate if the session should be held after removed from session
```

## Unmerge a sessions from a conference
```js
phone.unmerge(sipSessions: Array<SIP.InviteClientContext>)
```

### Wazo Websocket
```js
import { WazoWebSocketClient } from '@wazo/sdk';

const ws = new WazoWebSocket({
  host, // wazo websocket host
  // valid Wazo token
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
