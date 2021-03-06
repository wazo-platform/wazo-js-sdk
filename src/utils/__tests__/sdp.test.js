/* eslint-disable max-len */
import sdpParser from 'sdp-transform';

import { getCandidates, isSdpValid, parseCandidate, areCandidateValid, fixSdp } from '../sdp';

const goodSdp = `
c=IN IP4 203.0.113.1
m=audio 54400 RTP/SAVPF 0 96
a=candidate:0 1 UDP 2113667327 203.0.113.1 54400 typ host
a=candidate:3996450952 1 udp 41819903 14.72.21.2 65092 typ relay raddr 0.0.0.0 rport 0 generation 0 network-id 3 network-cost 10
`;

const badMobileSdp = `
o=- 31220837228924684 2 IN IP4 127.0.0.1
s=-
t=0 0
a=group:BUNDLE audio
a=msid-semantic: WMS 2a3e8274-4db9-4f34-8f1e-55253704e963
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 102 0 8 106 105 13 110 112 113 126
c=IN IP4 0.0.0.0
a=rtcp:9 IN IP4 0.0.0.0
a=ice-ufrag:FPMp
a=ice-pwd:yf5Yd+nYwcUHsGtD0pmDWudF
a=ice-options:trickle renomination
a=fingerprint:sha-256 39:C2:F1:61:B0:B6:85:B3:CB:49:A0:29:B2:28:84:ED:80:0E:BE:A0:4E:AF:81:ED:EE:D4:63:DB:2A:B5:63:73
a=setup:actpass
a=mid:audio
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level
a=sendrecv
a=rtcp-mux
a=rtpmap:111 opus/48000/2
a=rtcp-fb:111 transport-cc
a=fmtp:111 minptime=10;useinbandfec=1
a=rtpmap:103 ISAC/16000
a=ssrc:3716126308 label:3e68fa77-fca9-4b21-a00f-27c65d78928e
`;

const badSdp = `
c=IN IP4 203.0.113.1
m=audio 54400 RTP/SAVPF 0 96
a=candidate:0 1 UDP 2113667327 203.0.113.1 54400 typ host
`;

const candidate = 'candidate:3996450952 1 udp 41819903 14.72.2.1 57021 typ relay raddr 0.0.0.0 rport 0 generation 0 ufrag Ja/g network-id 3 network-cost 10';

describe('SDP utils', () => {
  describe('Parsing candidates', () => {
    it('should return all candidates', async () => {
      const candidates = getCandidates(goodSdp);

      expect(candidates.length).toBe(2);
      expect(candidates[0].type).toBe('host');
      expect(candidates[1].type).toBe('relay');

      expect(isSdpValid(goodSdp)).toBeTruthy();

      expect(getCandidates(badMobileSdp).length).toBe(0);
      expect(getCandidates(null).length).toBe(0);
      expect(getCandidates('').length).toBe(0);
      expect(getCandidates('nothing!').length).toBe(0);
    });
  });

  describe('Parsing candidate', () => {
    it('should parse a single candidate', async () => {
      const parsed = parseCandidate(candidate);

      expect(parsed.type).toBe('relay');
      expect(parsed.ip).toBe('14.72.2.1');
    });
  });

  describe('Validating candidates', () => {
    it('should parse a single candidate', async () => {
      expect(areCandidateValid([null])).toBeFalsy();
      expect(areCandidateValid([parseCandidate(candidate)])).toBeTruthy();
    });
  });

  describe('Validating sdp', () => {
    it('should tell if a sdp is valid', async () => {
      expect(isSdpValid(goodSdp)).toBeTruthy();
      expect(isSdpValid(badSdp)).toBeFalsy();
      expect(isSdpValid(badMobileSdp)).toBeFalsy();
    });
  });

  describe('Fixing sdp', () => {
    it('should fix a SDP without candidate or IN ip', async () => {
      const candidates = [parseCandidate(candidate)];

      const fixedSdp = fixSdp(badMobileSdp, candidates);
      const parsed = sdpParser.parse(fixedSdp);

      expect(parsed.media[0].candidates.length).toBe(1);
      expect(parsed.media[0].port).toBe(57021);
      expect(parsed.origin.address).toBe('14.72.2.1');
      expect(fixedSdp.indexOf('IN 0.0.0.0')).toBe(-1);
    });
  });
});
