
# Wazo's JavaScript Software Development Kit

[![npm version](https://badge.fury.io/js/%40wazo%2Fsdk.svg)](https://badge.fury.io/js/%40wazo%2Fsdk)
[![Greenkeeper badge](https://badges.greenkeeper.io/wazo-platform/wazo-js-sdk.svg)](https://greenkeeper.io/)

Wazo JavaScript SDK makes it easy for you to build Programmable Conversation applications.
Use this dev kit in any JS application to leverage communication possibilities.

## Supported Features
Wazo's Javascript SDK allows you to use these features :

- Voice : **`Voice`**
- Video : **`Video`**
- Chat : **`Chat`**
- Fax : **`Fax`**
- Users status : **`Status`**
- Users configurations : **`Config`**
- Directories, Logs : **`Misc`**
## Table of contents

  * [Install](#install)
    + [Install / Add](#install---add)
    + [Content Delivery Networks](#content-delivery-networks)
      - [UNPKG](#unpkg)
      - [jsDelivr](#jsdelivr)
  * [Libraries](#libraries)
    + [Require / Import](#require---import)
      - [API Client Library](#api-client-library)
      - [WebRTC Library](#webrtc-library)
      - [WebSocket Library](#websocket-library)
  * [Authentication](#authentication)
    + [Initialization](#initialization)
      - [When using API Client](#when-using-api-client)
      - [When using WebRTC](#when-using-webrtc)
      - [When using WebSocket](#when-using-websocket)
        * [Opening the socket](#opening-the-socket)
        * [Closing the socket](#closing-the-socket)
    + [Log In](#log-in)
    + [Set token (and refresh token)](#set-token--and-refresh-token-)
    + [Add an event when the token is refreshed](#add-an-event-when-the-token-is-refreshed)
    + [Log Out](#log-out)
    + [Check token](#check-token)
    + [Other auth methods](#other-auth-methods)
  * [Interact with the engine](#interact-with-the-engine)
    + [Applicationd](#applicationd)
    + [Calld](#calld)
    + [Confd](#confd)
    + [Dird](#dird)
    + [callLogd](#calllogd)
    + [Accessd](#accessd)
    + [Calling an API endpoint without WazoApiClient](#calling-an-api-endpoint-without-wazoapiclient)
  * [WebRTCClient](#webrtcclient)
    + [Basic phone features](#basic-phone-features)
      - [Calling a number](#calling-a-number)
      - [Be notified to a phone call](#be-notified-to-a-phone-call)
      - [Answering a call](#answering-a-call)
      - [Hangup a call](#hangup-a-call)
      - [Rejecting a call](#rejecting-a-call)
      - [Muting a call](#muting-a-call)
      - [Unmuting a call](#unmuting-a-call)
      - [Holding a call](#holding-a-call)
      - [Unholding a call](#unholding-a-call)
      - [Transferring a call](#transferring-a-call)
      - [Sending a DTMF tone](#sending-a-dtmf-tone)
      - [Sending a message](#sending-a-message)
      - [Closing the RTC connection](#closing-the-rtc-connection)
    + [Conference features](#conference-features)
      - [Merging sessions in one conference](#merging-sessions-in-one-conference)
      - [Add a session to a conference](#add-a-session-to-a-conference)
      - [Remove a session from a conference](#remove-a-session-from-a-conference)
      - [Unmerge a sessions from a conference](#unmerge-a-sessions-from-a-conference)
## Install 
 
### Install / Add      **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**
You may install the Wazo JavaScript Software Development Kit to your project one of the following ways:
* `npm install @wazo/sdk`
* `yarn add @wazo/sdk`

### Content Delivery Networks      **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**
Alternatively, you may load the Wazo SDK from a CDN. Use one of the following Content Delivery Networks:

#### UNPKG
```
<script src="https://unpkg.com/@wazo/sdk/dist/wazo-sdk.js"></script>
```

#### jsDelivr
```
<script src="https://cdn.jsdelivr.net/npm/@wazo/sdk"></script>
```

## Libraries
### Require / Import      **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**
Depending on your preference, you may require or add the Wazo SDK to your own client application one of the following ways:
#### API Client Library

* `const { WazoApiClient } = require('@wazo/sdk');`
* `import { WazoApiClient } from '@wazo/sdk';`

Depending on your environment you can import:
* `@wazo/sdk/esm`: compatible with (most) **browsers only**.
* `@wazo/sdk/lib`: runnable on `node` env.

#### WebRTC Library

```js
import { WazoWebRTCClient } from '@wazo/sdk';
```

#### WebSocket Library
```js
import { WazoWebSocketClient } from '@wazo/sdk';
```

## Authentication 
### Initialization      **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

#### When using API Client

```js
const client = new WazoApiClient({
  server: 'demo.wazo.community', // required string
  agent: null, // http(s).Agent instance, allows custom proxy, unsecured https, certificate etc.
  clientId: null, // Set an identifier for your app when using refreshToken
  isMobile: false,
});
```

#### When using WebRTC
```js
const session = await client.auth.logIn({ ... });
```

### Log In      **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**
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

### Set token (and refresh token)      **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**
```js
client.setToken(token);
client.setRefreshToken(refreshToken);
```

### Add an event when the token is refreshed      **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

```js
client.setOnRefreshToken((newToken) => {
  // Do something with the new token (like storing it in the localstorage...).
});
```

### Log Out      **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**
```js
client.auth.logOut(token).then(/* ... */);
// or
await client.auth.logOut(token);
```

### Check token      **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**
```
client.auth.checkToken(token).then(valid);
// or
const valid = await client.auth.checkToken(token);
```

### Other auth methods      **`Config`** 
==// a complementer et commenter==
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

## Interact with the engine 
### Applicationd       **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**
Use Applicationd to construct your own communication features.

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

### Calld       **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**
Use Calld to directly control interactions.
(Please note, ctidNg endpoint is deprecated but continue to work with old version. **Please update your code**.)

==// à commenter==
```js
client.calld.getConferenceParticipantsAsUser(conferenceId); // List participants of a conference the user is part of
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
client.calld.makeCall(extension, fromMobile, lineId, allLines);
client.calld.sendFax(extension, fax, callerId);
client.calld.sendMessage(alias, msg, toUserId);
client.calld.relocateCall(callId, destination, lineId);
client.calld.updatePresence(presence);
```

### Confd      **`Config`**
Use Confd to interact with configurations.
```js
client.confd.listUsers();
client.confd.getUser(userUuid);
client.confd.getUserLineSip(userUuid, lineId);
client.confd.listApplications();
```

### Dird      **`Misc`**
Use Dird to interact with directories.
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

### callLogd      **`Voice`**  **`Misc`**
Use callLogd to interact with call logs.
```js
client.callLogd.search(search, limit);
client.callLogd.listCallLogs(offset, limit);
client.callLogd.listCallLogsFromDate(from, number);
```


### Calling an API endpoint without WazoApiClient      **`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

Use this generic method to request endpoints directly.

```js
const requester = new ApiRequester({ 
  server: 'demo.wazo.community', // Engine server
  refreshTokenCallback: () => {}, // Called when the token is refreshed
  clientId: 'my-id', // ClientId used for refreshToken
  agent: null, // http(s).Agent instance, allows custom proxy, unsecured https, certificate etc.
  token: null, // User token (can be defined later with requester.setToken()
});

// Retrieve personal contacts
const results = await requester.call('dird/0.1/personal');

```

## WebRTCClient
This sample decribes the very first steps to pass a call using WebRTC.
```js
import { WazoWebRTCClient } from '@wazo/sdk'; // import the library

const session = await client.auth.logIn({ ... }); // log in

const client = new WazoWebRTCClient({
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
client.on('invite', (sipSession: SIP.sessionDescriptionHandler, hasVideo: boolean, shouldAutoAnswer: boolean) => {
  this.currentSipSession = sipSession;
  // ...
});

// We have to wait to be registered to be able to make a call
await client.waitForRegister();

client.call('1234');
```

### Basic phone features      **`Voice`**   **`Video`**  **`Chat`**
#### Calling a number
Use this method to dial a number.
```js
client.call(number: string);
```

#### Be notified to a phone call
Use this method to be notified of an incoming call.
```js
client.on('invite', (sipSession: SIP.sessionDescriptionHandler) => {
  this.currentSipSession = sipSession;
});
```

#### Answering a call
Use this method to pick up an incoming call.
```js
client.answer(sipSession: SIP.sessionDescriptionHandler);
```

#### Hangup a call
Use this method to hangup a call (the call must have been already picked up)
```js
client.hangup(sipSession: SIP.sessionDescriptionHandler);
```

#### Rejecting a call
Use this method to deny an incoming call (Must not have been picked up already)
```js
client.reject(sipSession: SIP.sessionDescriptionHandler);
```

#### Muting a call
Use this method to mute yourself in a running call.
```js
client.mute(sipSession: SIP.sessionDescriptionHandler);
```

#### Unmuting a call
Use this method to unmute yourself in a running call.
```js
client.unmute(sipSession: SIP.sessionDescriptionHandler);
```

#### Holding a call
Use this method to put on hold a running call.
```js
client.hold(sipSession: SIP.sessionDescriptionHandler);
```

#### Unholding a call
Use this method to take back a running call.
```js
client.unhold(sipSession: SIP.sessionDescriptionHandler);
```

#### Transferring a call
Use this method to transfer a call to another target.
```js
client.transfert(sipSession: SIP.sessionDescriptionHandler, target: string);
```

#### Sending a DTMF tone
Use this method to send the dual-tone multi-frequency from the phone keypad.
```js
client.sendDTMF(sipSession: SIP.sessionDescriptionHandler, tone: string);
```

#### Sending a message
```js
client.message(destination: string, message: string);
```

<<<<<<< HEAD
## Set the audio output volume

Stores a value between 0 and 1, which can be used to on your audio element

```js
phone.changeAudioOutputVolume(volume: number);
```

## Set the audio ring volume

Stores a value between 0 and 1, which can be used to on your audio element

```js
phone.changeAudioRingVolume(volume: number);
```

## Closing the RTC connection
Use this method to put an end to an RTC connection.

```js
client.close();
```

### Conference features      **`Voice`**   **`Video`**  **`Chat`** 
#### Merging sessions in one conference
Use this method to merge multiple calls in a new conference room.
```js
client.merge(sessions: Array<SIP.InviteClientContext>);
```

#### Add a session to a conference
Use this method to add a single call to an existing conference room.
```js
client.addToMerge(sipSession: SIP.InviteClientContext);
```

#### Remove a session from a conference
Use this method to remove multiple participants from a conference.
```js
client.removeFromMerge(sipSession: SIP.InviteClientContext, shouldHold: boolean);
// shouldHold indicate if the session should be held after removed from session
```

#### Unmerge a sessions from a conference
Use this method to remove a single participant from a conference.
```js
client.unmerge(sipSessions: Array<SIP.InviteClientContext>)
```

## WebRTCPhone
Higher level of abstraction to use the `WebRtcClient`.

```js
import { WazoWebRTCClient, WebRTCPhone } from '@wazo/sdk';

const webRtcClient = new WazoWebRTCClient({/* See above for parameters */});

const phone = new WebRTCPhone(webRtcClient, audioDeviceOutput, allowVideo, audioDeviceRing);
```

## Wazo WebSocket
You can use the Wazo WebSocket to listen for real time events (eg: receiving a chat message, a presential update ...)

##### Opening the socket
```js
import { WebSocketClient } from '@wazo/sdk';

const ws = new WebSocketClient({
  host: '', // wazo websocket host
  token: '', // valid Wazo token
  events: [''], // List of events you want to receive (use `['*']` as wildcard).
  version: 2, // Use version 2 of the Wazo WebSocket protocol to be informed when the token will expire.
}, {
  // see https://github.com/pladaria/reconnecting-websocket#available-options
});

ws.connect();
```

##### Listening for event

```js
import { USERS_SERVICES_DND_UPDATED, AUTH_SESSION_EXPIRE_SOON } from '@wazo/sdk/lib/websocket-client';

// eventName can be on the of events here: http://documentation.wazo.community/en/stable/api_sdk/websocket.html
ws.on('eventName', (data: mixed) => {
});

ws.on(USERS_SERVICES_DND_UPDATED, ({ enabled }) => {
  // Do something with the new do not disturb value.
});

ws.on(AUTH_SESSION_EXPIRE_SOON, (data) => {
  // Called when the user's token will expire soon.
  // You should refresh it at this point (eg: by using a refreshToken).
});
```

##### Updating the user token

You can update a new token to avoid being disconnected when the old one will expire.

```js
ws.updateToken(newToken: string);
```

##### Closing the socket
```js
ws.close();
```
