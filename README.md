
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
- Log : **`Log`**
- Users status : **`Status`**
- Users configurations : **`Config`**
- Directories, Logs : **`Misc`**
## Table of contents

  * [Install](#install)
    + [Install / Add](#install--add)
    + [Content Delivery Networks](#content-delivery-networks)
      - [UNPKG](#unpkg)
      - [jsDelivr](#jsdelivr)
  * [Simple API](#simple-api)
    + [Importing the Simple API](#importing-the-simple-api)
    + [Authentication with the simple API](#authentication-with-the-simple-api)
      - [Initializing](#initializing)
      - [Setting the engine host](#setting-the-engine-host)
      - [Authenticating an user](#authenticating-an-user)
      - [Validating a token](#validating-a-token)
      - [Setting a callback when a new token is refreshed](#setting-a-callback-when-a-new-token-is-refreshed)
      - [Loggin out](#loggin-out)
    + [Conference](#conference)
      - [Joining a room](#joining-a-room)
      - [Sending a chat message in the room](#sending-a-chat-message-in-the-room)
      - [Sending a custom message to all participants](#sending-a-custom-message-to-all-participants)
      - [Sharing the user screen](#sharing-the-user-screen)
      - [Stopping the screen share](#stopping-the-screen-share)
      - [Disabling the camera](#disabling-the-camera)
      - [Enabling the camera](#enabling-the-camera)
      - [Disabling the microphone](#disabling-the-microphone)
      - [Enabling the microphone](#enabling-the-microphone)
      - [Accessing room participants](#accessing-room-participants)
      - [Disconnect from the room](#disconnect-from-the-room)
    + [Conference events](#conference-events)
    + [Conference features](#ad-hoc-conference-features)
      - [Merging sessions in one conference](#merging-sessions-in-one-conference)
      - [Add a session to a conference](#add-a-call-to-a-conference)
      - [Remove a session from a conference](#remove-a-call-from-a-conference)
      - [Unmerge a sessions from a conference](#terminating-a-conference)
    + [Accessing the current WebRtc phone](#accessing-the-current-webrtc-phone)
    + [Domains](#domains)
      - [Participant](#participant)
      - [Participant events](#participant-events)
      - [Stream](#stream)
    + [Softphone integration](#softphone-integration)
  * [Advanced API](#advanced-api)
    + [Libraries](#libraries)
      - [Require / Import](#require--import)
        - [API Client Library](#api-client-library)
        - [WebRTC Library](#webrtc-library)
        - [WebSocket Library](#websocket-library)
    + [Authentication](#authentication)
      - [Initialization](#initialization)
        - [When using API Client](#when-using-api-client)
        - [When using WebRTC](#when-using-webrtc)
      - [Log In](#log-in)
      - [Set token (and refresh token)](#set-token-and-refresh-token)
      - [Add an event when the token is refreshed](#add-an-event-when-the-token-is-refreshed)
      - [Log Out](#log-out)
      - [Check token](#check-token)
      - [Other auth methods](#other-auth-methods)
    + [Sending logs to fluentd via a http endpoint](#sending-logs-to-fluentd-via-a-http-endpoint)
    + [Interact with the engine](#interact-with-the-engine)
      - [Applicationd](#applicationd)
      - [Calld](#calld)
      - [Confd](#confd)
      - [Dird](#dird)
      - [Agentd](#agentd)
      - [callLogd](#calllogd)
      - [Chatd](#chatd)
      - [Calling an API endpoint without WazoApiClient](#calling-an-api-endpoint-without-wazoapiclient)
    + [WebRTCClient](#webrtcclient)
      - [WebRTCClient Configuration](#webrtcclient-configuration)
      - [Basic client features](#basic-client-features)
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
    + [WebRTCPhone](#webrtcphone)
      - [Basic phone features](#basic-phone-features)
        - [Calling a number](#calling-a-number)
        - [Hangup a call](#hangup-a-call)
        - [Accepting a call](#accepting-a-call)
        - [Rejecting a call](#rejecting-a-call)
        - [Holding a call](#holding-a-call)
        - [Resuming a call](#resuming-a-call)
        - [Muting a call](#muting-a-call)
        - [Unmuting a call](#unmuting-a-call)
        - [Muting camera in a call](#muting-camera-in-a-call)
        - [Unmuting camera in a call](#unmuting-camera-in-a-call)
        - [Sending DTMF](#sending-dtmf)
        - [Make a blind transfer](#make-a-blind-transfer)
        - [Make an attended transfer](#make-an-attended-transfer)
        - [Start screen sharing](#start-screen-sharing)
        - [Stop screen sharing](#stop-screen-sharing)
      - [Conference phone features](#conference-phone-features)
        - [Starting a conference](#starting-a-conference)
        - [Adding a participant to the conference](#adding-a-participant-to-the-conference)
        - [Holding a conference](#holding-a-conference)
        - [Resuming a conference](#resuming-a-conference)
        - [Muting a conference](#muting-a-conference)
        - [Unmuting a conference](#unmuting-a-conference)
        - [Removing participants from a conference](#removing-participants-from-a-conference)
        - [Stopping a conference](#stopping-a-conference)
      - [Advanced phone features](#advanced-phone-features)
        - [Registering the phone](#registering-the-phone)
        - [Check if the phone is registered](#check-if-the-phone-is-registered)
        - [Un-registering the phone](#un-registering-the-phone)
        - [Updating audio output device](#updating-audio-output-device)
        - [Updating audio ring device](#updating-audio-ring-device)
        - [Updating audio input device](#updating-audio-input-device)
        - [Updating video input device](#updating-video-input-device)
        - [Checking if it has an active call](#checking-if-it-has-an-active-call)
        - [Retrieve the number of active calls](#retrieve-the-number-of-active-calls)
        - [Sending a SIP message](#sending-a-sip-message)
        - [Closing the phone](#closing-the-phone)
        - [Starting heartbeat](#starting-heartbeat)
        - [Stopping heatbeat](#stopping-heatbeat)
    + [WebSocketClient](#wazo-websocket)
      - [Web Socket features](#web-socket-features)
        - [Opening the socket](#opening-the-socket)
        - [Listening for event](#listening-for-event)
        - [Updating the user token](#updating-the-user-token)
        - [Closing the socket](#closing-the-socket)
      
## Install 
 
### Install / Add
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

You may install the Wazo JavaScript Software Development Kit to your project one of the following ways:
* `npm install @wazo/sdk`
* `yarn add @wazo/sdk`

### Content Delivery Networks
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

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

### Importing the Simple API
```js
// For Node / packaged app
import Wazo from '@wazo/sdk/lib/simple';

// Browser
// You can access the `Wazo` object directly on the browser, simply include it in the html :
<script src="https://unpkg.com/@wazo/sdk/dist/wazo-sdk.js"></script>
or 
<script src="https://cdn.jsdelivr.net/npm/@wazo/sdk"></script>
```

### Authentication with the simple API

#### Initializing
```js
Wazo.Auth.init(clientId, tokenExpiration, minSubscriptionType, authorizationName);
```

- `clientId`: string (optional)
  - An identifier of your application that will be used to refresh users token 
  
- `tokenExpiration`: number (optional, default 3600 seconds)
  - Duration before token expiration (in seconds) 
  
- `minSubscriptionType`: number (optional)
  - Defines the minimum user subscription type that allows access to your application.
  
- `authorizationName`: string (optional)
  - Defines the name of the authorization the user should have to ba able to login.
  
#### Setting the engine host

```js
Wazo.Auth.setHost(host);
```

- `host`: string
  - URL to your host (include port if needed).

#### Customizing all the `fetch` options

```js
Wazo.Auth.fetchOptions({
  referrer: '',
});
```

- `options`: Object
  - Options passed to all the `fetch` requests of the SDK.

### Authenticating an user
```js
const session = await Wazo.Auth.logIn(username, password, backend, tenantId);
```

- `username`: string
  - User's username

- `password`: string
  - User's password

- `backend`: string
  - Optional string. If omitted, defaults to wazo_user

- `tenantId`: string
  - Optional string. The tenant identifier (uuid or slug). Needed when backend is external (not wazo_user)

Returns as `Wazo.domain.Session`. This object contains, among other information, the user's token.

Note: you need to set `clientId` in your WazoAPIClient in order to get a refresh token in the returned `Session`.

#### Validating a token

```js
const session = await Wazo.Auth.validateToken(token, refreshToken);
```

- `token`: string
  - User's token to validate (eg: makes sure the token is valid and not expired).
  
- `refreshToken`: string (optional)
  - User's refresh token, used to generate a new token if expired.

Returns as `Wazo.domain.Session`.

#### Setting a callback when a new token is refreshed

When the user's token is about to expire, Wazo's SDK triggers a callback so you can update it in your application.
Like updating the new token in your localstorage / cookies.

Note: you need to set `clientId` in your WazoAPIClient in order to refresh tokens.

```js
Wazo.Auth.setOnRefreshToken(token => { /* Do something with the new token */ });
```

- `callback`: Function(token: string)
  - A function that is triggered when the user's token will soon expire.

#### Loggin out

Destroys user's token and refreshToken.

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
   A boolean, if you want to send the user audio or not; or an Object, if you want to specify the audio input, etc...
   See [getUserMedia arguments](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) for more information. 
 - `video`: boolean|Object 
   A boolean, if you want to send the user video or not; or an Object, if you want to specify the audio input, etc...
   See [getUserMedia arguments](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) for more information.
 - `extra`: Object
   A map of values that will be added to the information of the current participant.

Returns a `Wazo.Room` instance.

#### Sending a chat message in the room

```js
room.sendChat(content);
```

- `content`: string
  The chat message content you want to send to all participants in the room.
  
#### Sending a custom message to all participants

```js
room.sendSignal(content);
```

- `content`: string
  The message content you want to send to all participants in the room.
  
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

Triggered when receiving a chat message.

- `message`: string

```js
room.on(room.ON_MESSAGE, (message) => {});
```

Triggered when receiving a custom message.

- `message`: string

```js
room.on(room.ON_JOINED, (participant) => {});
```

Triggered when joining the room.

- `participant`: `Wazo.LocalParticipant`.

```js
room.on(room.CONFERENCE_USER_PARTICIPANT_JOINED, (participant) => {});
```

Triggered when a participant joins the room.

- `participant`: `Wazo.RemoteParticipant`.

```js
room.on(room.CONFERENCE_USER_PARTICIPANT_LEFT, (participant) => {});
```

Triggered when a participant leaves the room.

- `participant`: `Wazo.RemoteParticipant`.

```js
room.on(room.ON_SCREEN_SHARE_ENDED, () => {});
```

Triggered when screensharing is stopped.

- `participant`: `Wazo.RemoteParticipant`.

```js
room.on(room.ON_TALKING, (channel, participant) => {});
```

Triggered when a participant is talking, or stops talking.

- `channel`: Object containing information about the event.
- `participant`: `Wazo.RemoteParticipant` or `Wazo.LocalParticipant`.
  The participant instance, your can access the `participant.isTalking` attribute to know the status.
  
### Ad hoc Conference features
**`Voice`**   **`Video`** 

#### Merging sessions in one conference
Use this method to merge multiple calls in a new ad hoc conference.
```js
const adHocConference = Wazo.Phone.startConference(host: CallSession, otherCalls: CallSession[]): Promise<AdHocAPIConference>;
```

#### Add a call to a conference
Use this method to add a single call to an existing conference room.
```js
adHocConference.addParticipant(participant: CallSession);
```

#### Remove a call from a conference
Use this method to remove a participant from a conference.
```js
adHocConference.removeParticipant(callSession: CallSession);
// shouldHold indicate if the session should be held after removed from session
```

#### Terminating a conference
Use this method to remove a single participant from a conference.
```js
adHocConference.hangup();
```
  
### Accessing the current WebRtc phone

You can access the current [webRtcPhone instance](#WebRTCPhone) via `Wazo.Phone.phone`.

### Domains

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
  Indicates if the participant has muted his microphone.
  
- `videoMuted`: boolean
  Indicates if the participant has muted his camera.
  
- `screensharing`: boolean
  Indicates if the participant is currently sharing his screen.
  
- `extra`: Object
  extra information related to a participant.
  
  
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

Triggered when the participant stops talking.

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

Triggered when the participant stops sending a stream.

- `stream`: `Wazo.Stream`
  A Wazo stream that is no longer sent by the participant.
  
```js
participant.on(participant.ON_AUDIO_MUTED, () => {});
```

Triggered when the participant has disabled his microphone.
  
```js
participant.on(participant.ON_AUDIO_UNMUTED, () => {});
```

Triggered when the participant has enabled his microphone. 
  
```js
participant.on(participant.ON_VIDEO_MUTED, () => {});
```

Triggered when the participant has disabled his camera. 
  
```js
participant.on(participant.ON_VIDEO_UNMUTED, () => {});
```

Triggered when the participant has enabled his camera. 
  
```js
participant.on(participant.ON_SCREENSHARING, () => {});
```

Triggered when the participant is sharing his screen. 
  
```js
participant.on(participant.ON_STOP_SCREENSHARING, () => {});
```

Triggered when the participant stop sharing his screen. 

#### Stream

`Wazo.Stream` helps attaching or detaching streams to html elements:

`stream.attach(htmlEmelent)`

Attaches a stream to an existing htmlElement or creates and returns a new one.

- `htmlElement`: htmlElement (optional).

Returns a `htmlElement` (audio or video) attached to the stream.

`stream.detach(htmlEmelent)`

Detaches a stream from an existing htmlElement.

- `htmlElement`: htmlElement.

### Softphone integration

To be able to integrate Wazo softphone in any web page, you can add :

```js
Wazo.Softphone.init({ 
  url, //  Url of the softphone to be loaded in the iframe (optional).
  width, // Width (in px) of the softphone (optional).
  height, // Height (in px) of the softphone (optional).
  server, // Stack host where the softphone should connect user  (optional).
  port, // Stack port where the softphone should connect user  (optional).
  language, // Softphone language (optional).
  wrapUpDuration, // How long (in seconds) should the softphone display the card after the call (optional).
  // When the user changes anything on the card, this timeout is canceled
  enableAgent, // display the agent tab in the tab bar (defaults to true).
  tenantId, // Tenant id used for LDAP connection
  debug, // Set to `true` to display wording customization labels
});
```

#### Methods

##### Making a call
```js
Wazo.Softphone.makeCall(number);
```
- `number`: Number to call through the softphone

##### Showing / hidding the softphone
```js
Wazo.Softphone.toggleSoftphoneDisplay();
Wazo.Softphone.displaySoftphone();
Wazo.Softphone.hideSoftphone();
```

##### Parsing links on the page
```js
Wazo.Softphone.parseLinks();
```

Each link with a `href="tel:"` or  `href="callto:"` will make a call through the softphone.

#### Sending search results to the softphone:
```js
Wazo.Softphone.onOptionsResults(fieldId, results);
```

`onOptionsResults` is used to populate Autocomplete fields

#### Updating card value:
```js
Wazo.Softphone.setCardValue(field, value);
```

#### Customizing page style

You can inspect the iframe with your dev tool console to figure out how to override styles.

```js
Wazo.Softphone.injectCss(`
  # Reduce dialer number font size
  .keypad-number, .keypad-number::placeholder {
    font-size: 20px;
  }
`);
```

#### Override appearance
```js
Softphone.customizeAppearance({
  // Theme, default values :
  primary: '#203890',
  button: '#292C87',
  black: '#000',
  white: '#fff',
  greenButton: '#7ed865',
  greenButtonHover: '#6ebf5a',
  redButton: '#FA5846',
  redButtonHover: '#FF604F',
  buttonText: '#fff',
  error: '#E80539',
  secondary: '#203890',
  grey: '#8A95A0',
  secondGrey: '#eee',
  headerColor: '#888',
  avatar: '#bdbdbd',
  divider: 'rgba(0, 0, 0, 0.12)',
  placeholder: 'rgba(22, 44, 66, 0.5)',
  hovered: '#6181F4',
}, {
  // Translation
  // Set `debug: true` to know where to change translations, eg:
  en: {
    user: {
      login: 'My login button', // will be displayed as `user:login` in the button when settings `debug: true` in the init() method
    },
  },
}, {
  // Assets
  // logo: [url to your logo],
});
```

`onOptionsResults` is used to populate Autocomplete fields

#### Customizing card form

You can use [JSON schema](http://json-schema.org/) to customize the card form with `Softphone.setFormSchema(schema, uiSchema)`,
the Softphone uses [React Json schema form](https://react-jsonschema-form.readthedocs.io) internally to display card form :

```js
Softphone.setFormSchema({
  type: 'object',
  required: ['title', 'phone'],
  properties: {
    title: { type: 'string', title: 'Title' },
    phone: { type: 'string', title: 'Phone' },
    note: { type: 'string', title: 'Note' },
  },
}, {
  note: { 'ui:widget': 'textarea' },
});
```

##### Auto complete
We can use an `autocomplete` widget to search on fields in the `uiSchema`:

```js
{
  note :{ 'ui:widget': 'textarea'},
  clientId :{ 'ui:field': 'autocomplete'},
};
```

In the `schema` field, we can customize if we want to display a `+` button :
```js
clientId: {
  type: 'object',
  title: 'Client id',
  // triggers the `onDisplayLinkedOption` event when changing the value
  triggerDisplay: true,
  // createForm is another JSON schema the description the add option form.
  createForm: {
    optionLabel: '%firstname% %lastname%',
    schema: {
      type: 'object',
      required: ['phone'],
      properties: {
        firstname: { type: 'string', title: 'Firstname' },
        lastname: { type: 'string', title: 'Lastname' },
        phone: { type: 'string', title: 'Phone' },
      }
    },
    uiSchema: {}
  },
}
```

#### Callbacks

You can listen to softphone callback, with :

```js
Wazo.Softphone.onLinkEnabled = link => {
  // link is `<a>` html tag in the page with a href="tel:xx" (or callto:xxx) beeing processed
  // You can make change here, like addind className, etc ...
};

Softphone.onCallIncoming = call => {
  // Invoked when a call is incoming in the softphone
  // You can make action here like redirecting to the contact page (by using `call.number).
};

Softphone.onCallLocallyAnswered = call => {
  // Invoked when the user accepts the call locally
};

Softphone.onCallEstablished = call => {
  // Invoked when the call is up
};

Softphone.onOutgoingCallMade = call => {
  // Invoked when the user makes a call
};

Softphone.onCallRejected = call => {
  // Invoked when the user rejects an incoming call
};

Softphone.onCallEnded = (call, card, direction) => {
  // Invoked when the call is ended
};

Softphone.onCardSaved = card => {
  // Invoked when the user save the card at the end of the call
};

Softphone.onSearchOptions = (fieldId: string, query: string) => {
  // Invoked when the user is making a search from an Autocomplete field in the card form
  // We need to call `onOptionsResults` here to send results to the softphone
};

Softphone.onDisplayLinkedOption = (optionId: string) => {
  // Invoked when the user is selecting a value in a Autocomplete widget
  // useful to display this entity in your application
};

Softphone.onWazoContactSearch = (query: string) => {
  // Invoked when the user is searching from contact page
};

Softphone.onAgentLoggedIn = () => {
  // Invoked when the agent logs in
};

Softphone.onAgentLoggedOut = () => {
  // Invoked when the agent logs out
};

Softphone.onAgentPaused = () => {
  // Invoked when the agent is paused
};

Softphone.onLanguageChanged = (language: string) => {
  // Invoked when the user changed the softphone language
};

Softphone.onCallHeld = () => {
  // Invoked when the current call is held
};

Softphone.onCallResumed = () => {
  // Invoked when the current call is resumed
};

Softphone.onCallMuted = () => {
  // Invoked when the current call is muted
};

Softphone.onCallUnMuted = () => {
  // Invoked when the current call is un muted
};

Softphone.onDtmfSent = (tone: string) => {
  // Invoked when the user is sending a DTMF in the current call
};

Softphone.onDirectTransfer = (number: string) => {
  // Invoked when the user is transfers the current call directly
};

Softphone.onCreateIndirectTransfer = (number: string) => {
  // Invoked when the user initiates an indirect transfer for the current call
};

Softphone.onCancelIndirectTransfer = () => {
  // Invoked when the user cancels the current indirect transfer
};

Softphone.onConfirmIndirectTransfer = () => {
  // Invoked when the user confirms the current indirect transfer
};

Softphone.onIndirectCallMade = (call: Object) => {
  // Invoked when the current indirect transfer is made
};

Softphone.onIndirectTransferDone = (call: Object) => {
  // Invoked when the current indirect transfer is over
};

Softphone.onStartRecording = () => {
  // Invoked when the user records the current call
};

Softphone.onStopRecording = () => {
  // Invoked when the user stops recording the current call
};

Softphone.onAuthenticated = session => {
  // Invoked when the user is authenticated in the softphone
};

Softphone.onLoggedOut = session => {
  // Invoked when the user is is logged out in the softphone
};

Softphone.onIFrameLoaded = session => {
  // Invoked when the iframe is loaded
};
```

## Advanced API

### Libraries
#### Require / Import
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

Depending on your preference, you may require or add the Wazo SDK to your own client application one of the following ways using:

##### API Client Library

* `const { WazoApiClient } = require('@wazo/sdk');`
* `import { WazoApiClient } from '@wazo/sdk';`

Depending on your environment you can import:
* `@wazo/sdk/esm`: compatible with (most) **browsers only**.
* `@wazo/sdk/lib`: runnable on `node` env.

##### WebRTC Library

```js
import { WazoWebRTCClient } from '@wazo/sdk';
```

##### WebSocket Library
```js
import { WazoWebSocketClient } from '@wazo/sdk';
```

### Authentication 
#### Initialization
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

##### When using API Client

```js
const client = new WazoApiClient({
  server: 'stack.dev.wazo.io', // required string
  agent: null, // http(s).Agent instance, allows custom proxy, unsecured https, certificate etc.
  clientId: null, // Set an identifier for your app when using refreshToken
  isMobile: false,
});
```

##### When using WebRTC
```js
const session = await client.auth.logIn({ ... });
```

#### Log In
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

```js
client.auth.logIn({
  expiration, // optional integer. Session life in number of seconds. If omitted, defaults to 3600 (an hour).
  username, // required string
  password, // required string
  backend, // optional string. If omitted, defaults to wazo_user
  mobile, // optional boolean. If omitted, defaults to false: tells if the current user uses a mobile application
  tenantId, // optional string. The tenant identifier (uuid or slug). Needed when backend is external (not wazo_user)
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
  acl,
  utc_expires_at,
  xivo_uuid,
  issued_at,
  utc_issued_at,
  auth_id,
  expires_at,
  xivo_user_uuid
});
// or
const { refreshToken, ...result } = await client.auth.logIn(/* ... */);
```

Note: you need to set `clientId` in your WazoAPIClient in order to get a refresh token.

#### Set token (and refresh token)
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

```js
client.setToken(token);
client.setRefreshToken(refreshToken);
client.setRefreshTokenExpiration(tokenExpirationInSeconds);
```

Note: you need to set `clientId` in your WazoAPIClient in order to get a refresh token.

#### Add an event when the token is refreshed
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

```js
client.setOnRefreshToken((newToken, newSession) => {
  // Do something with the new token and the new session (like storing them in the localstorage...).
});
```

Note: you need to set `clientId` in your WazoAPIClient in order to refresh token.

#### Log Out
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

```js
client.auth.logOut(token).then(/* ... */);
// or
await client.auth.logOut(token);
```

#### Check token
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

```
client.auth.checkToken(token).then(valid);
// or
const valid = await client.auth.checkToken(token);
```

#### Other auth methods
**`Config`**

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
client.auth.createPolicy(name, description, acl);
client.auth.listPolicies();
```

### Sending logs to fluentd via a http endpoint

#### Logger
**`Log`**

```
import Wazo from '@wazo/sdk/lib/simple';

Wazo.IssueReporter.enable();
Wazo.IssueReporter.configureRemoteClient({
    host: 'localhost', // fluentd http host
    port: 9880, // fluentd http port
    tag: 'name of your application,
    level: 'trace', // Min log level to be sent
    extra: {
      // Extra info sent for every logs
      user_uuid: '...',
    },
});
```

Using the logger :
```
// Log with for category, this will send a `category` attribute in every logs for this logger.
const logger = Wazo.IssueReporter.loggerFor('my_category');
logger(logger.TRACE, 'my log');

// or simply
Wazo.IssueReporter.log(Wazo.IssueReporter.INFO, 'my log');
```

### Interact with the engine 
#### Applicationd
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**

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

#### Calld
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**

Use Calld to directly control interactions.
(Please note, ctidNg endpoint is deprecated but continue to work with old version. **Please update your code**.)

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

#### Confd
**`Config`**

Use Confd to interact with configurations.
```js
client.confd.listUsers();
client.confd.getUser(userUuid);
client.confd.getUserLineSip(userUuid, lineId);
client.confd.listApplications();
```

#### Dird
**`Misc`**

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

#### Agentd
**`Misc`**

Use Agentd to handle agent states

Legacy (all versions)
```js
client.agentd.getAgent(agentNumber);
client.agentd.login(agentNumber, context, extension);
client.agentd.logout(agentNumber);
client.agentd.pause(agentNumber);
client.agentd.resume(agentNumber);
```
Log in with line ID only (engine version > 20.11 -- recommended)
```js
client.agentd.loginWithLineId(lineId);
```
No-args methods (engine version >= 20.17 -- recommended)
```js
client.agentd.getStatus();
client.agentd.staticLogout();
client.agentd.staticPause();
client.agentd.staticResume();
```

#### callLogd
**`Voice`**  **`Misc`**

Use callLogd to interact with call logs.
```js
client.callLogd.search(search, limit);
client.callLogd.listCallLogs(offset, limit);
client.callLogd.listCallLogsFromDate(from, number);
```

#### Chatd
**`Chat`** **`Status`**

Use chatd to send and retrieve chat messages and user statuses.
```js
client.chatd.getContactStatusInfo(contactUuid: UUID);
client.chatd.getState(contactUuid: UUID);
client.chatd.getLineState(contactUuid: UUID);
client.chatd.getMultipleLineState(contactUuids: ?Array<UUID>);
client.chatd.getUserRooms();
client.chatd.updateState(contactUuid: UUID, state: string);
client.chatd.updateStatus(contactUuid: UUID, state: string, status: string);
client.chatd.createRoom(name: string, users: Array<ChatUser>);
client.chatd.getRoomMessages(roomUuid: string);
client.chatd.sendRoomMessage(roomUuid: string, message: ChatMessage);
client.chatd.getMessages(options: GetMessagesOptions);
```

#### Calling an API endpoint without WazoApiClient
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**  **`Config`**   **`Misc`**

Use this generic method to request endpoints directly.

```js
const requester = new ApiRequester({ 
  server: 'stack.dev.wazo.io', // Engine server
  refreshTokenCallback: () => {}, // Called when the token is refreshed
  clientId: 'my-id', // ClientId used for refreshToken
  agent: null, // http(s).Agent instance, allows custom proxy, unsecured https, certificate etc.
  token: null, // User token (can be defined later with requester.setToken()
});

// Retrieve personal contacts
const results = await requester.call('dird/0.1/personal');

```

### WebRTCClient
This sample describes the very first steps to place a call using WebRTC.

```js
import { WazoWebRTCClient } from '@wazo/sdk'; // import the library

const session = await client.auth.logIn({ ... }); // log in

const client = new WazoWebRTCClient({
  displayName: 'From WEB',
  host: 'stack.dev.wazo.io',
  websocketSip: 'other.url.com', // Allows to connect throught another URL than host (default to `host` is not set).
  media: {
    audio: boolean,
    video: boolean | document.getElementById('video'), // pointing to a `<video id="video" />` element
    localVideo: boolean | document.getElementById('video'), // pointing to a `<video id="video" />` element
  }
}, session);

// eventName can be on the of events : 
// - transport: `connected`, `disconnected`, `transportError`, `message`, `closed`, `keepAliveDebounceTimeout`
// - webrtc: `registered`, `unregistered`, `registrationFailed`, `invite`, `inviteSent`, `transportCreated`, `newTransaction`, `transactionDestroyed`, `notify`, `outOfDialogReferRequested`, `message`.
client.on('invite', (sipSession: SipSession, hasVideo: boolean, shouldAutoAnswer: boolean) => {
  this.currentSipSession = sipSession;
  // ...
});

// We have to wait to be registered to be able to make a call
await client.waitForRegister();

client.call('1234');
```

#### WebRTCClient Configuration

```js
const config = {
  displayName: '', // Display name sent in SIP payload
  host: '', // Host where to connect
  port: '', // Port of the host (default to `443`)
  media: {
    audio: boolean, // If we want to send audio
    video: boolean | document.getElementById('video'), // pointing to a `<video id="video" />` element
    localVideo: boolean | document.getElementById('video'), // pointing to a `<video id="video" />` element
  },
  iceCheckingTimeout: 1000, // Time allowed to retrieve ice candidates
  log: {}, // @see https://sipjs.com/api/0.5.0/ua_configuration_parameters/#log
  audioOutputDeviceId: null, // The audio output device id (when we want to send audio in another destination).
  userAgentString: null, // Customize the User-Agent SIP header
  heartbeatDelay: 1000, // Duration in ms between 2 heartbeat (default to 2000)
  heartbeatTimeout: 5000, // Duration in ms when to consider that the Asterisk server is not responding (default to 5000)
  maxHeartbeats: 4, // Number of heatbeat send each time we want to check connection (default to 3)
  
  // When not passing session as second argument:
  authorizationUser: '', // The SIP username
  password: '', // The SIP user password
  uri: '', // The SIP user identity
}

const uaConfigOverrides = {
  peerConnectionOptions: {
    iceServers = [
      {urls: "stun:stun.example.com:443"},  // STUN server
      {urls: "turn:turn.example.com:443", username: "login", credential: "secret" },  // TURN server
      ...
    ]
  }
}

const client = new WazoWebRTCClient(config, session, /* optional */ uaConfigOverrides);
```

#### Basic client features
**`Voice`**   **`Video`**  **`Chat`**

##### Calling a number
Use this method to dial a number.
```js
client.call(number: string);
```

##### Be notified to a phone call
Use this method to be notified of an incoming call.
```js
client.on('invite', (sipSession: SipSession) => {
  this.currentSipSession = sipSession;
});
```

##### Answering a call
Use this method to pick up an incoming call.
```js
client.answer(sipSession: SipSession);
```

##### Hangup a call
Use this method to hangup a call (the call must have been already picked up)
```js
client.hangup(sipSession: SipSession);
```

##### Rejecting a call
Use this method to deny an incoming call (Must not have been picked up already)
```js
client.reject(sipSession: SipSession);
```

##### Muting a call
Use this method to mute yourself in a running call.
```js
client.mute(sipSession: SipSession);
```

##### Unmuting a call
Use this method to unmute yourself in a running call.
```js
client.unmute(sipSession: SipSession);
```

##### Holding a call
Use this method to put a running call on hold.
```js
client.hold(sipSession: SipSession);
```

##### Unholding a call
Use this method to resume a running call.
```js
client.unhold(sipSession: SipSession);
```

##### Make a blind transfer
Use this method to transfer a call to another target, without introduction
```js
client.transfer(sipSession: SipSession, target: string);
```

##### Make an attended transfer
Use this method to transfer a call to another target, but first introduce the caller to the transfer target. The transfer may be cancelled (hangup the transfer target) or completed (hangup the transfer initiator).
```js
transfer = client.atxfer(sipSession: SipSession);

// Start the transfer to a phone number, starts a new SIP session in the process
transfer.init(target: string)

// Get the new SIP session to the target of the transfer
targetSession = transfer.newSession

// Complete the transfer.
// transfer.init(...) must be called first.
transfer.complete()

// Cancel the transfer.
// transfer.init(...) must be called first.
transfer.cancel()
```

##### Sending a DTMF tone
Use this method to send the dual-tone multi-frequency from the phone keypad.
```js
client.sendDTMF(sipSession: SipSession, tone: string);
```

##### Sending a message
```js
client.message(destination: string, message: string);
```

#### Set the audio output volume

Stores a value between 0 and 1, which can be used to on your audio element

```js
phone.changeAudioOutputVolume(volume: number);
```

#### Set the audio ring volume

Stores a value between 0 and 1, which can be used to on your audio element

```js
phone.changeAudioRingVolume(volume: number);
```

#### Closing the RTC connection
Use this method to put an end to an RTC connection.

```js
client.close();
```

### WebRTCPhone
Higher level of abstraction to use the `WebRtcClient`.

```js
import { WazoWebRTCClient, WebRTCPhone } from '@wazo/sdk';

const webRtcClient = new WazoWebRTCClient({/* See above for parameters */});

const phone = new WebRTCPhone(
  webRtcClient: WazoWebRTCClient, // Instance of WazoWebRTCClient
  audioDeviceOutput: string, // The output device used to play audio
  allowVideo: boolean, // Allow to send and receive video
  audioDeviceRing, // The output device used to play ringtones
);
```

#### Basic phone features
**`Voice`**   **`Video`**  **`Chat`**

##### Calling a number
Use this method to dial a number.
```js
const callSession = await phone.makeCall(
  number: string, // The number to dial
  line: // Not used
  enableVideo: boolean // Optional (default to false) when we want to make a video call 
);
```

##### Hangup a call
Use this method to stop a call

```js
phone.hangup(
  callSession: CallSession, // The callSession to stop
);

```
##### Accepting a call
Use this method to accept (answer) an incoming call

```js
phone.accept(
  callSession: CallSession, // The callSession to accept
  cameraEnabled?: boolean // Should we accept the call with video
);
```

##### Rejecting a call
Use this method to reject an incoming call

```js
phone.reject(
  callSession: CallSession // The callSession to reject
);
```

##### Holding a call
Use this method to put a running call on hold.
```js
phone.hold(
  callSession: CallSession, // The call session to put on hold
  withEvent: boolean = true // Should the phone triggers event
);
```

##### Resuming a call
Use this method to resume a running call.
```js
phone.resume(callSession: CallSession);
```
Please note that `phone.resume()` is the preferred method
```js
phone.unhold(callSession: CallSession); // deprecated
```

##### Muting a call
Use this method to mute yourself in a running call.
```js
phone.mute(
  callSession: CallSession, // The call session to mute
  withEvent: boolean = true // Should the phone triggers event
);
```

##### Unmuting a call
Use this method to unmute yourself in a running call.
```js
phone.unmute(callSession: CallSession);
```

##### Muting camera in a call
Use this method to mute your camera in a running call.
```js
phone.turnCameraOff(callSession: CallSession);
```

##### Unmuting camera in a call
Use this method to unmute your camera in a running call.
```js
phone.turnCameraOn(callSession: CallSession);
```

##### Sending DTMF
Use this method to unmute yourself in a running call.
```js
phone.sendKey(callSession: CallSession, tone: string);
```

##### Transferring a call

###### Blind transfer

Use this method to transfer a call directly to another extension, without introduction
```js
phone.transfer(
  callSession: CallSession, // The call session to transfer
  target: string // The extension where to transfer to call
);
```

###### Attended transfer

Use this method to transfer a call to another extension by allowing to speak with the other participant first and validate the transfer after that.
You have to run `makeCall` first on the target to be able to confirm the transfer with this method.

```js
phone.indirectTransfer(
  callSession: CallSession, // The call session to transfer
  target: string // The extension where to transfer to call
);
```

##### Start screen sharing

```js
const screenShareStream: MediaStream = await phone.startScreenSharing({ 
  audio: true, 
  video: true, 
  /* See webRtc media constraints */ 
});
```

##### Stop screen sharing

```js
phone.stopScreenSharing();
```

#### Conference phone features
**`Voice`**   **`Video`**  **`Chat`** 

##### Starting a conference
Use this method to start an ad-hoc conference.

```js
phone.startConference(participants: CallSession[]);
```

##### Adding a participant to the conference

```js
phone.addToConference(participant: CallSession);
```

##### Holding a conference

```js
phone.holdConference(participants: CallSession[]);
```

##### Resuming a conference

```js
phone.resumeConference(participants: CallSession[]);
```

##### Muting a conference

```js
phone.muteConference(participants: CallSession[]);
```

##### Unmuting a conference

```js
phone.unmuteConference(participants: CallSession[]);
```

##### Removing participants from a conference

```js
phone.removeFromConference(participants: CallSession[]);
```

##### Stopping a conference

```js
phone.hangupConference(participants: CallSession[]);
```

#### Advanced phone features
**`Voice`**   **`Video`**  **`Chat`**

##### Registering the phone
Sends a SIP `REGISTER` payload
```js
phone.register();
```

##### Check if the phone is registered

```js
phone.isRegistered();
```

##### Un-registering the phone
Sends a SIP `UNREGISTER` payload
```js
phone.unregister();
```

##### Updating audio output device

```js
phone.changeAudioDevice(someDevice: string);
```

##### Updating audio ring device

```js
phone.changeRingDevice(someDevice: string);
```

##### Updating audio input device

```js
phone.changeAudioInputDevice(someDevice: string);
```

##### Updating video input device

```js
phone.changeVideoInputDevice(someDevice: string);
```

##### Checking if it has an active call

```js
phone.hasAnActiveCall(): boolean;
```

##### Retrieve the number of active calls

```js
phone.callCount(): number;
```

##### Sending a SIP message
Sends a SIP MESSAGE in a session. 
Use `phone.currentSipSession` to retrieve the current `sipSession`. 

```js
phone.sendMessage(
  sipSession: SipSession = null, The sip session where to send to message
  body: string, // The message to SEND
);
```

##### Closing the phone
Disconnect the SIP webSocket transport.

```js
phone.stop();
```

##### Starting heartbeat
Sends a SIP `OPTIONS` every X seconds, Y times and timeout after Z seconds.
See webrtcClient's `heartbeatDelay`, `heartbeatTimeout`, `maxHeartbeats`, [configuration](#webrtccient-configuration).

```js
phone.startHeartbeat();
```

##### Stopping heatbeat

```js
phone.stopHeartbeat();
```

### Wazo WebSocket
You can use the Wazo WebSocket to listen for real time events (eg: receiving a chat message, a presential update ...)

#### Web Socket features
**`Voice`**   **`Video`**  **`Chat`**   **`Fax`**  **`Status`**

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

#### Closing the socket
```js
ws.close();
```
