// @flow
import moment from 'moment';

import CallLog from '../CallLog';

describe('CallLog domain', () => {
  it('can parse a plain call log to domain', () => {
    const response = {
      filtered: 6,
      items: [
        {
          answer: moment('2017-08-07T13:51:18.892002+00:00').toDate(),
          answered: true,
          call_direction: 'outbound',
          source_extension: '8020',
          source_name: 'Jonathan Lessard',
          destination_extension: '4182250459',
          destination_name: null,
          duration: 4,
          start: '2017-08-06T13:50:55.819057+00:00',
          end: '2017-08-08T13:51:23.822529+00:00',
          requested_extension: '',
          id: 215,
        },
      ],
      total: 233,
    };

    const logs = CallLog.parseMany(response);

    expect(logs).toEqual([
      new CallLog({
        answer: moment('2017-08-07T13:51:18.892002+00:00').toDate(),
        answered: true,
        callDirection: 'outbound',
        destination: {
          extension: '4182250459',
          name: '',
        },
        source: {
          extension: '8020',
          name: 'Jonathan Lessard',
        },
        id: 215,
        duration: 4000,
        start: moment('2017-08-06T13:50:55.819057+00:00').toDate(),
        end: moment('2017-08-08T13:51:23.822529+00:00').toDate(),
      }),
    ]);
  });
});
