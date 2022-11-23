/* global Wazo, document */
import { WazoWebRTCClient, WazoWebSocketClient, WazoApiClient, SOCKET_EVENTS } from '@wazo/sdk';
import WebRTCPhone from '@wazo/sdk/lib/domain/Phone/WebRTCPhone';
import Call from '@wazo/sdk/lib/domain/Call';
import CallSession from '@wazo/sdk/lib/domain/CallSession';
import AdHocAPIConference from '@wazo/sdk/lib/domain/AdHocAPIConference';

const server = 'stack.dev.wazo.io';
const username = 'equentin@wazo.io';
const password = 'coin';

const extension1Input = document.getElementById('extension1');
const callButton1 = document.getElementById('callSession1');
const extension2Input = document.getElementById('extension2');
const callButton2 = document.getElementById('callSession2');
const createConferenceButton = document.getElementById('create-conference');
const hangupButton = document.getElementById('hangup');
let phone;
let websocket;
let callSession1;
let callSession2;
let adHocConference;

// Hide merge button for now
createConferenceButton.style.display = 'none';
callButton2.style.display = 'none';
extension2Input.style.display = 'none';

hangupButton.onclick = async () => {
  if (adHocConference) {
    await adHocConference.hangup();
    return;
  }
  if (callSession1) {
    await phone.hangup(callSession1);
  }
  if (callSession2) {
    await phone.hangup(callSession2);
  }
};

callButton1.onclick = async () => {
  callSession1 = await phone.makeCall(extension1Input.value);
  callButton2.style.display = 'inline';
  extension2Input.style.display = 'inline';
  console.log('Call 1 placed');
};

callButton2.onclick = async () => {
  callSession2 = await phone.makeCall(extension2Input.value);
  console.log('Call 2 placed');

  createConferenceButton.style.display = 'inline';
};

createConferenceButton.onclick = async () => {
  const participants = [callSession1, callSession2].reduce((acc, participant) => {
    acc[participant.getTalkingToIds()[0]] = participant;
    return acc;
  }, {});

  if (!this.phone) {
    return Promise.reject();
  }

  adHocConference = new AdHocAPIConference({ phone: this.phone, callSession1, participants });

  adHocConference.start();
  console.log('conference started', adHocConference);
};

const updateCalls = ({ data }) => {
  const call = Call.parse(data);
  const updatedCallSession = CallSession.parseCall(call);

  // Update call with Wazo's callId
  if (callSession1 && callSession1.is(updatedCallSession)) {
    callSession1.updateFrom(updatedCallSession);
  }
  if (callSession2 && callSession2.is(updatedCallSession)) {
    callSession2.updateFrom(updatedCallSession);
  }
};

(async () => {
  const apiClient = new WazoApiClient({ server });
  const session = await apiClient.auth.logIn({ username, password });
  const sipLine = session.primaryWebRtcLine();
  apiClient.setToken(session.token);

  const webRtcClient = new WazoWebRTCClient({
    displayName: 'Me', // Display name sent in SIP payload
    host: server, // Host where to connect
    // When not passing session as second argument:
    authorizationUser: sipLine.username,
    password: sipLine.secret,
    uri: `${sipLine.username}@${server}`,
  });

  phone = new WebRTCPhone(webRtcClient);

  websocket = new WazoWebSocketClient({
    host: server, // wazo websocket host
    token: session.token, // valid Wazo token
    events: ['*'], // List of events you want to receive (use `['*']` as wildcard).
  });

  websocket.on(SOCKET_EVENTS.CALL_CREATED, updateCalls);
  websocket.on(SOCKET_EVENTS.CALL_UPDATED, updateCalls);
})();
