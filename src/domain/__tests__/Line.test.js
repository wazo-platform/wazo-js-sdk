// @flow

import Line from '../Line';

describe('Line domain', () => {
  it('can parse a plain line to domain', () => {
    const response = {
      id: 8,
      endpoint_sip: {
        id: 19,
        username: 'ipcor1pj',
        links: [
          {
            href: 'https://demo.wazo.community/api/confd/1.1/endpoints/sip/19',
            rel: 'endpoint_sip',
          },
        ],
      },
      endpoint_sccp: null,
      endpoint_custom: null,
      extensions: [
        {
          id: 59,
          exten: '8020',
          context: 'default',
          links: [
            {
              href: 'https://demo.wazo.community/api/confd/1.1/extensions/59',
              rel: 'extensions',
            },
          ],
        },
      ],
      links: [
        {
          href: 'https://demo.wazo.community/api/confd/1.1/lines/8',
          rel: 'lines',
        },
      ],
    };

    const line = Line.parse(response);

    expect(line).toEqual(
      new Line({
        id: 8,
        extensions: [
          {
            id: 59,
            exten: '8020',
            context: 'default',
            links: [
              {
                href: 'https://demo.wazo.community/api/confd/1.1/extensions/59',
                rel: 'extensions',
              },
            ],
          },
        ],
        endpointSip: {
          id: 19,
          links: [
            {
              href: 'https://demo.wazo.community/api/confd/1.1/endpoints/sip/19',
              rel: 'endpoint_sip',
            },
          ],
          username: 'ipcor1pj',
        },
      }),
    );
  });
});
