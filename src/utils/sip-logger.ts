import IssueReporter from '../service/IssueReporter';
import { WebRtcConfig } from '../domain/types';

const sipLogger = IssueReporter.loggerFor('sip.js');
const protocolLogger = IssueReporter.loggerFor('sip');
const protocolDebugMessages = ['Received WebSocket text message:', 'Sending WebSocket message:'];

const logConnector = (level: any, className: string, label: any, content: string): void => {
  const protocolIndex = content && content.indexOf ? protocolDebugMessages.findIndex(prefix => content.indexOf(prefix) !== -1) : -1;

  if (className === 'sip.Transport' && protocolIndex !== -1) {
    const direction = protocolIndex === 0 ? 'receiving' : 'sending';
    const message = content.replace(`${protocolDebugMessages[protocolIndex]}\n\n`, '').replace('\r\n', '\n');
    protocolLogger.trace(message, {
      className,
      direction,
    });
  } else {
    sipLogger.trace(content, {
      className,
    });
  }
};

const configureLogger = (rawOptions: Partial<WebRtcConfig> = {}): Partial<WebRtcConfig> => {
  const options = rawOptions;

  if (options.uaConfigOverrides) {
    options.uaConfigOverrides.traceSip = true;
  }
  options.log = options.log || {};
  options.log.builtinEnabled = false;
  options.log.logLevel = 'debug';

  options.log.connector = logConnector;

  return options;
};

export default configureLogger;
