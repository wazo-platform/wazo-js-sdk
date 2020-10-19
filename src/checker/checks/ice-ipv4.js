/* global MediaStream, RTCPeerConnection */

import { parseCandidate } from '../../utils/webrtc';

const checkIsIPV4 = ip => {
  const blocks = ip.split('.');
  if (blocks.length !== 4) {
    return false;
  }

  return blocks.every(block => parseInt(block, 10) >= 0 && parseInt(block, 10) <= 255);
};

export default {
  name: 'Non IP v4 ice',
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

    const ips = [];

    pc.onicecandidate = e => {
      if (e.candidate && e.candidate.candidate.indexOf('srflx') !== -1) {
        const candidate = parseCandidate(e.candidate.candidate);
        ips.push(candidate.ip);
      } else if (!e.candidate) {
        if (ips.every(checkIsIPV4)) {
          resolve();
        } else {
          const nonIPV4 = ips.find(ip => !checkIsIPV4(ip));

          reject(new Error(`Non IPv4 ice candidate found : ${nonIPV4}.`));
        }

      }
    };

    pc.createOffer().then(offer => pc.setLocalDescription(offer));
  }),
};
