/* global MediaStream, RTCPeerConnection */

const parseCandidate = line => {
  let parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  const candidate = {
    foundation: parts[0],
    component: parts[1],
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7],
  };

  for (let i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      default: // Unknown extensions are silently ignored.
        break;
    }
  }

  return candidate;
};

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
