import moment from "moment";
import CallLog from "../CallLog";
import Recording from "../Recording";
describe('CallLog domain', () => {
  it('can parse a plain call log to domain', () => {
    const response = {
      filtered: 6,
      items: [{
        answer: moment('2017-08-07T13:51:18.892002+00:00').toDate(),
        answered: true,
        call_direction: 'outbound',
        source_extension: '8020',
        source_name: 'Jonathan Lessard',
        source_user_uuid: '123',
        destination_extension: '4182250459',
        destination_name: null,
        destination_user_uuid: '456',
        duration: 4,
        start: '2017-08-06T13:50:55.819057+00:00',
        end: '2017-08-08T13:51:23.822529+00:00',
        requested_extension: '',
        requested_name: '',
        id: 215,
        recordings: [{
          deleted: false,
          end_time: '2021-08-11T13:22:50.519733+00:00',
          filename: '2021-08-11T13_22_45UTC-61886-xxxx-5c72-4072-8503-e3ad9a41c0a0.wav',
          start_time: '2021-08-11T13:22:45.161954+00:00',
          uuid: '0394ad6f-5c72-4072-8503-e3ad9a41c0a0'
        }]
      }],
      total: 233
    };
    const logs = CallLog.parseMany(response);
    expect(logs).toEqual([new CallLog({
      answer: moment('2017-08-07T13:51:18.892002+00:00').toDate(),
      answered: true,
      callDirection: 'outbound',
      destination: {
        extension: '4182250459',
        name: '',
        uuid: '456'
      },
      source: {
        extension: '8020',
        name: 'Jonathan Lessard',
        uuid: '123'
      },
      id: 215,
      duration: 4000,
      start: moment('2017-08-06T13:50:55.819057+00:00').toDate(),
      end: moment('2017-08-08T13:51:23.822529+00:00').toDate(),
      recordings: [new Recording({
        deleted: false,
        end: moment('2021-08-11T13:22:50.519733+00:00').toDate(),
        fileName: '2021-08-11T13_22_45UTC-61886-xxxx-5c72-4072-8503-e3ad9a41c0a0.wav',
        start: moment('2021-08-11T13:22:45.161954+00:00').toDate(),
        uuid: '0394ad6f-5c72-4072-8503-e3ad9a41c0a0'
      })]
    })]);
  });
});