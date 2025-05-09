import moment from 'moment';
import CallLog, { Response, CallLogResponse, CALL_LOG_VALID_REQUESTED_VERSION } from '../CallLog';
import Recording from '../Recording';
import Session from '../Session';
import Profile from '../Profile';
import Line from '../Line';

const ALICE_EXTENSION = '41';
const ALICE_UUID = '11111111-1111-1111-1111-111111111111';

const BOB_EXTENSION = '42';
const BOB_UUID = '22222222-2222-2222-2222-222222222222';

const CHARLIE_EXTENSION = '43';
const CHARLIE_UUID = '33333333-3333-3333-3333-333333333333';

// Default scenario: Alice > Bob (No anwser forward) > Charlie
const CALL_LOG_RESPONSE: CallLogResponse = {
  id: 1,
  answer: '2024-01-02T00:00:00.000000+00:00',
  answered: true,
  call_status: 'answered',
  call_direction: 'internal',
  source_name: 'Alice',
  source_extension: ALICE_EXTENSION,
  source_user_uuid: ALICE_UUID,
  requested_name: 'Bob',
  requested_extension: BOB_EXTENSION,
  requested_user_uuid: BOB_UUID,
  destination_name: 'Charlie',
  destination_extension: CHARLIE_EXTENSION,
  destination_user_uuid: CHARLIE_UUID,
  duration: 4,
  start: '2024-01-01T00:00:00.000000+00:00',
  end: '2024-01-01T00:00:04.000000+00:00',
  recordings: [{
    uuid: '0394ad6f-5c72-4072-8503-e3ad9a41c0a0',
    start_time: '2024-01-01T00:00:00.000000+00:00',
    end_time: '2024-01-01T00:00:04.000000+00:00',
    filename: '2024-01-01T00_00_04UTC-61886-0394ad6f-5c72-4072-8503-e3ad9a41c0a0.wav',
    deleted: false,
  }],
};
const CALL_LOG = CallLog.parse(CALL_LOG_RESPONSE);

const generateBobSession = (opts?: Partial<Session>): Session =>
  new Session({
    acl: [],
    token: 'ref-12345',
    uuid: BOB_UUID,
    expiresAt: new Date(9999, 0, 1),
    engineVersion: CALL_LOG_VALID_REQUESTED_VERSION,
    profile: new Profile({
      lines: [new Line({
        id: 1,
        extensions: [{
          id: 1,
          exten: BOB_EXTENSION,
          context: 'internal',
        }],
      })],
    } as any),
    ...(opts || {}),
  });

const BOB_SESSION = generateBobSession();

describe('CallLog Domain', () => {
  describe('parseMany', () => {
    it('can parse a plain call log to domain', () => {
      const response: Response = {
        filtered: 6,
        items: [CALL_LOG_RESPONSE],
        total: 233,
      };

      const logs = CallLog.parseMany(response);
      expect(logs).toEqual([new CallLog({
        id: 1,
        answer: moment(CALL_LOG_RESPONSE.answer).toDate(),
        answered: true,
        callStatus: 'answered',
        callDirection: 'internal',
        source: {
          uuid: ALICE_UUID,
          name: 'Alice',
          extension: ALICE_EXTENSION,
        },
        requested: {
          uuid: BOB_UUID,
          name: 'Bob',
          extension: BOB_EXTENSION,
        },
        destination: {
          uuid: CHARLIE_UUID,
          name: 'Bob',
          extension: BOB_EXTENSION,
          plainExtension: CHARLIE_EXTENSION,
          plainName: 'Charlie',
        },
        duration: 4000,
        start: moment(CALL_LOG_RESPONSE.start).toDate(),
        end: moment(CALL_LOG_RESPONSE.end).toDate(),
        recordings: [new Recording({
          uuid: CALL_LOG_RESPONSE.recordings[0].uuid,
          start: moment(CALL_LOG_RESPONSE.recordings[0].start_time).toDate(),
          end: moment(CALL_LOG_RESPONSE.recordings[0].end_time).toDate(),
          fileName: CALL_LOG_RESPONSE.recordings[0].filename,
          deleted: false,
        })],
      })]);
    });
  });

  describe('isIconming', () => {
    it('should be TRUE', () => {
      // When requested is set to the same user session extension
      expect(CALL_LOG.isIncomingAndForwarded(BOB_SESSION)).toBe(true);

      // When destination is set to the same user session extension
      const destinationCallLog = CallLog.parse({
        ...CALL_LOG_RESPONSE,
        destination_extension: CALL_LOG_RESPONSE.requested_extension,
        destination_name: CALL_LOG_RESPONSE.requested_name,
        destination_user_uuid: CALL_LOG_RESPONSE.requested_user_uuid,
        requested_extension: CALL_LOG_RESPONSE.destination_extension,
        requested_name: CALL_LOG_RESPONSE.destination_name,
        requested_user_uuid: CALL_LOG_RESPONSE.destination_user_uuid,
      });
      expect(destinationCallLog.isIncomingAndForwarded(BOB_SESSION)).toBe(true);

      // When destination is set to the same user with a changed extension
      const destinationExtensionChangedCallLog = CallLog.parse({
        ...CALL_LOG_RESPONSE,
        destination_extension: `${CALL_LOG_RESPONSE.requested_extension}9`,
        destination_name: CALL_LOG_RESPONSE.requested_name,
        destination_user_uuid: CALL_LOG_RESPONSE.requested_user_uuid,
        requested_extension: `${CALL_LOG_RESPONSE.destination_extension}9`,
        requested_name: CALL_LOG_RESPONSE.destination_name,
        requested_user_uuid: CALL_LOG_RESPONSE.destination_user_uuid,
      });
      expect(destinationExtensionChangedCallLog.isIncomingAndForwarded(BOB_SESSION)).toBe(true);

      // When call direction is inbound
      const inboundCallLog = CallLog.parse({ ...CALL_LOG_RESPONSE, call_direction: 'inbound' });
      expect(inboundCallLog.isIncomingAndForwarded(BOB_SESSION)).toBe(true);

    });

    it('should be FALSE', () => {
      // When call direction is outbound
      const outboundCallLog = CallLog.parse({ ...CALL_LOG_RESPONSE, call_direction: 'outbound' });
      expect(outboundCallLog.isIncomingAndForwarded(BOB_SESSION)).toBe(false);
    });
  });

  describe('isIncomingAndForwarded', () => {
    it('should be TRUE when requested is current user extension and destination is another extesnion', () => {
      // Internal call (requested contact)
      expect(CALL_LOG.isIncomingAndForwarded(BOB_SESSION)).toBe(true);

      // Inbound call (requested contact)
      const inboundCallLog = CallLog.parse({
        ...CALL_LOG_RESPONSE,
        call_direction: 'inbound',
        source_extension: '18004444444',
        source_name: '',
        source_user_uuid: null,
      });
      expect(inboundCallLog.isIncomingAndForwarded(BOB_SESSION)).toBe(true);

      // Current user is the final destination
      const destinationCallLog = CallLog.parse({
        ...CALL_LOG_RESPONSE,
        destination_extension: CALL_LOG_RESPONSE.requested_extension,
        destination_name: CALL_LOG_RESPONSE.requested_name,
        destination_user_uuid: CALL_LOG_RESPONSE.requested_user_uuid,
        requested_extension: CALL_LOG_RESPONSE.destination_extension,
        requested_name: CALL_LOG_RESPONSE.destination_name,
        requested_user_uuid: CALL_LOG_RESPONSE.destination_user_uuid,
      });
      expect(destinationCallLog.isIncomingAndForwarded(BOB_SESSION)).toBe(true);
    });

    it('should be FALSE', () => {
      // Requested and destination are same
      const directCallLog = CallLog.parse({
        ...CALL_LOG_RESPONSE,
        requested_extension: CALL_LOG_RESPONSE.destination_extension,
        requested_name: CALL_LOG_RESPONSE.destination_name,
        requested_user_uuid: CALL_LOG_RESPONSE.destination_user_uuid,
      });

      expect(directCallLog.isIncomingAndForwarded(BOB_SESSION)).toBe(false);

      // Not incoming call
      const outboundCallLog = CallLog.parse({ ...CALL_LOG_RESPONSE, call_direction: 'outbound' });
      expect(outboundCallLog.isIncomingAndForwarded(BOB_SESSION)).toBe(false);

      // Stack version
      const oldStackSession = generateBobSession({ engineVersion: CALL_LOG_VALID_REQUESTED_VERSION.replace('14', '10') });
      expect(CALL_LOG.isIncomingAndForwarded(oldStackSession)).toBe(false);
    });
  });
});
