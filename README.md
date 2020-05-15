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

## Simple API

### Require / Import
```js
// For Node / packaged app
import Wazo from '@wazo/sdk/lib/simple';

// Browser
// You can access the `Wazo` object directly on the browser
```

### Authentication

#### Initializing
```js
Wazo.Auth.init(clientId, tokenExpiration, minSubscriptionType);
```

- `clientId`: string (optional)
  - An identifier of your application that will be used for refreshing users token 
  
- `tokenExpiration`: number (optional, default 3600 seconds)
  - Duration before token expiration (in seconds) 
  
- `minSubscriptionType`: number (optional)
  - Defines the minimal subscription type for an user to have access at your application.
  
#### Setting the engine host

```js
Wazo.Auth.setHost(host);
```

- `host`: string
  - Host where your engine is installed (including port if needed).

### Authenticating an user
```
const session = await Wazo.Auth.logIn(username, password);
```

- `username`: string
  - User's username

- `password`: string
  - User's password
 
Returns as `Wazo.domain.Session`. This object contains, among others information, the user token.

#### Validating a token

```js
const session = await Wazo.Auth.validateToken(token, refreshToken);
```

- `token`: string
  - User's token to validate (eg: check if correct and not expired).
  
- `refreshToken`: string (optional)
  - User's refresh token, used to generate a new token if expired.

Returns as `Wazo.domain.Session`.

#### Setting a callback when a new token is refreshed

When the user's token will soon be expired, Wazo's SDK triggers a callback so you can update it in your application.
Like updating the new token in your localstorage / cookies.

```js
Wazo.Auth.setOnRefreshToken(token => { /* Do something with the new token */ });
```

- `callback`: Function(token: string)
  - A function that will be triggered when the user's token will soon expire.

#### Loggin out

Destroys user'' ' token and refreshToken.

```js
await Wazo.Auth.logout();
```

### Conference

#### Joining a room

```js
Wazo.Room.connect(options);
```

- `options`: Object
 - `extension`: string
   The room extension (number) you want to join
 - `audio`: boolean|Object 
   A boolean if you want to send the user audio or not. Or an Object if you want to specify the audio input, etc...
   See [getUserMedia arguments](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) for more information. 
 - `video`: boolean|Object 
   A boolean if you want to send the user video or not. Or an Object if you want to specify the audio input, etc...
   See [getUserMedia arguments](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) for more information.
 - `extra`: Object
   A map of values that will be added to the information of the current participant.

Returns a `Wazo.Room` instance.

#### Sending a chat message in the room

```js
room.sendChat(content);
```

- `content`: string
  The chat message content you want to send to all participants of the room.
  
#### Sending a custom message to all participants

```js
room.sendSignal(content);
```

- `content`: string
  The message content you want to send to all participants of the room.
  
#### Sharing the user screen

```js
room.startScreenSharing(constraints);
```

- `constraints`: Object 
  See [getUserMedia arguments](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) for more information. 

#### Stopping the screen share

```js
room.stopScreenSharing();
```

#### Disabling the camera

```js
room.turnCameraOff();
```

#### Enabling the camera

```js
room.turnCameraOn();
```

#### Disabling the microphone

```js
room.mute();
```

#### Enabling the microphone

```js
room.unmute();
```

#### Accessing room participants

```js
room.participants;
```

`participants`: An array of `Wazo.LocalParticipant` and `Wazo.RemoteParticipant`.

#### Disconnect from the room

```js
Wazo.room.disconnect();
```

### Conference events

```js
room.on(room.ON_CHAT, (message) => {});
```

Triggered when we receive a chat message.

- `message`: string

```js
room.on(room.ON_MESSAGE, (message) => {});
```

Triggered when received a custom message.

- `message`: string

```js
room.on(room.ON_JOINED, (participant) => {});
```

Triggered when we join the room.

- `participant`: `Wazo.LocalParticipant`.

```js
room.on(room.CONFERENCE_USER_PARTICIPANT_JOINED, (participant) => {});
```

Triggered when a participant joined the room.

- `participant`: `Wazo.RemoteParticipant`.

```js
room.on(room.CONFERENCE_USER_PARTICIPANT_LEFT, (participant) => {});
```

Triggered when a participant left the room.

- `participant`: `Wazo.RemoteParticipant`.

```js
room.on(room.ON_SCREEN_SHARE_ENDED, () => {});
```

Triggered when we stop the screensharing.

- `participant`: `Wazo.RemoteParticipant`.

```js
room.on(room.ON_TALKING, (channel, participant) => {});
```

Triggered when a participant is talking or stop talking.

- `channel`: Object containing information about the event.
- `participant`: `Wazo.RemoteParticipant` or `Wazo.LocalParticipant`.
  The participant instance, your can access the `participant.isTalking` attribute to know the status.
  
#### Accessing the current WebRtc phone

You can access the current [webRtcPhone instance](#WebRTCPhone) via `Wazo.Phone.phone`.

### Domain

You can access all Wazo's domain objects in `Wazo.domain.*`, like `Wazo.domain.Session`;

#### Participant

`Wazo.LocalParticipant` and `Wazo.RemoteParticipant` shares the same properties :

- `uuid`: string
  The participant uuid.
  
- `name`: string
  The participant name, retrieved from the sip configuration.
  
- `isTalking`: boolean
  Indicates if the participant is currently talking.
  
- `streams`: Array of `Wazo.Stream`
  List all streams that the participant is sending.
  
- `videoStreams`: Array of `Wazo.Stream`
  List all video streams that the participant is sending.
  
- `audioMuted`: boolean
  Indicates if the participant has muted its microphone.
  
- `videoMuted`: boolean
  Indicates if the participant has muted its camera.
  
- `screensharing`: boolean
  Indicates if the participant is currently sharing its screen.
  
- `extra`: Object
  extra information of a participant.
  
  
#### Participant events

```js
participant.on(participant.ON_UPDATED, () => {});
```

Triggered when the participant is updated.

```js
participant.on(participant.ON_START_TALKING, () => {});
```

Triggered when the participant is talking.

```js
participant.on(participant.ON_STOP_TALKING, () => {});
```

Triggered when the participant stop talking.

```js
participant.on(participant.ON_DISCONNECT, () => {});
```

Triggered when the participant leaves the room.

```js
participant.on(participant.ON_STREAM_SUBSCRIBED, (stream) => {});
```

Triggered when the participant sends a stream.

- `stream`: `Wazo.Stream`
  A Wazo stream that is sent by the participant.
  
```js
participant.on(participant.ON_STREAM_UNSUBSCRIBED, (stream) => {});
```

Triggered when the participant stop sending a stream.

- `stream`: `Wazo.Stream`
  A Wazo stream that is no more sent by the participant.
  
```js
participant.on(participant.ON_AUDIO_MUTED, () => {});
```

Triggered when the participant has disabled its microphone.
  
```js
participant.on(participant.ON_AUDIO_UNMUTED, () => {});
```

Triggered when the participant has enabled its microphone. 
  
```js
participant.on(participant.ON_VIDEO_MUTED, () => {});
```

Triggered when the participant has disabled its camera. 
  
```js
participant.on(participant.ON_VIDEO_UNMUTED, () => {});
```

Triggered when the participant has enabled its camera. 
  
```js
participant.on(participant.ON_SCREENSHARING, () => {});
```

Triggered when the participant is sharing its screen. 
  
```js
participant.on(participant.ON_STOP_SCREENSHARING, () => {});
```

Triggered when the participant stop sharing its screen. 

#### Stream

`Wazo.Stream` helps attaching or detaching streams to html elements:

`stream.attach(htmlEmelent)`

Attaches a stream to an existing htmlElement or creates and returns a new one.

- `htmlElement`: htmlElement (optional).

Returns a `htmlElement` (audio or video) attached to the stream.

`stream.detach(htmlEmelent)`

Detach a stream from an existing htmlElement.

- `htmlElement`: htmlElement.

## Advanced API

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
  agent: null, // http(s).Agent instance, allows custom proxy, unsecured https, certificate etc.
  clientId: null, // Set an identifier for your app when using refreshToken
  isMobile: false,
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

Please note, ctidNg endpoint is deprecated but continue to work with old version. Please update your code.

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
client.calld.makeCall(extension, fromMobile, lineId, allLines);
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

### Calling an API endpoint without WazoApiClient

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

// We have to wait to be registered to be able to make a call
await phone.waitForRegister();

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
