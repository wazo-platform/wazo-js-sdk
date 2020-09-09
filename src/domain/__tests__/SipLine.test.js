import SipLine, { MINIMUM_WAZO_ENGINE_VERSION_FOR_PJSIP } from '../SipLine';
import Session from '../Session';

describe('SipLine domain', () => {
  it('CHAN_SIP : can tell if we have videoConference capabilities', () => {
    const sess = new Session({
      token: 'ref-12345',
      uuid: '1234',
      engineVersion: '20.12',
    });
    const getSipLine = options => new SipLine({ options });

    expect(getSipLine([['max_audio_streams', '1'], ['max_video_streams', '2']]).hasVideoConference(sess)).toBe(true);
    expect(getSipLine([['max_audio_streams', '1'], ['max_video_streams', '1']]).hasVideoConference(sess)).toBe(false);
    expect(getSipLine([['max_audio_streams', '2']]).hasVideoConference(sess)).toBe(false);
    expect(getSipLine([['max_video_streams', '2']]).hasVideoConference(sess)).toBe(false);
    expect(getSipLine([['max_audio_streams', '2'], ['max_video_streams', '2']]).hasVideoConference(sess)).toBe(true);
  });

  it('PJSIP : can tell if we have videoConference capabilities', () => {
    const sess = new Session({
      token: 'ref-12345',
      uuid: '1234',
      engineVersion: MINIMUM_WAZO_ENGINE_VERSION_FOR_PJSIP,
    });
    const getSipLine = endpointSectionOptions => new SipLine({ endpointSectionOptions });

    expect(getSipLine([['max_audio_streams', '1'], ['max_video_streams', '2']]).hasVideoConference(sess)).toBe(true);
    expect(getSipLine([['max_audio_streams', '1'], ['max_video_streams', '1']]).hasVideoConference(sess)).toBe(false);
    expect(getSipLine([['max_audio_streams', '2']]).hasVideoConference(sess)).toBe(false);
    expect(getSipLine([['max_video_streams', '2']]).hasVideoConference(sess)).toBe(false);
    expect(getSipLine([['max_audio_streams', '2'], ['max_video_streams', '2']]).hasVideoConference(sess)).toBe(true);
  });
});
