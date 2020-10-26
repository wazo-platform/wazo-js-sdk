/* global MediaStream, RTCPeerConnection */
import { parseCandidate } from '../../utils/webrtc';

// @see https://webrtchacks.com/symmetric-nat/
export default {
  name: 'Symmetric NAT',
  check: () => new Promise((resolve, reject) => {
    if (typeof MediaStream === 'undefined') {
      return resolve('Skipped on node');
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
      ],
    });

    pc.createDataChannel('wazo-check-nat');

    const candidates = {};

    pc.onicecandidate = e => {
      if (e.candidate && e.candidate.candidate.indexOf('srflx') !== -1) {
        const cand = parseCandidate(e.candidate.candidate);
        if (!candidates[cand.relatedPort]) candidates[cand.relatedPort] = [];
        candidates[cand.relatedPort].push(cand.port);
      } else if (!e.candidate) {
        if (Object.keys(candidates).length === 1) {
          const ports = candidates[Object.keys(candidates)[0]];

          if (ports.length === 1) {
            resolve();
          } else {
            reject(new Error('Symmetric NAT detected, you should use a TURN server.'));
          }
        }
      }
    };

    pc.createOffer().then(offer => pc.setLocalDescription(offer));
  }),
};
