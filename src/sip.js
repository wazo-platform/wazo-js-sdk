import SIP from 'sip.js';
import { SessionStatus } from 'sip.js/lib/Enums';

export default {
  sessionDescriptionHandler: SIP.sessionDescriptionHandler,
  InviteServerContext: SIP.InviteServerContext,
  C: {
    REASON_PHRASE: {
      100: 'Trying',
      180: 'Ringing',
      181: 'Call Is Being Forwarded',
      182: 'Queued',
      183: 'Session Progress',
      199: 'Early Dialog Terminated', // draft-ietf-sipcore-199
      200: 'OK',
      202: 'Accepted', // RFC 3265
      204: 'No Notification', // RFC 5839
      300: 'Multiple Choices',
      301: 'Moved Permanently',
      302: 'Moved Temporarily',
      305: 'Use Proxy',
      380: 'Alternative Service',
      400: 'Bad Request',
      401: 'Unauthorized',
      402: 'Payment Required',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      406: 'Not Acceptable',
      407: 'Proxy Authentication Required',
      408: 'Request Timeout',
      410: 'Gone',
      412: 'Conditional Request Failed', // RFC 3903
      413: 'Request Entity Too Large',
      414: 'Request-URI Too Long',
      415: 'Unsupported Media Type',
      416: 'Unsupported URI Scheme',
      417: 'Unknown Resource-Priority', // RFC 4412
      420: 'Bad Extension',
      421: 'Extension Required',
      422: 'Session Interval Too Small', // RFC 4028
      423: 'Interval Too Brief',
      428: 'Use Identity Header', // RFC 4474
      429: 'Provide Referrer Identity', // RFC 3892
      430: 'Flow Failed', // RFC 5626
      433: 'Anonymity Disallowed', // RFC 5079
      436: 'Bad Identity-Info', // RFC 4474
      437: 'Unsupported Certificate', // RFC 4744
      438: 'Invalid Identity Header', // RFC 4744
      439: 'First Hop Lacks Outbound Support', // RFC 5626
      440: 'Max-Breadth Exceeded', // RFC 5393
      469: 'Bad Info Package', // draft-ietf-sipcore-info-events
      470: 'Consent Needed', // RFC 5360
      478: 'Unresolvable Destination', // Custom code copied from Kamailio.
      480: 'Temporarily Unavailable',
      481: 'Call/Transaction Does Not Exist',
      482: 'Loop Detected',
      483: 'Too Many Hops',
      484: 'Address Incomplete',
      485: 'Ambiguous',
      486: 'Busy Here',
      487: 'Request Terminated',
      488: 'Not Acceptable Here',
      489: 'Bad Event', // RFC 3265
      491: 'Request Pending',
      493: 'Undecipherable',
      494: 'Security Agreement Required', // RFC 3329
      500: 'Internal Server Error',
      501: 'Not Implemented',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Server Time-out',
      505: 'Version Not Supported',
      513: 'Message Too Large',
      580: 'Precondition Failure', // RFC 3312
      600: 'Busy Everywhere',
      603: 'Decline',
      604: 'Does Not Exist Anywhere',
      606: 'Not Acceptable',
    },
    causes: {
      CONNECTION_ERROR: 'Connection Error',
      INTERNAL_ERROR: 'Internal Error',
      REQUEST_TIMEOUT: 'Request Timeout',
      SIP_FAILURE_CODE: 'SIP Failure Code',

      // SIP error causes
      ADDRESS_INCOMPLETE: 'Address Incomplete',
      AUTHENTICATION_ERROR: 'Authentication Error',
      BUSY: 'Busy',
      DIALOG_ERROR: 'Dialog Error',
      INCOMPATIBLE_SDP: 'Incompatible SDP',
      NOT_FOUND: 'Not Found',
      REDIRECTED: 'Redirected',
      REJECTED: 'Rejected',
      UNAVAILABLE: 'Unavailable',

      // Session error causes

      BAD_MEDIA_DESCRIPTION: 'Bad Media Description',
      CANCELED: 'Canceled',
      EXPIRES: 'Expires',
      NO_ACK: 'No ACK',
      NO_ANSWER: 'No Answer',
      NO_PRACK: 'No PRACK',
      RTP_TIMEOUT: 'RTP Timeout',
      USER_DENIED_MEDIA_ACCESS: 'User Denied Media Access',
      WEBRTC_ERROR: 'WebRTC Error',
      WEBRTC_NOT_SUPPORTED: 'WebRTC Not Supported',
    },
  },
  SessionStatus,
};
