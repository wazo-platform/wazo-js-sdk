/* global Wazo, document */
const server = 'awesome.server.io';
const username = 'me@awesome.io';
const password = 'MySecretPassword';

const extension1Input = document.getElementById('extension1');
const callButton1 = document.getElementById('call1');
const extension2Input = document.getElementById('extension2');
const callButton2 = document.getElementById('call2');
const createConferenceButton = document.getElementById('create-conference');
const hangupButton = document.getElementById('hangup');
let call1;
let call2;
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
  if (call1) {
    await Wazo.Phone.hangup(call1);
  }
  if (call2) {
    await Wazo.Phone.hangup(call2);
  }
};

callButton1.onclick = async () => {
  call1 = await Wazo.Phone.call(extension1Input.value);
  callButton2.style.display = 'inline';
  extension2Input.style.display = 'inline';
  console.log('Call 1 placed');
};

callButton2.onclick = async () => {
  call2 = await Wazo.Phone.call(extension2Input.value);
  console.log('Call 2 placed');

  createConferenceButton.style.display = 'inline';
};

createConferenceButton.onclick = async () => {
  adHocConference = await Wazo.Phone.startConference(call1, [call2]);
  console.log('conference started', adHocConference);
};

const updateCalls = ({ data }) => {
  const call = Wazo.domain.Call.parse(data);
  const updatedCallSession = Wazo.domain.CallSession.parseCall(call);

  // Update call with Wazo's callId
  if (call1 && call1.is(updatedCallSession)) {
    call1.updateFrom(updatedCallSession);
  }
  if (call2 && call2.is(updatedCallSession)) {
    call2.updateFrom(updatedCallSession);
  }
};

Wazo.Websocket.on(Wazo.Websocket.CALL_CREATED, updateCalls);
Wazo.Websocket.on(Wazo.Websocket.CALL_UPDATED, updateCalls);

(async () => {
  // Auth
  Wazo.Auth.setHost(server);
  try {
    await Wazo.Auth.logIn(username, password);
    await Wazo.Phone.connect();
  } catch (error) {
    console.error('Auth error', error);
    return;
  }
  console.log('User logged in');
})();
