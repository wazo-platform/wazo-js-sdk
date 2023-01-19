import api from './api';
import aor from './aor';
import wazoWebsocket from './wazo-websocket';
import webrtcTransport from './webrtc-transport';
import webrtc from './webrtc';
import SymmetricNat from './symmetric-nat';
import iceIpv4 from './ice-ipv4';

export default [aor, api, wazoWebsocket, webrtcTransport, webrtc, SymmetricNat, iceIpv4];
