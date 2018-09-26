/* @flow */

export default class Logger {
  static hasDebug() {
    return typeof process !== 'undefined' && (+process.env.DEBUG === 1 || process.env.DEBUG === 'true');
  }

  static logRequest(url: string, { method, body, headers }: Object, response: Object) {
    if (!Logger.hasDebug()) {
      return;
    }

    const { status } = response;

    let curl = `${status} - curl ${method !== 'get' ? `-X ${method.toUpperCase()}` : ''}`;
    Object.keys(headers).forEach(headerName => {
      curl += ` -H '${headerName}: ${headers[headerName]}'`;
    });

    curl += ` ${url}`;

    if (body) {
      curl += ` -d '${body}'`;
    }

    console.info(curl);
  }
}
