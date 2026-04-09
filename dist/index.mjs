import * as __WEBPACK_EXTERNAL_MODULE_js_base64_4ca5b7bc__ from "js-base64";
import * as __WEBPACK_EXTERNAL_MODULE_moment__ from "moment";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__ from "sip.js/lib/api/session-state";
import * as __WEBPACK_EXTERNAL_MODULE_events__ from "events";
import * as __WEBPACK_EXTERNAL_MODULE_json_to_graphql_query_lib_jsonToGraphQLQuery_86e5fe4e__ from "json-to-graphql-query/lib/jsonToGraphQLQuery";
import * as __WEBPACK_EXTERNAL_MODULE_jsrsasign__ from "jsrsasign";
import * as __WEBPACK_EXTERNAL_MODULE_reconnecting_websocket_e103ba3a__ from "reconnecting-websocket";
import "webrtc-adapter";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_user_agent_state_a04f4d58__ from "sip.js/lib/api/user-agent-state";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_core_messages_parser_9974076a__ from "sip.js/lib/core/messages/parser";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_core_messages_methods_constants_78ac14f1__ from "sip.js/lib/core/messages/methods/constants";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_grammar_uri_b7779ac2__ from "sip.js/lib/grammar/uri";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_user_agent_8471afcd__ from "sip.js/lib/api/user-agent";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_modifiers_modifiers_2ed0685f__ from "sip.js/lib/platform/web/modifiers/modifiers";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_core_dialogs_session_dialog_042454ee__ from "sip.js/lib/core/dialogs/session-dialog";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_messager_c3a09f5d__ from "sip.js/lib/api/messager";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_registerer_state_6e58ddd6__ from "sip.js/lib/api/registerer-state";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_transport_state_2606bc5d__ from "sip.js/lib/api/transport-state";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_session_description_handler_peer_connection_configuration_default_48affb33__ from "sip.js/lib/platform/web/session-description-handler/peer-connection-configuration-default";
import * as __WEBPACK_EXTERNAL_MODULE_getstats__ from "getstats";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__ from "sip.js/lib/api";
import * as __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_session_description_handler_session_description_handler_fdd90ea0__ from "sip.js/lib/platform/web/session-description-handler/session-description-handler";
import * as __WEBPACK_EXTERNAL_MODULE_sdp_transform_45b84e5d__ from "sdp-transform";
import * as __WEBPACK_EXTERNAL_MODULE_libphonenumber_js_7e4a9e9f__ from "libphonenumber-js";
var __webpack_require__ = {};
(()=>{
    __webpack_require__.d = function(exports, definition) {
        for(var key in definition)if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
        });
    };
})();
(()=>{
    __webpack_require__.g = function() {
        if ('object' == typeof globalThis) return globalThis;
        try {
            return this || new Function('return this')();
        } catch (e) {
            if ('object' == typeof window) return window;
        }
    }();
})();
(()=>{
    __webpack_require__.o = function(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };
})();
(()=>{
    __webpack_require__.r = function(exports) {
        if ('undefined' != typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports, Symbol.toStringTag, {
            value: 'Module'
        });
        Object.defineProperty(exports, '__esModule', {
            value: true
        });
    };
})();
var websocket_client_namespaceObject = {};
__webpack_require__.r(websocket_client_namespaceObject);
__webpack_require__.d(websocket_client_namespaceObject, {
    AGENT_PAUSED: ()=>AGENT_PAUSED,
    AGENT_QUEUE_LOGGED_IN: ()=>AGENT_QUEUE_LOGGED_IN,
    AGENT_QUEUE_LOGGED_OUT: ()=>AGENT_QUEUE_LOGGED_OUT,
    AGENT_STATUS_UPDATE: ()=>AGENT_STATUS_UPDATE,
    AGENT_UNPAUSED: ()=>AGENT_UNPAUSED,
    APPLICATION_CALL_ANSWERED: ()=>APPLICATION_CALL_ANSWERED,
    APPLICATION_CALL_DELETED: ()=>APPLICATION_CALL_DELETED,
    APPLICATION_CALL_DTMF_RECEIVED: ()=>APPLICATION_CALL_DTMF_RECEIVED,
    APPLICATION_CALL_ENTERED: ()=>APPLICATION_CALL_ENTERED,
    APPLICATION_CALL_INITIATED: ()=>APPLICATION_CALL_INITIATED,
    APPLICATION_CALL_UPDATED: ()=>APPLICATION_CALL_UPDATED,
    APPLICATION_DESTINATION_NODE_CREATED: ()=>APPLICATION_DESTINATION_NODE_CREATED,
    APPLICATION_NODE_CREATED: ()=>APPLICATION_NODE_CREATED,
    APPLICATION_NODE_DELETED: ()=>APPLICATION_NODE_DELETED,
    APPLICATION_NODE_UPDATED: ()=>APPLICATION_NODE_UPDATED,
    APPLICATION_PLAYBACK_CREATED: ()=>APPLICATION_PLAYBACK_CREATED,
    APPLICATION_PLAYBACK_DELETED: ()=>APPLICATION_PLAYBACK_DELETED,
    APPLICATION_PROGRESS_STARTED: ()=>APPLICATION_PROGRESS_STARTED,
    APPLICATION_PROGRESS_STOPPED: ()=>APPLICATION_PROGRESS_STOPPED,
    APPLICATION_SNOOP_CREATED: ()=>APPLICATION_SNOOP_CREATED,
    APPLICATION_SNOOP_DELETED: ()=>APPLICATION_SNOOP_DELETED,
    APPLICATION_SNOOP_UPDATED: ()=>APPLICATION_SNOOP_UPDATED,
    APPLICATION_USER_OUTGOING_CALL_CREATED: ()=>APPLICATION_USER_OUTGOING_CALL_CREATED,
    AUTH_SESSION_EXPIRE_SOON: ()=>AUTH_SESSION_EXPIRE_SOON,
    AUTH_USER_EXTERNAL_AUTH_ADDED: ()=>AUTH_USER_EXTERNAL_AUTH_ADDED,
    AUTH_USER_EXTERNAL_AUTH_DELETED: ()=>AUTH_USER_EXTERNAL_AUTH_DELETED,
    CALL_ANSWERED: ()=>CALL_ANSWERED,
    CALL_CREATED: ()=>CALL_CREATED,
    CALL_DTMF_CREATED: ()=>CALL_DTMF_CREATED,
    CALL_ENDED: ()=>CALL_ENDED,
    CALL_HELD: ()=>CALL_HELD,
    CALL_LOG_USER_CREATED: ()=>CALL_LOG_USER_CREATED,
    CALL_RESUMED: ()=>CALL_RESUMED,
    CALL_UPDATED: ()=>CALL_UPDATED,
    CHATD_PRESENCE_UPDATED: ()=>CHATD_PRESENCE_UPDATED,
    CHATD_USER_ROOM_CREATED: ()=>CHATD_USER_ROOM_CREATED,
    CHATD_USER_ROOM_MESSAGE_CREATED: ()=>CHATD_USER_ROOM_MESSAGE_CREATED,
    CHAT_MESSAGE_RECEIVED: ()=>CHAT_MESSAGE_RECEIVED,
    CHAT_MESSAGE_SENT: ()=>CHAT_MESSAGE_SENT,
    CONFERENCE_ADHOC_DELETED: ()=>CONFERENCE_ADHOC_DELETED,
    CONFERENCE_ADHOC_PARTICIPANT_LEFT: ()=>CONFERENCE_ADHOC_PARTICIPANT_LEFT,
    CONFERENCE_USER_PARTICIPANT_JOINED: ()=>CONFERENCE_USER_PARTICIPANT_JOINED,
    CONFERENCE_USER_PARTICIPANT_LEFT: ()=>CONFERENCE_USER_PARTICIPANT_LEFT,
    CONFERENCE_USER_PARTICIPANT_TALK_STARTED: ()=>CONFERENCE_USER_PARTICIPANT_TALK_STARTED,
    CONFERENCE_USER_PARTICIPANT_TALK_STOPPED: ()=>CONFERENCE_USER_PARTICIPANT_TALK_STOPPED,
    ENDPOINT_STATUS_UPDATE: ()=>ENDPOINT_STATUS_UPDATE,
    FAVORITE_ADDED: ()=>FAVORITE_ADDED,
    FAVORITE_DELETED: ()=>FAVORITE_DELETED,
    FAX_OUTBOUND_USER_CREATED: ()=>FAX_OUTBOUND_USER_CREATED,
    FAX_OUTBOUND_USER_FAILED: ()=>FAX_OUTBOUND_USER_FAILED,
    FAX_OUTBOUND_USER_SUCCEEDED: ()=>FAX_OUTBOUND_USER_SUCCEEDED,
    GLOBAL_VOICEMAIL_MESSAGE_CREATED: ()=>GLOBAL_VOICEMAIL_MESSAGE_CREATED,
    GLOBAL_VOICEMAIL_MESSAGE_DELETED: ()=>GLOBAL_VOICEMAIL_MESSAGE_DELETED,
    GLOBAL_VOICEMAIL_MESSAGE_UPDATED: ()=>GLOBAL_VOICEMAIL_MESSAGE_UPDATED,
    HEARTBEAT_ENGINE_VERSION: ()=>HEARTBEAT_ENGINE_VERSION,
    LINE_STATUS_UPDATED: ()=>LINE_STATUS_UPDATED,
    MEETING_USER_GUEST_AUTHORIZATION_CREATED: ()=>MEETING_USER_GUEST_AUTHORIZATION_CREATED,
    MEETING_USER_PARTICIPANT_JOINED: ()=>MEETING_USER_PARTICIPANT_JOINED,
    MEETING_USER_PARTICIPANT_LEFT: ()=>MEETING_USER_PARTICIPANT_LEFT,
    MEETING_USER_PROGRESS: ()=>MEETING_USER_PROGRESS,
    SOCKET_EVENTS: ()=>SOCKET_EVENTS,
    SWITCHBOARD_HELD_CALLS_UPDATED: ()=>SWITCHBOARD_HELD_CALLS_UPDATED,
    SWITCHBOARD_HELD_CALL_ANSWERED: ()=>SWITCHBOARD_HELD_CALL_ANSWERED,
    SWITCHBOARD_QUEUED_CALLS_UPDATED: ()=>SWITCHBOARD_QUEUED_CALLS_UPDATED,
    SWITCHBOARD_QUEUED_CALL_ANSWERED: ()=>SWITCHBOARD_QUEUED_CALL_ANSWERED,
    TRUNK_STATUS_UPDATED: ()=>TRUNK_STATUS_UPDATED,
    USERS_FORWARDS_BUSY_UPDATED: ()=>USERS_FORWARDS_BUSY_UPDATED,
    USERS_FORWARDS_NOANSWER_UPDATED: ()=>USERS_FORWARDS_NOANSWER_UPDATED,
    USERS_FORWARDS_UNCONDITIONAL_UPDATED: ()=>USERS_FORWARDS_UNCONDITIONAL_UPDATED,
    USERS_SERVICES_DND_UPDATED: ()=>USERS_SERVICES_DND_UPDATED,
    USER_STATUS_UPDATE: ()=>USER_STATUS_UPDATE,
    USER_VOICEMAIL_MESSAGE_CREATED: ()=>USER_VOICEMAIL_MESSAGE_CREATED,
    USER_VOICEMAIL_MESSAGE_DELETED: ()=>USER_VOICEMAIL_MESSAGE_DELETED,
    USER_VOICEMAIL_MESSAGE_UPDATED: ()=>USER_VOICEMAIL_MESSAGE_UPDATED,
    default: ()=>websocket_client
});
var WebRTCPhone_namespaceObject = {};
__webpack_require__.r(WebRTCPhone_namespaceObject);
__webpack_require__.d(WebRTCPhone_namespaceObject, {
    MESSAGE_TYPE_CHAT: ()=>MESSAGE_TYPE_CHAT,
    MESSAGE_TYPE_SIGNAL: ()=>MESSAGE_TYPE_SIGNAL,
    ON_AUDIO_STREAM: ()=>ON_AUDIO_STREAM,
    ON_CALL_ACCEPTED: ()=>ON_CALL_ACCEPTED,
    ON_CALL_ANSWERED: ()=>ON_CALL_ANSWERED,
    ON_CALL_CANCELED: ()=>ON_CALL_CANCELED,
    ON_CALL_ENDED: ()=>ON_CALL_ENDED,
    ON_CALL_ENDING: ()=>ON_CALL_ENDING,
    ON_CALL_ERROR: ()=>ON_CALL_ERROR,
    ON_CALL_FAILED: ()=>ON_CALL_FAILED,
    ON_CALL_HELD: ()=>ON_CALL_HELD,
    ON_CALL_INCOMING: ()=>ON_CALL_INCOMING,
    ON_CALL_MUTED: ()=>ON_CALL_MUTED,
    ON_CALL_OUTGOING: ()=>ON_CALL_OUTGOING,
    ON_CALL_REJECTED: ()=>ON_CALL_REJECTED,
    ON_CALL_RESUMED: ()=>ON_CALL_RESUMED,
    ON_CALL_UNHELD: ()=>ON_CALL_UNHELD,
    ON_CALL_UNMUTED: ()=>ON_CALL_UNMUTED,
    ON_CAMERA_DISABLED: ()=>ON_CAMERA_DISABLED,
    ON_CAMERA_RESUMED: ()=>ON_CAMERA_RESUMED,
    ON_CHAT: ()=>ON_CHAT,
    ON_EARLY_MEDIA: ()=>WebRTCPhone_ON_EARLY_MEDIA,
    ON_ICE_DISCONNECTED: ()=>WebRTCPhone_ON_ICE_DISCONNECTED,
    ON_ICE_RECONNECTED: ()=>WebRTCPhone_ON_ICE_RECONNECTED,
    ON_ICE_RECONNECTING: ()=>WebRTCPhone_ON_ICE_RECONNECTING,
    ON_MEDIA_CONNECTED: ()=>WebRTCPhone_ON_MEDIA_CONNECTED,
    ON_MESSAGE: ()=>ON_MESSAGE,
    ON_MESSAGE_TRACK_UPDATED: ()=>ON_MESSAGE_TRACK_UPDATED,
    ON_NETWORK_STATS: ()=>WebRTCPhone_ON_NETWORK_STATS,
    ON_PLAY_HANGUP_SOUND: ()=>ON_PLAY_HANGUP_SOUND,
    ON_PLAY_INBOUND_CALL_SIGNAL_SOUND: ()=>ON_PLAY_INBOUND_CALL_SIGNAL_SOUND,
    ON_PLAY_PROGRESS_SOUND: ()=>ON_PLAY_PROGRESS_SOUND,
    ON_PLAY_RING_SOUND: ()=>ON_PLAY_RING_SOUND,
    ON_PROGRESS: ()=>WebRTCPhone_ON_PROGRESS,
    ON_REGISTERED: ()=>ON_REGISTERED,
    ON_REINVITE: ()=>WebRTCPhone_ON_REINVITE,
    ON_REMOVE_STREAM: ()=>ON_REMOVE_STREAM,
    ON_SHARE_SCREEN_ENDED: ()=>ON_SHARE_SCREEN_ENDED,
    ON_SHARE_SCREEN_ENDING: ()=>ON_SHARE_SCREEN_ENDING,
    ON_SHARE_SCREEN_STARTED: ()=>ON_SHARE_SCREEN_STARTED,
    ON_SIGNAL: ()=>ON_SIGNAL,
    ON_TERMINATE_SOUND: ()=>ON_TERMINATE_SOUND,
    ON_TRACK: ()=>WebRTCPhone_ON_TRACK,
    ON_UNREGISTERED: ()=>ON_UNREGISTERED,
    ON_USER_AGENT: ()=>ON_USER_AGENT,
    ON_VIDEO_INPUT_CHANGE: ()=>ON_VIDEO_INPUT_CHANGE,
    ON_VIDEO_STREAM: ()=>ON_VIDEO_STREAM,
    default: ()=>WebRTCPhone,
    events: ()=>WebRTCPhone_events
});
class BadResponse extends Error {
    static fromResponse(error, status) {
        return new BadResponse(error.message || JSON.stringify(error), status, error.timestamp, error.error_id, error.details, error);
    }
    static fromText(response, status) {
        return new BadResponse(response, status);
    }
    status;
    timestamp;
    errorId;
    details;
    error;
    constructor(message, status, timestamp = null, errorId = null, details = null, error = null){
        super(message);
        this.timestamp = timestamp;
        this.status = status;
        this.errorId = errorId;
        this.details = details;
        this.error = error;
    }
}
class ServerError extends BadResponse {
    static fromResponse(error, status) {
        return new ServerError(error.message || JSON.stringify(error), status, error.timestamp, error.error_id, error.details);
    }
    static fromText(response, status) {
        return new ServerError(response, status);
    }
}
const isMobile_isMobile = ()=>'undefined' != typeof navigator && 'ReactNative' === navigator.product;
const utils_isMobile = isMobile_isMobile;
const camelToUnderscore = (key)=>{
    if ('string' != typeof key) throw new Error('Input is not a string');
    return key.charAt(0).toLowerCase() + key.substring(1).replace(/([A-Z])/g, '_$1').toLowerCase();
};
const obfuscateToken = (token)=>{
    if (!token) return token;
    return token.split('-').map((part, index)=>0 === index ? part : 'xxxxxx').join('-');
};
const TRACE = 'trace';
const DEBUG = 'debug';
const INFO = 'info';
const LOG = 'log';
const WARN = 'warn';
const ERROR = 'error';
const CONSOLE_METHODS = [
    INFO,
    LOG,
    WARN,
    ERROR
];
const LOG_LEVELS = [
    TRACE,
    DEBUG,
    INFO,
    LOG,
    WARN,
    ERROR
];
const CATEGORY_PREFIX = 'logger-category=';
const MAX_REMOTE_RETRY = 10;
function addLevelsTo(instance, withMethods = false) {
    instance.TRACE = TRACE;
    instance.DEBUG = DEBUG;
    instance.INFO = INFO;
    instance.LOG = LOG;
    instance.WARN = WARN;
    instance.ERROR = ERROR;
    if (withMethods) {
        instance.trace = (...args)=>instance.apply(null, [
                TRACE,
                ...args
            ]);
        instance.debug = (...args)=>instance.apply(null, [
                DEBUG,
                ...args
            ]);
        instance.info = (...args)=>instance.apply(null, [
                INFO,
                ...args
            ]);
        instance.log = (...args)=>instance.apply(null, [
                LOG,
                ...args
            ]);
        instance.warn = (...args)=>instance.apply(null, [
                WARN,
                ...args
            ]);
        instance.error = (...args)=>instance.apply(null, [
                ERROR,
                ...args
            ]);
    }
    return instance;
}
const safeStringify = (object)=>{
    const result = '{"message": "Not parsable JSON"}';
    try {
        return JSON.stringify(object);
    } catch (e) {}
    return result;
};
class IssueReporter_IssueReporter {
    TRACE;
    INFO;
    LOG;
    WARN;
    ERROR;
    oldConsoleMethods;
    enabled;
    remoteClientConfiguration;
    buffer;
    bufferTimeout;
    _boundProcessBuffer;
    _boundParseLoggerBody;
    _callback;
    constructor(){
        addLevelsTo(this);
        this.oldConsoleMethods = null;
        this.enabled = false;
        this.remoteClientConfiguration = null;
        this.buffer = [];
        this.bufferTimeout = null;
        this._boundProcessBuffer = this._processBuffer.bind(this);
        this._boundParseLoggerBody = this._parseLoggerBody.bind(this);
        this._callback = null;
    }
    init() {
        this._catchConsole();
    }
    setCallback(cb) {
        this._callback = cb;
    }
    configureRemoteClient(configuration = {
        tag: 'wazo-sdk',
        host: null,
        port: null,
        level: null,
        extra: {}
    }) {
        this.remoteClientConfiguration = configuration;
    }
    enable() {
        if (!this.oldConsoleMethods) this.init();
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
    }
    loggerFor(category) {
        const logger = (level, ...args)=>{
            this.log.apply(this, [
                level,
                this._makeCategory(category),
                ...args
            ]);
        };
        return addLevelsTo(logger, true);
    }
    removeSlashes(str) {
        return str.replace(/"/g, "'").replace(/\\/g, '');
    }
    obfuscateHeaderToken(headers) {
        const newHeaders = {
            ...headers
        };
        if ('X-Auth-Token' in newHeaders) newHeaders['X-Auth-Token'] = obfuscateToken(newHeaders['X-Auth-Token']);
        return newHeaders;
    }
    log(level, ...args) {
        if (!this.enabled) return;
        let category = null;
        let skipSendToRemote = false;
        let extra = {};
        if (0 === args[0].indexOf(CATEGORY_PREFIX)) {
            category = args[0].split('=')[1];
            args.splice(0, 1);
        }
        const lastArg = args[args.length - 1];
        if (lastArg && ('object' == typeof lastArg && Object.keys(lastArg).length || lastArg instanceof Error)) {
            extra = lastArg instanceof Error ? {
                errorMessage: lastArg.message,
                errorStack: lastArg.stack,
                errorType: lastArg.constructor.name,
                skipSendToRemote: lastArg.skipSendToRemote
            } : lastArg;
            args.splice(1, 1);
        }
        if (extra.skipSendToRemote) {
            skipSendToRemote = true;
            delete extra.skipSendToRemote;
        }
        const date = (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])().format('YYYY-MM-DD HH:mm:ss.SSS');
        const message = args.join(', ');
        let consoleMessage = message;
        if (Object.keys(extra).length) {
            const parsedExtra = safeStringify(extra);
            consoleMessage = `${consoleMessage} (${parsedExtra})`;
        }
        if (category) consoleMessage = `[${category}] ${consoleMessage}`;
        const consoleLevel = utils_isMobile() && 'error' === level ? WARN : level;
        const oldMethod = this.oldConsoleMethods?.[consoleLevel] || this.oldConsoleMethods?.log;
        oldMethod.apply(oldMethod, [
            date,
            consoleMessage
        ]);
        if (this._callback) this._callback(level, consoleMessage);
        if (!skipSendToRemote) this._sendToRemoteLogger(level, {
            date,
            message,
            category,
            ...extra
        });
    }
    logRequest(url, options, response, start) {
        if (!this.enabled) return;
        const { status } = response;
        const duration = +new Date() - +start;
        let level = TRACE;
        if (status >= 400 && status < 500) level = WARN;
        else if (status >= 500) level = ERROR;
        this.log(level, this._makeCategory('http'), url, {
            status,
            body: this.removeSlashes(JSON.stringify(options.body)),
            method: options.method,
            headers: this.obfuscateHeaderToken(options.headers),
            duration
        });
    }
    getLogs() {
        console.warn('IssueReporter\'s logs aren\'t stored anymore. Please use fluentd to store them');
        return [];
    }
    getParsedLogs() {
        console.warn('IssueReporter\'s logs aren\'t stored anymore. Please use fluentd to store them');
        return [];
    }
    getReport() {
        return this.getParsedLogs().join('\r\n');
    }
    _catchConsole() {
        this.oldConsoleMethods = {};
        CONSOLE_METHODS.forEach((methodName)=>{
            if (this.oldConsoleMethods) this.oldConsoleMethods[methodName] = console[methodName];
            const parent = 'undefined' != typeof window ? window : __webpack_require__.g;
            parent.console[methodName] = (...args)=>{
                try {
                    this.log(methodName, args.join(' '));
                    if (this.oldConsoleMethods) this.oldConsoleMethods[methodName].apply(null, args);
                } catch (e) {}
            };
        });
    }
    _sendToRemoteLogger(level, payload = {}) {
        if (!this.remoteClientConfiguration) return;
        const { level: minLevel, bufferSize } = this.remoteClientConfiguration;
        if (!minLevel || this._isLevelAbove(minLevel, level)) return;
        payload.level = level;
        if (bufferSize > 0) return this._addToBuffer(payload);
        this._sendDebugToGrafana(payload);
    }
    _parseLoggerBody(payload) {
        const { level } = payload;
        const { maxMessageSize, extra } = this.remoteClientConfiguration || {};
        delete payload.level;
        if (maxMessageSize && 'string' == typeof payload.message && payload.message.length > maxMessageSize) payload.message = `${payload.message.substr(0, maxMessageSize)}...`;
        return safeStringify({
            level,
            ...payload,
            ...extra
        });
    }
    _addToBuffer(payload) {
        if (this.bufferTimeout) {
            clearTimeout(this.bufferTimeout);
            this.bufferTimeout = null;
        }
        this.buffer.push(payload);
        const { bufferSize, bufferTimeout } = this.remoteClientConfiguration;
        if (this.buffer.length > bufferSize) return this._processBuffer();
        if (bufferTimeout > 0) this.bufferTimeout = setTimeout(this._boundProcessBuffer, bufferTimeout);
    }
    _processBuffer() {
        this._sendDebugToGrafana(this.buffer);
        this.buffer = [];
        if (this.bufferTimeout) {
            clearTimeout(this.bufferTimeout);
            this.bufferTimeout = null;
        }
    }
    _computeRetryDelay(attempt, initial = 1000, maxWait = 50000) {
        const base = 1.5;
        const wait = Math.min(initial * base ** attempt, maxWait);
        const jitterWait = Math.max(initial, Math.random() * wait);
        return jitterWait;
    }
    _sendDebugToGrafana(payload, retry = 0) {
        if (!this.remoteClientConfiguration || retry >= MAX_REMOTE_RETRY) return;
        const { tag, host, port } = this.remoteClientConfiguration;
        const isSecure = 443 === +port;
        const url = `http${isSecure ? 's' : ''}://${host}${isSecure ? '' : `:${port}`}/${tag}`;
        const body = Array.isArray(payload) ? `[${payload.map(this._boundParseLoggerBody).join(',')}]` : this._parseLoggerBody(payload);
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body
        }).catch((e)=>{
            e.skipSendToRemote = true;
            this.log('error', this._makeCategory('grafana'), 'Sending log to grafana, error', e);
            const wait = this._computeRetryDelay(retry, 1000, 50000);
            setTimeout(()=>{
                if (Array.isArray(payload)) payload = payload.map((message)=>this._writeRetryCount(message, retry + 1));
                else if (payload && 'object' == typeof payload) payload = this._writeRetryCount(payload, retry + 1);
                this._sendDebugToGrafana(payload, retry + 1);
            }, wait);
        });
    }
    _writeRetryCount(message, count) {
        if (message && 'object' == typeof message) message._retry = count;
        return message;
    }
    _isLevelAbove(level1, level2) {
        const index1 = LOG_LEVELS.indexOf(level1);
        const index2 = LOG_LEVELS.indexOf(level2);
        if (-1 === index1 || -1 === index2) return false;
        return index1 > index2;
    }
    _makeCategory(category) {
        return `${CATEGORY_PREFIX}${category}`;
    }
}
const IssueReporter = new IssueReporter_IssueReporter();
const methods = [
    'head',
    'get',
    'post',
    'put',
    'delete',
    'options'
];
const api_requester_logger = IssueReporter ? IssueReporter.loggerFor('api') : console;
const REQUEST_TIMEOUT_MS = 300000;
class ApiRequester {
    server;
    agent;
    clientId;
    token;
    tenant;
    fetchOptions;
    refreshTokenCallback;
    refreshTokenPromise;
    shouldLogErrors;
    requestTimeout;
    head;
    get;
    post;
    put;
    delete;
    options;
    static successResponseParser(response) {
        return 204 === response.status || 201 === response.status || 200 === response.status;
    }
    static defaultParser(response) {
        if (204 === response.status) return Promise.resolve({
            _headers: response.headers
        });
        return response.json().then((data)=>({
                ...data,
                _headers: response.headers
            }));
    }
    static getQueryString(obj) {
        return Object.keys(obj).filter((key)=>obj[key]).map((key)=>`${key}=${encodeURIComponent(obj[key])}`).join('&');
    }
    static base64Encode(str) {
        if ('undefined' != typeof btoa) try {
            return btoa(str);
        } catch (error) {}
        return __WEBPACK_EXTERNAL_MODULE_js_base64_4ca5b7bc__.Base64.encode(str);
    }
    constructor({ server, refreshTokenCallback, clientId, agent = null, token = null, fetchOptions, requestTimeout = REQUEST_TIMEOUT_MS }){
        this.server = server;
        this.agent = agent;
        this.clientId = clientId;
        this.refreshTokenCallback = refreshTokenCallback;
        this.refreshTokenPromise = null;
        this.fetchOptions = fetchOptions || {};
        this.requestTimeout = requestTimeout || REQUEST_TIMEOUT_MS;
        if (token) this.token = token;
        this.shouldLogErrors = true;
        methods.forEach((method)=>{
            this[method] = (pathOrParams, body, headers, parse, firstCall)=>{
                if (pathOrParams && 'object' == typeof pathOrParams && pathOrParams.path) return this.call({
                    ...pathOrParams,
                    method
                });
                return this.call({
                    path: pathOrParams,
                    method,
                    body,
                    headers,
                    parse,
                    firstCall
                });
            };
        });
    }
    setRequestTimeout(requestTimeout) {
        this.requestTimeout = requestTimeout;
    }
    setTenant(tenant) {
        this.tenant = tenant;
    }
    setToken(token) {
        this.token = token;
    }
    setFetchOptions(options) {
        this.fetchOptions = options;
    }
    disableErrorLogging() {
        this.shouldLogErrors = false;
    }
    enableErrorLogging() {
        this.shouldLogErrors = true;
    }
    async call({ path, method = 'get', body = null, headers = null, parse = ApiRequester.defaultParser, firstCall = true }) {
        const url = this.computeUrl(method, path, body);
        const newHeaders = this.getHeaders(headers);
        let newBody = 'get' === method ? null : body;
        if (newBody && 'application/json' === newHeaders['Content-Type']) newBody = JSON.stringify(newBody);
        const isHead = 'head' === method;
        const hasEmptyResponse = 'delete' === method || isHead;
        const newParse = hasEmptyResponse && parse === ApiRequester.defaultParser ? ApiRequester.successResponseParser : parse;
        const fetchOptions = {
            ...this.fetchOptions || {}
        };
        const controller = new AbortController();
        const extraHeaders = fetchOptions.headers || {};
        delete fetchOptions.headers;
        const options = {
            method,
            body: newBody,
            signal: controller ? controller.signal : null,
            headers: {
                ...this.getHeaders(headers),
                ...extraHeaders
            },
            agent: this.agent,
            ...fetchOptions
        };
        if (this.refreshTokenPromise) {
            api_requester_logger.info('A token is already refreshing, waiting ...', {
                url
            });
            await this.refreshTokenPromise;
        }
        const start = new Date();
        const requestPromise = fetch(url, options).then((response)=>{
            const contentType = response.headers.get('content-type') || '';
            const isJson = -1 !== contentType.indexOf('application/json');
            IssueReporter.logRequest(url, options, response, start);
            if (isHead && response.status >= 500 || !isHead && response.status >= 400) {
                const promise = isJson ? response.json() : response.text();
                const exceptionClass = response.status >= 500 ? ServerError : BadResponse;
                return promise.then(async (err)=>{
                    if (firstCall && this._checkTokenExpired(response, err)) {
                        api_requester_logger.warn('token expired', {
                            error: err.reason
                        });
                        return this._replayWithNewToken(err, path, method, body, headers, parse);
                    }
                    const error = 'string' == typeof err ? exceptionClass.fromText(err, response.status) : exceptionClass.fromResponse(err, response.status);
                    if (this.shouldLogErrors) api_requester_logger.error('API error', error);
                    throw error;
                });
            }
            return newParse(response, isJson);
        }).catch((error)=>{
            if (this.shouldLogErrors) api_requester_logger.error('Fetch failed', {
                url,
                options,
                message: error.message,
                stack: error.stack
            });
            throw error;
        });
        const requestTimeout = new Promise((resolve, reject)=>{
            setTimeout(()=>{
                controller.abort();
                reject(new Error(`Request timed out after ${this.requestTimeout} ms`));
            }, this.requestTimeout);
        });
        return Promise.race([
            requestPromise,
            requestTimeout
        ]);
    }
    _checkTokenExpired(response, err) {
        const isTokenNotFound = 404 === response.status && this._isTokenNotFound(err);
        return 401 === response.status || isTokenNotFound;
    }
    _isTokenNotFound(err) {
        return err && err.reason && 'No such token' === err.reason[0];
    }
    _replayWithNewToken(err, path, method, body = null, headers = null, parse) {
        const isTokenNotFound = this._isTokenNotFound(err);
        let newPath = path;
        api_requester_logger.info('refreshing token', {
            inProgress: !!this.refreshTokenPromise
        });
        this.refreshTokenPromise = this.refreshTokenPromise || this.refreshTokenCallback();
        return this.refreshTokenPromise?.then(()=>{
            this.refreshTokenPromise = null;
            api_requester_logger.info('token refreshed', {
                isTokenNotFound
            });
            if (isTokenNotFound) {
                const pathParts = path.split('/');
                pathParts.pop();
                pathParts.push(this.token);
                newPath = pathParts.join('/');
            }
            return this.call({
                path: newPath,
                method,
                body,
                headers,
                parse,
                firstCall: false
            });
        }).catch((e)=>{
            this.refreshTokenPromise = null;
            throw e;
        });
    }
    getHeaders(header) {
        const isObject = header instanceof Object;
        const isWazoTenantOnly = isObject && void 0 !== header['Wazo-Tenant'] && 1 === Object.keys(header).length;
        if (isObject && !isWazoTenantOnly) return header;
        const headers = {
            'X-Auth-Token': this.token,
            ...this.tenant ? {
                'Wazo-Tenant': header?.['Wazo-Tenant'] || this.tenant
            } : null,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };
        if (isWazoTenantOnly && !header?.['Wazo-Tenant']) delete headers['Wazo-Tenant'];
        return headers;
    }
    computeUrl(method, path, body) {
        const url = `${this.baseUrl}/${path}`;
        return 'get' === method && 'object' == typeof body && body && Object.keys(body).length ? `${url}?${ApiRequester.getQueryString(body)}` : url;
    }
    get baseUrl() {
        return `https://${this.server}/api`;
    }
}
const application = (client, baseUrl)=>({
        bridgeCall (applicationUuid, callId, context, exten, autoanswer, displayed_caller_id_number) {
            const url = `${baseUrl}/${applicationUuid}/nodes`;
            const body = {
                calls: [
                    {
                        id: callId
                    }
                ]
            };
            return client.post(url, body, null, (res)=>res.json().then((response)=>response.uuid)).then((nodeUuid)=>client.post(`${url}/${nodeUuid}/calls`, {
                    context,
                    exten,
                    autoanswer,
                    displayed_caller_id_number
                }).then((data)=>({
                        nodeUuid,
                        data
                    })));
        },
        answerCall: (applicationUuid, callId)=>client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/answer`, {}, null, ApiRequester.successResponseParser),
        calls: (applicationUuid)=>client.get(`${baseUrl}/${applicationUuid}/calls`),
        hangupCall: (applicationUuid, callId)=>client.delete(`${baseUrl}/${applicationUuid}/calls/${callId}`),
        startPlaybackCall: (applicationUuid, callId, language, uri)=>client.post(`${baseUrl}/${applicationUuid}/calls/${callId}/playbacks`, {
                language,
                uri
            }),
        stopPlaybackCall: (applicationUuid, playbackUuid)=>client.delete(`${baseUrl}/${applicationUuid}/playbacks/${playbackUuid}`),
        startProgressCall: (applicationUuid, callId)=>client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/progress/start`, {}, null, ApiRequester.successResponseParser),
        stopProgressCall: (applicationUuid, callId)=>client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/progress/stop`, {}, null, ApiRequester.successResponseParser),
        startMohCall: (applicationUuid, callId, mohUuid)=>client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/moh/${mohUuid}/start`, {}, null, ApiRequester.successResponseParser),
        stopMohCall: (applicationUuid, callId)=>client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/moh/stop`, {}, null, ApiRequester.successResponseParser),
        startHoldCall: (applicationUuid, callId)=>client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/hold/start`, {}, null, ApiRequester.successResponseParser),
        stopHoldCall: (applicationUuid, callId)=>client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/hold/stop`, {}, null, ApiRequester.successResponseParser),
        startMuteCall: (applicationUuid, callId)=>client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/mute/start`, {}, null, ApiRequester.successResponseParser),
        stopMuteCall: (applicationUuid, callId)=>client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/mute/stop`, {}, null, ApiRequester.successResponseParser),
        sendDTMFCall: (applicationUuid, callId, digits)=>client.put(`${baseUrl}/${applicationUuid}/calls/${callId}/dtmf`, {
                digits
            }, null, ApiRequester.successResponseParser),
        addCallNodes: (applicationUuid, nodeUuid, callId)=>client.put(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`, {}, null, ApiRequester.successResponseParser),
        createNewNodeWithCall: (applicationUuid, calls)=>client.post(`${baseUrl}/${applicationUuid}/nodes`, {
                calls
            }),
        addNewCallNodes: (applicationUuid, nodeUuid, context, exten, autoanswer)=>client.post(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls`, {
                context,
                exten,
                autoanswer
            }),
        listCallsNodes: (applicationUuid, nodeUuid)=>client.get(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`),
        listNodes: (applicationUuid)=>client.get(`${baseUrl}/${applicationUuid}/nodes`),
        removeNode: (applicationUuid, nodeUuid)=>client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}`),
        removeCallNodes: (applicationUuid, nodeUuid, callId)=>client.delete(`${baseUrl}/${applicationUuid}/nodes/${nodeUuid}/calls/${callId}`),
        listSnoop: (applicationUuid)=>client.get(`${baseUrl}/${applicationUuid}/snoops`),
        removeSnoop: (applicationUuid, snoopUuid)=>client.delete(`${baseUrl}/${applicationUuid}/snoops/${snoopUuid}`),
        viewSnoop: (applicationUuid, snoopUuid)=>client.get(`${baseUrl}/${applicationUuid}/snoops/${snoopUuid}`),
        createSnoop: (applicationUuid, callId, snoopingCallId, whisperMode)=>client.post(`${baseUrl}/${applicationUuid}/calls/${callId}/snoops`, {
                snooping_call_id: snoopingCallId,
                whisper_mode: whisperMode
            }),
        updateSnoop: (applicationUuid, snoopUuid, whisperMode)=>client.put(`${baseUrl}/${applicationUuid}/snoops/${snoopUuid}`, {
                whisper_mode: whisperMode
            }, null, ApiRequester.successResponseParser)
    });
const new_from = (instance, ToClass)=>{
    const args = {};
    Object.getOwnPropertyNames(instance).forEach((prop)=>{
        args[prop] = instance[prop];
    });
    return new ToClass(args);
};
class CallerID {
    number;
    idType;
    type;
    callerIdName;
    static parse(plain) {
        return new CallerID({
            number: plain.number,
            type: plain.type,
            callerIdName: plain.caller_id_name
        });
    }
    static parseMany(plain) {
        return plain.items.map((item)=>CallerID.parse(item));
    }
    static newFrom(profile) {
        return new_from(profile, CallerID);
    }
    constructor({ type, number, callerIdName }){
        this.idType = type;
        this.number = number;
        this.callerIdName = callerIdName;
        this.type = 'CallerID';
    }
}
class Line {
    type;
    id;
    extensions;
    endpointCustom;
    endpointSccp;
    endpointSip;
    static parse(plain) {
        return new Line({
            id: plain.id,
            extensions: plain.extensions,
            endpointCustom: plain.endpoint_custom || null,
            endpointSccp: plain.endpoint_sccp || null,
            endpointSip: plain.endpoint_sip || null
        });
    }
    static newFrom(profile) {
        return new_from(profile, Line);
    }
    is(line) {
        return !!line && this.id === line.id;
    }
    hasExtension(extension) {
        if (!this.extensions) return false;
        return this.extensions.some((ext)=>ext.exten === extension);
    }
    constructor({ id, extensions, endpointCustom, endpointSccp, endpointSip } = {}){
        this.id = id;
        this.extensions = extensions;
        this.endpointCustom = endpointCustom || null;
        this.endpointSccp = endpointSccp || null;
        this.endpointSip = endpointSip || null;
        this.type = 'Line';
    }
}
const FORWARD_KEYS = {
    BUSY: 'busy',
    NO_ANSWER: 'noanswer',
    UNCONDITIONAL: 'unconditional'
};
class ForwardOption {
    destination;
    enabled;
    key;
    static parse(plain, key) {
        return new ForwardOption({
            destination: plain.destination || '',
            enabled: plain.enabled,
            key
        });
    }
    static newFrom(profile) {
        return new_from(profile, ForwardOption);
    }
    constructor({ destination, enabled, key } = {}){
        this.destination = destination;
        this.enabled = enabled;
        this.key = key;
    }
    setDestination(number) {
        this.destination = number;
        return this;
    }
    setEnabled(enabled) {
        this.enabled = enabled;
        return this;
    }
    is(other) {
        return this.key === other.key;
    }
}
class Incall {
    id;
    extensions;
    extension;
    type = 'Incall';
    constructor({ id, extensions } = {}){
        this.id = id;
        this.extensions = extensions;
        this.extension = extensions?.[0]?.exten;
    }
    static parse(plain) {
        return new Incall({
            id: plain.id,
            extensions: plain.extensions
        });
    }
    static newFrom(profile) {
        return new_from(profile, Incall);
    }
    hasExtension(extension) {
        if (!this.extensions) return false;
        return this.extensions.some((ext)=>ext.exten === extension);
    }
}
const STATE = {
    AVAILABLE: 'available',
    UNAVAILABLE: 'unavailable',
    INVISIBLE: 'invisible',
    DISCONNECTED: 'disconnected',
    AWAY: 'away'
};
const LINE_STATE = {
    AVAILABLE: 'available',
    HOLDING: 'holding',
    RINGING: 'ringing',
    TALKING: 'talking',
    UNAVAILABLE: 'unavailable',
    PROGRESSING: 'progressing'
};
class Profile {
    id;
    firstName;
    lastName;
    email;
    lines;
    sipLines;
    incalls;
    username;
    mobileNumber;
    forwards;
    doNotDisturb;
    onlineCallRecordEnabled;
    state;
    ringSeconds;
    voicemail;
    status;
    subscriptionType;
    agent;
    switchboards;
    callPickupTargetUsers;
    static parse(plain) {
        return new Profile({
            id: plain.uuid,
            firstName: plain.firstName || plain.firstname || '',
            lastName: plain.lastName || plain.lastname || '',
            email: plain.email,
            lines: plain.lines.map((line)=>Line.parse(line)),
            incalls: plain.incalls,
            username: plain.username,
            mobileNumber: plain.mobile_phone_number || '',
            ringSeconds: plain.ring_seconds,
            forwards: [
                ForwardOption.parse(plain.forwards.unconditional, FORWARD_KEYS.UNCONDITIONAL),
                ForwardOption.parse(plain.forwards.noanswer, FORWARD_KEYS.NO_ANSWER),
                ForwardOption.parse(plain.forwards.busy, FORWARD_KEYS.BUSY)
            ],
            doNotDisturb: plain.services.dnd.enabled,
            subscriptionType: plain.subscription_type,
            voicemail: plain.voicemail,
            switchboards: plain.switchboards || [],
            agent: plain.agent,
            status: '',
            callPickupTargetUsers: plain.call_pickup_target_users || [],
            onlineCallRecordEnabled: plain.online_call_record_enabled
        });
    }
    static newFrom(profile) {
        return new_from(profile, Profile);
    }
    constructor({ id, firstName, lastName, email, lines, username, mobileNumber, forwards, doNotDisturb, state, subscriptionType, voicemail, switchboards, agent, status, ringSeconds, sipLines, callPickupTargetUsers, onlineCallRecordEnabled, incalls }){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.lines = lines;
        this.username = username;
        this.mobileNumber = mobileNumber;
        this.forwards = forwards;
        this.doNotDisturb = doNotDisturb;
        this.state = state;
        this.voicemail = voicemail;
        this.subscriptionType = subscriptionType;
        this.switchboards = switchboards;
        this.agent = agent;
        this.status = status;
        this.callPickupTargetUsers = callPickupTargetUsers;
        this.onlineCallRecordEnabled = onlineCallRecordEnabled;
        this.ringSeconds = ringSeconds;
        this.sipLines = sipLines || [];
        this.incalls = incalls?.map(Incall.parse) || [];
    }
    static getLinesState(lines) {
        let result = LINE_STATE.UNAVAILABLE;
        for (const line of lines){
            if (line.state === LINE_STATE.RINGING) {
                result = LINE_STATE.RINGING;
                break;
            }
            if (line.state === LINE_STATE.TALKING) {
                result = LINE_STATE.TALKING;
                break;
            }
            if (line.state === LINE_STATE.AVAILABLE) result = LINE_STATE.AVAILABLE;
        }
        return result;
    }
    hasId(id) {
        return id === this.id;
    }
    setMobileNumber(number) {
        this.mobileNumber = number;
        return this;
    }
    setForwardOption(forwardOption) {
        const updatedForwardOptions = this.forwards.slice();
        const index = updatedForwardOptions.findIndex((forward)=>forward.is(forwardOption));
        updatedForwardOptions.splice(index, 1, forwardOption);
        this.forwards = updatedForwardOptions;
        return this;
    }
    setDoNotDisturb(enabled) {
        this.doNotDisturb = enabled;
        return this;
    }
    setState(state) {
        this.state = state;
        return this;
    }
}
const availableCodecs = [
    'vp8',
    'vp9',
    'h264'
];
class SipLine {
    id;
    uuid;
    tenantUuid;
    username;
    secret;
    type;
    host;
    options;
    endpointSectionOptions;
    links;
    trunk;
    line;
    static parse(plain) {
        let { username, secret, host } = plain;
        if (plain.auth_section_options) {
            const findOption = (options, name)=>options.find((option)=>option[0] === name);
            const usernameOption = findOption(plain.auth_section_options, 'username');
            const secretOption = findOption(plain.auth_section_options, 'password');
            const hostOption = findOption(plain.endpoint_section_options, 'media_address');
            username = usernameOption ? usernameOption[1] : '';
            secret = secretOption ? secretOption[1] : '';
            host = hostOption ? hostOption[1] : '';
        }
        return new SipLine({
            id: plain.id,
            uuid: plain.uuid,
            tenantUuid: plain.tenant_uuid,
            username,
            secret,
            type: plain.type,
            host,
            options: plain.options,
            endpointSectionOptions: plain.endpoint_section_options,
            links: plain.links,
            trunk: plain.trunk,
            line: plain.line
        });
    }
    static newFrom(sipLine) {
        return new_from(sipLine, SipLine);
    }
    is(line) {
        if (line.uuid) return this.uuid === line.uuid;
        return this.id === line.id;
    }
    getOptions() {
        return this.endpointSectionOptions || this.options || [];
    }
    isWebRtc() {
        return this.getOptions().some((option)=>'webrtc' === option[0] && 'yes' === option[1]);
    }
    hasVideo() {
        const allow = this.getOptions().find((option)=>'allow' === option[0]);
        return Array.isArray(allow) && allow[1].split(',').some((codec)=>availableCodecs.some((c)=>c === codec));
    }
    hasVideoConference() {
        return this.getOptions().some((option)=>'max_audio_streams' === option[0] && parseInt(option[1], 10) > 0) && this.getOptions().some((option)=>'max_video_streams' === option[0] && parseInt(option[1], 10) > 1);
    }
    constructor({ id, uuid, tenantUuid, username, secret, type, host, options, endpointSectionOptions, links, trunk, line }){
        this.id = id;
        this.uuid = uuid;
        this.tenantUuid = tenantUuid;
        this.username = username;
        this.secret = secret;
        this.type = type;
        this.host = host;
        this.options = options;
        this.endpointSectionOptions = endpointSectionOptions;
        this.links = links;
        this.trunk = trunk;
        this.line = line;
        this.type = 'SipLine';
    }
}
class ExternalApp {
    name;
    type;
    configuration;
    static parse(plain) {
        return new ExternalApp({
            name: plain.name,
            configuration: plain.configuration
        });
    }
    static parseMany(plain) {
        return plain.items.map((item)=>ExternalApp.parse(item));
    }
    static newFrom(profile) {
        return new_from(profile, ExternalApp);
    }
    constructor({ name, configuration } = {}){
        this.name = name;
        this.configuration = configuration;
        this.type = 'ExternalApp';
    }
}
class Meeting {
    type;
    guestSipAuthorization;
    uri;
    uuid;
    name;
    port;
    extension;
    persistent;
    ownerUuids;
    creationTime;
    pendingAuthorizations;
    requireAuthorization;
    static parse(plain) {
        return new Meeting({
            guestSipAuthorization: plain.guest_sip_authorization,
            uri: plain.ingress_http_uri,
            name: plain.name,
            ownerUuids: plain.owner_uuids,
            port: plain.port,
            uuid: plain.uuid,
            extension: plain.exten,
            persistent: plain.persistent,
            creationTime: (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])(plain.creation_time).toDate(),
            requireAuthorization: plain.require_authorization
        });
    }
    static parseMany(items) {
        if (!items) return [];
        return items.map((plain)=>Meeting.parse(plain));
    }
    static newFrom(meeting) {
        return new_from(meeting, Meeting);
    }
    constructor({ uuid, name, guestSipAuthorization, ownerUuids, port, uri, extension, persistent, creationTime, requireAuthorization } = {}){
        this.guestSipAuthorization = guestSipAuthorization;
        this.uri = uri;
        this.name = name;
        this.ownerUuids = ownerUuids;
        this.port = port;
        this.uuid = uuid;
        this.extension = extension;
        this.persistent = persistent;
        this.creationTime = creationTime;
        this.requireAuthorization = requireAuthorization;
        this.type = 'Meeting';
    }
    getGuestSipCredentials() {
        const [username, secret] = Buffer.from(this.guestSipAuthorization, 'base64').toString('ascii').split(':');
        return {
            username,
            secret
        };
    }
}
const PENDING = 'pending';
const ACCEPTED = 'accepted';
const REJECTED = 'rejected';
const POST_PROCESSING = 'post_processing';
const POST_PROCESSED_SUCCESS = 'post_processed_success';
const POST_PROCESSED_ERROR = 'post_processed_error';
class MeetingAuthorization {
    static PENDING = PENDING;
    static ACCEPTED = ACCEPTED;
    static REJECTED = REJECTED;
    static POST_PROCESSING = POST_PROCESSING;
    static POST_PROCESSED_SUCCESS = POST_PROCESSED_SUCCESS;
    static POST_PROCESSED_ERROR = POST_PROCESSED_ERROR;
    meetingUuid;
    uuid;
    userUuid;
    userName;
    status;
    constructor({ meetingUuid, uuid, userUuid, userName } = {}){
        this.meetingUuid = meetingUuid;
        this.uuid = uuid;
        this.userUuid = userUuid;
        this.userName = userName;
    }
    setStatus(status) {
        this.status = status;
    }
    getStatus() {
        return this.status;
    }
    static parse(plain) {
        const { meeting_uuid: meetingUuid, uuid, guest_uuid: userUuid, guest_name: userName } = plain;
        return new MeetingAuthorization({
            meetingUuid,
            uuid,
            userUuid,
            userName
        });
    }
    static parseMany(items) {
        if (!items) return [];
        return items.map(MeetingAuthorization.parse);
    }
}
const convertKeysFromCamelToUnderscore = (args)=>{
    if (!args || 'object' != typeof args || Array.isArray(args)) throw new Error('Input is not an object');
    return Object.keys(args).reduce((acc, key)=>{
        acc[camelToUnderscore(key)] = 'object' != typeof args[key] || Array.isArray(args[key]) ? args[key] : convertKeysFromCamelToUnderscore(args[key]);
        return acc;
    }, {});
};
const confd = (client, baseUrl)=>({
        listUsers: ()=>client.get(`${baseUrl}/users`, null),
        getUser: (userUuid)=>client.get(`${baseUrl}/users/${userUuid}`, null).then(Profile.parse),
        updateUser: (userUuid, profile)=>{
            const body = {
                firstname: profile.firstName,
                lastname: profile.lastName,
                email: profile.email,
                mobile_phone_number: profile.mobileNumber
            };
            return client.put(`${baseUrl}/users/${userUuid}`, body, null, ApiRequester.successResponseParser);
        },
        updateForwardOption: (userUuid, key, destination, enabled)=>{
            const url = `${baseUrl}/users/${userUuid}/forwards/${key}`;
            return client.put(url, {
                destination,
                enabled
            }, null, ApiRequester.successResponseParser);
        },
        updateForwardOptions: (userUuid, options)=>{
            const url = `${baseUrl}/users/${userUuid}/forwards`;
            return client.put(url, options, null, ApiRequester.successResponseParser);
        },
        updateDoNotDisturb: (userUuid, enabled)=>client.put(`${baseUrl}/users/${userUuid}/services/dnd`, {
                enabled
            }, null, ApiRequester.successResponseParser),
        getUserLineSip: (userUuid, lineId)=>client.get(`${baseUrl}/users/${userUuid}/lines/${lineId}/associated/endpoints/sip?view=merged`).then(SipLine.parse),
        getUserLinesSip (userUuid, lineIds) {
            return Promise.all(lineIds.map((lineId)=>this.getUserLineSip(userUuid, lineId).catch(()=>null)));
        },
        getUserLineSipFromToken (userUuid) {
            return this.getUser(userUuid).then((user)=>{
                if (!user.lines.length) {
                    console.warn(`No sip line for user: ${userUuid}`);
                    return null;
                }
                const line = user.lines[0];
                return this.getUserLineSip(userUuid, line.uuid || line.id);
            });
        },
        listApplications: ()=>client.get(`${baseUrl}/applications`, null),
        getInfos: ()=>client.get(`${baseUrl}/infos`, null),
        getExternalApps: (userUuid)=>client.get(`${baseUrl}/users/${userUuid}/external/apps`).then(ExternalApp.parseMany),
        getExternalApp: async (userUuid, name)=>{
            const url = `${baseUrl}/users/${userUuid}/external/apps/${name}?view=fallback`;
            try {
                return await client.get(url).then(ExternalApp.parse);
            } catch (e) {
                return null;
            }
        },
        getMyMeetings: ()=>client.get(`${baseUrl}/users/me/meetings`).then((response)=>Meeting.parseMany(response.items)),
        createMyMeeting: (args)=>client.post(`${baseUrl}/users/me/meetings`, convertKeysFromCamelToUnderscore(args)).then(Meeting.parse),
        updateMyMeeting: (meetingUuid, data)=>client.put(`${baseUrl}/users/me/meetings/${meetingUuid}`, convertKeysFromCamelToUnderscore(data), null, ApiRequester.successResponseParser),
        deleteMyMeeting: (meetingUuid)=>client.delete(`${baseUrl}/users/me/meetings/${meetingUuid}`, null),
        getMeeting: (meetingUuid)=>client.get(`${baseUrl}/meetings/${meetingUuid}`, null).then(Meeting.parse),
        meetingAuthorizations: (meetingUuid)=>client.get(`${baseUrl}/users/me/meetings/${meetingUuid}/authorizations`, null).then((response)=>MeetingAuthorization.parseMany(response.items)),
        meetingAuthorizationReject: (meetingUuid, authorizationUuid)=>client.put(`${baseUrl}/users/me/meetings/${meetingUuid}/authorizations/${authorizationUuid}/reject`, {}, null, ApiRequester.successResponseParser),
        meetingAuthorizationAccept: (meetingUuid, authorizationUuid)=>client.put(`${baseUrl}/users/me/meetings/${meetingUuid}/authorizations/${authorizationUuid}/accept`, {}, null, ApiRequester.successResponseParser),
        guestGetMeeting: (meetingUuid)=>client.get(`${baseUrl}/guests/me/meetings/${meetingUuid}`, null).then(Meeting.parse),
        guestAuthorizationRequest: (userUuid, meetingUuid, username)=>client.post(`${baseUrl}/guests/${userUuid}/meetings/${meetingUuid}/authorizations`, {
                guest_name: username
            }).then(MeetingAuthorization.parse),
        guestAuthorizationCheck: (userUuid, meetingUuid, authorizationUuid)=>client.get(`${baseUrl}/guests/${userUuid}/meetings/${meetingUuid}/authorizations/${authorizationUuid}`, null),
        getOutgoingCallerIDs: (userUuid)=>client.get(`${baseUrl}/users/${userUuid}/callerids/outgoing`, null).then(CallerID.parseMany),
        getBlockNumbers: (opts = {})=>client.get(`${baseUrl}/users/me/blocklist/numbers`, opts),
        getBlockNumber: (uuid)=>client.get(`${baseUrl}/users/me/blocklist/numbers/${uuid}`),
        createBlockNumber: (body)=>client.post(`${baseUrl}/users/me/blocklist/numbers`, body),
        updateBlockNumber: (uuid, body)=>client.put(`${baseUrl}/users/me/blocklist/numbers/${uuid}`, body, null, ApiRequester.successResponseParser),
        deleteBlockNumber: (uuid)=>client.delete(`${baseUrl}/users/me/blocklist/numbers/${uuid}`)
    });
class Relocation {
    static MIN_ENGINE_VERSION_REQUIRED;
    relocatedCall;
    initiatorCall;
    recipientCall;
    static parse(response) {
        return new Relocation({
            initiatorCall: response.initiator_call,
            recipientCall: response.recipient_call,
            relocatedCall: response.relocated_call
        });
    }
    constructor({ relocatedCall, initiatorCall, recipientCall }){
        this.initiatorCall = initiatorCall || '';
        this.relocatedCall = relocatedCall || '';
        this.recipientCall = recipientCall || '';
    }
}
Relocation.MIN_ENGINE_VERSION_REQUIRED = '19.09';
const domain_Relocation = Relocation;
class ChatMessage {
    type;
    uuid;
    content;
    date;
    alias;
    userUuid;
    roomUuid;
    read;
    static parseMany(plain) {
        if (!plain || !plain.items) return [];
        return plain.items.map((item)=>ChatMessage.parse(item));
    }
    static parse(plain) {
        return new ChatMessage({
            uuid: plain.uuid,
            date: (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])(plain.created_at).toDate(),
            content: plain.content,
            alias: plain.alias,
            userUuid: plain.user_uuid,
            read: true,
            roomUuid: plain.room ? plain.room.uuid : null
        });
    }
    static newFrom(message) {
        return new_from(message, ChatMessage);
    }
    constructor({ uuid, date, content, userUuid, alias, roomUuid, read } = {}){
        this.uuid = uuid;
        this.date = date;
        this.content = content;
        this.userUuid = userUuid;
        this.alias = alias;
        this.roomUuid = roomUuid;
        this.read = read;
        this.type = 'ChatMessage';
    }
    is(other) {
        return this.uuid === other.uuid;
    }
    isIncoming(userUuid) {
        return this.userUuid !== userUuid;
    }
    acknowledge() {
        this.read = true;
        return this;
    }
}
const VoicemailFolder = {
    NEW: 'new',
    OLD: 'old',
    URGENT: 'urgent',
    OTHER: 'other'
};
const VoicemailFolderMapping = {
    [VoicemailFolder.NEW]: 1,
    [VoicemailFolder.OLD]: 2,
    [VoicemailFolder.URGENT]: 3,
    [VoicemailFolder.OTHER]: 4
};
class Voicemail {
    type;
    id;
    date;
    duration;
    unread;
    mailbox;
    caller;
    static parse(plain) {
        return new Voicemail({
            id: plain.id,
            date: (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])(1000 * plain.timestamp).toDate(),
            duration: 1000 * plain.duration,
            caller: {
                name: plain.caller_id_name,
                number: plain.caller_id_num
            },
            unread: plain.folder ? plain.folder.type === VoicemailFolder.NEW : null,
            mailbox: plain.voicemail
        });
    }
    static parseMany(plain) {
        if (!plain) return [];
        const plainUnread = plain.folders.filter((folder)=>folder.type === VoicemailFolder.NEW)[0].messages;
        const plainRead = plain.folders.filter((folder)=>folder.type === VoicemailFolder.OLD)[0].messages;
        const unread = plainUnread.map((message)=>Voicemail.parse(message)).map((voicemail)=>voicemail.makeAsUnRead());
        const read = plainRead.map((message)=>Voicemail.parse(message)).map((voicemail)=>voicemail.acknowledge());
        return [
            ...unread,
            ...read
        ];
    }
    static parseListData(plain) {
        if (!plain || !plain.items) return [];
        return plain.items.filter((item)=>null != item && 'string' == typeof item.id && 'number' == typeof item.duration && 'number' == typeof item.timestamp).map((item)=>Voicemail.parse({
                id: item.id,
                caller_id_name: item.caller_id_name ?? '',
                caller_id_num: item.caller_id_num ?? '',
                duration: item.duration,
                timestamp: item.timestamp,
                folder: item.folder,
                voicemail: item.voicemail ? {
                    id: String(item.voicemail.id ?? ''),
                    name: item.voicemail.name ?? '',
                    accesstype: item.voicemail.accesstype ?? ''
                } : void 0
            }));
    }
    static newFrom(profile) {
        return new_from(profile, Voicemail);
    }
    static getFolderMappingFromType(folder) {
        return VoicemailFolderMapping[folder];
    }
    constructor({ id, date, duration, caller, unread, mailbox }){
        this.id = id;
        this.date = date;
        this.duration = duration;
        this.caller = caller;
        this.unread = unread;
        this.mailbox = mailbox;
        this.type = 'Voicemail';
    }
    is(other) {
        return other && this.id === other.id;
    }
    acknowledge() {
        this.unread = false;
        return this;
    }
    makeAsUnRead() {
        this.unread = true;
        return this;
    }
    isPersonal() {
        return !this.mailbox || this.mailbox?.accesstype === 'personal';
    }
    contains(query) {
        if (!query) return true;
        return this.caller.name.toUpperCase().includes(query.toUpperCase()) || this.caller.number.includes(query);
    }
}
const RECORDING_STATE = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PAUSED: 'paused'
};
class Call {
    type;
    id;
    sipCallId;
    callerName;
    callerNumber;
    calleeName;
    calleeNumber;
    dialedExtension;
    lineId;
    isCaller;
    isVideo;
    onHold;
    muted;
    status;
    startingTime;
    answerTime;
    hangupTime;
    talkingToIds;
    recording;
    recordingPaused;
    recordingState;
    static parseMany(plain) {
        if (!plain) return [];
        return plain.map((plainCall)=>Call.parse(plainCall));
    }
    static parse(plain) {
        return new Call({
            id: plain.call_id,
            sipCallId: plain.sip_call_id,
            callerName: plain.caller_id_name,
            callerNumber: plain.caller_id_number,
            calleeName: plain.peer_caller_id_name,
            calleeNumber: plain.peer_caller_id_number,
            dialedExtension: plain.dialed_extension,
            isCaller: plain.is_caller,
            isVideo: plain.is_video,
            muted: plain.muted,
            onHold: plain.on_hold,
            status: plain.status,
            lineId: plain.line_id,
            startingTime: (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])(plain.creation_time).toDate(),
            answerTime: (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])(plain.answer_time).toDate(),
            hangupTime: (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])(plain.hangup_time).toDate(),
            talkingToIds: Object.keys(plain.talking_to || {}),
            recording: plain.record_state === RECORDING_STATE.ACTIVE,
            recordingPaused: plain.record_state === RECORDING_STATE.PAUSED,
            recordingState: plain.record_state
        });
    }
    static newFrom(call) {
        return new_from(call, Call);
    }
    constructor({ id, sipCallId, callerName, callerNumber, calleeName, calleeNumber, dialedExtension, isCaller, isVideo, lineId, muted, onHold, status, startingTime, answerTime, hangupTime, talkingToIds, recording, recordingPaused, recordingState }){
        this.id = id;
        this.sipCallId = sipCallId;
        this.callerName = callerName;
        this.callerNumber = callerNumber;
        this.calleeName = calleeName;
        this.calleeNumber = calleeNumber;
        this.dialedExtension = dialedExtension;
        this.muted = muted;
        this.onHold = onHold;
        this.isCaller = isCaller;
        this.lineId = lineId;
        this.status = status;
        this.startingTime = startingTime;
        this.answerTime = answerTime;
        this.hangupTime = hangupTime;
        this.talkingToIds = talkingToIds || [];
        this.recording = recording;
        this.recordingPaused = recordingPaused;
        this.recordingState = recordingState || RECORDING_STATE.INACTIVE;
        this.isVideo = !!isVideo;
        this.type = 'Call';
    }
    getElapsedTimeInSeconds() {
        const now = Date.now();
        return (now - +this.startingTime) / 1000;
    }
    separateCalleeName() {
        const names = this.calleeName.split(' ');
        const firstName = names[0];
        const lastName = names.slice(1).join(' ');
        return {
            firstName,
            lastName
        };
    }
    is(other) {
        return !!other && this.id === other.id;
    }
    hasACalleeName() {
        return this.calleeName.length > 0;
    }
    hasNumber(number) {
        return this.calleeNumber === number;
    }
    isUp() {
        return 'Up' === this.status;
    }
    isDown() {
        return 'Down' === this.status;
    }
    isRinging() {
        return this.isRingingIncoming() || this.isRingingOutgoing();
    }
    isRingingIncoming() {
        return 'Ringing' === this.status;
    }
    isRingingOutgoing() {
        return 'Ring' === this.status;
    }
    isFromTransfer() {
        return 'Down' === this.status || 'Ringing' === this.status;
    }
    isOnHold() {
        return this.onHold;
    }
    putOnHold() {
        this.onHold = true;
    }
    resume() {
        this.onHold = false;
    }
    isRecording() {
        return this.recording;
    }
    isRecordingPaused() {
        return !!this.recordingPaused;
    }
}
const update_from = (instance, from)=>{
    Object.keys(from).forEach((key)=>{
        if (!instance[key] && from[key] || void 0 !== instance[key] && void 0 !== from[key] && instance[key] !== from[key]) instance[key] = from[key];
    });
};
class CallSession {
    call;
    callId;
    displayName;
    realDisplayName;
    updatedNumber;
    number;
    callerNumber;
    creationTime;
    startTime;
    answerTime;
    endTime;
    isCaller;
    answeredBySystem;
    dialedExtension;
    ringing;
    paused;
    sipCallId;
    sipStatus;
    muted;
    videoMuted;
    videoRemotelyDowngraded;
    cameraEnabled;
    autoAnswer;
    ignored;
    screensharing;
    type;
    recording;
    recordingPaused;
    recordingState;
    sipSession;
    conference;
    constructor({ answered, answeredBySystem, isCaller, displayName, callId, muted, videoMuted, number, paused, ringing, startTime, creationTime, endTime, cameraEnabled, dialedExtension, sipCallId, sipStatus, callerNumber, call, autoAnswer, ignored, screensharing, recording, recordingPaused, recordingState, videoRemotelyDowngraded, sipSession, answerTime, conference }){
        this.callId = callId;
        this.sipCallId = sipCallId;
        this.displayName = displayName;
        this.number = number;
        this.creationTime = creationTime;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isCaller = isCaller;
        this.answered = answered;
        this.answeredBySystem = answeredBySystem;
        this.ringing = ringing;
        this.paused = paused;
        this.muted = muted;
        this.videoMuted = videoMuted;
        this.callerNumber = callerNumber;
        this.cameraEnabled = cameraEnabled;
        this.dialedExtension = dialedExtension || '';
        this.call = call;
        this.sipStatus = sipStatus;
        this.autoAnswer = autoAnswer || false;
        this.ignored = ignored || false;
        this.screensharing = screensharing || false;
        this.recording = recording || false;
        this.recordingPaused = recordingPaused || false;
        this.recordingState = recordingState || RECORDING_STATE.INACTIVE;
        this.videoRemotelyDowngraded = videoRemotelyDowngraded;
        this.sipSession = sipSession;
        this.answerTime = answerTime || this.answerTime;
        this.conference = conference;
        this.type = 'CallSession';
    }
    resume() {
        this.paused = false;
    }
    hold() {
        this.paused = true;
    }
    mute() {
        this.muted = true;
    }
    unmute() {
        this.muted = false;
    }
    muteVideo() {
        this.videoMuted = true;
    }
    unmuteVideo() {
        this.videoMuted = false;
    }
    answer() {
        this.answerTime = new Date();
    }
    systemAnswer() {
        this.answeredBySystem = true;
    }
    enableCamera() {
        this.cameraEnabled = true;
    }
    disableCamera() {
        this.cameraEnabled = false;
    }
    ignore() {
        this.ignored = true;
    }
    startScreenSharing() {
        this.screensharing = true;
    }
    stopScreenSharing() {
        this.screensharing = false;
    }
    setIsConference(conference) {
        this.conference = conference;
    }
    isIncoming() {
        return !this.isCaller && !this.answered;
    }
    isOutgoing() {
        return this.isCaller && !this.answered;
    }
    isActive() {
        return this.answered || this.isOutgoing();
    }
    isAnswered() {
        return this.answered;
    }
    isAnsweredBySystem() {
        return this.answeredBySystem;
    }
    isRinging() {
        return this.ringing;
    }
    isOnHold() {
        return this.paused;
    }
    isMuted() {
        return this.muted;
    }
    isVideoMuted() {
        return this.videoMuted;
    }
    isCameraEnabled() {
        return this.cameraEnabled;
    }
    isIgnored() {
        return this.ignored;
    }
    isScreenSharing() {
        return this.screensharing;
    }
    isRecording() {
        return this.recording;
    }
    isRecordingPaused() {
        return this.recordingPaused;
    }
    hasAnInitialInterceptionNumber() {
        return this.number.startsWith('*8');
    }
    isAnInterception() {
        return this.dialedExtension.startsWith('*8');
    }
    isEstablished() {
        return this.sipStatus === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Established;
    }
    isTerminating() {
        return this.sipStatus === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Terminating;
    }
    isTerminated() {
        return this.sipStatus === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Terminated;
    }
    isConference() {
        return this.conference;
    }
    getElapsedTimeInSeconds() {
        if (!this.startTime) return 0;
        return (Date.now() - this.startTime) / 1000;
    }
    getId() {
        return this.sipCallId || this.callId;
    }
    is(callSession) {
        if (!callSession) return false;
        return this.isId(callSession.sipCallId) || this.isId(callSession.callId);
    }
    isId(id) {
        return this.getId() === id || !!this.sipCallId && this.sipCallId === id || !!this.callId && this.callId === id;
    }
    updateFrom(session) {
        update_from(this, session);
    }
    separateDisplayName() {
        const names = this.displayName.split(' ');
        const firstName = names[0];
        const lastName = names.slice(1).join(' ');
        return {
            firstName,
            lastName
        };
    }
    getTalkingToIds() {
        return this.call ? this.call.talkingToIds : [];
    }
    setVideoRemotelyDowngraded(value) {
        this.videoRemotelyDowngraded = value;
    }
    isVideoRemotelyDowngraded() {
        return this.videoRemotelyDowngraded;
    }
    static newFrom(callSession) {
        return new_from(callSession, CallSession);
    }
    set answered(value) {
        this.answerTime = value ? this.answerTime || new Date() : null;
    }
    get answered() {
        return !!this.answerTime;
    }
    toJSON() {
        const jsonObj = {
            ...this
        };
        jsonObj.answered = this.answered;
        return jsonObj;
    }
    static parseCall(call) {
        return new CallSession({
            callId: call.id,
            sipCallId: call.sipCallId,
            displayName: call.calleeName || call.calleeNumber,
            number: call.calleeNumber,
            callerNumber: call.callerNumber,
            startTime: +call.startingTime,
            paused: call.isOnHold(),
            isCaller: call.isCaller,
            muted: call.muted,
            videoMuted: false,
            screensharing: false,
            recording: call.isRecording(),
            recordingPaused: call.isRecordingPaused(),
            recordingState: call.recordingState,
            ringing: call.isRinging(),
            answered: call.isUp(),
            answeredBySystem: call.isUp() && 0 === call.talkingToIds.length,
            cameraEnabled: call.isVideo,
            dialedExtension: call.dialedExtension,
            call,
            conference: false
        });
    }
}
class Emitter {
    eventEmitter;
    constructor(){
        this.eventEmitter = new __WEBPACK_EXTERNAL_MODULE_events__["default"]();
    }
    on(event, callback) {
        this.eventEmitter.on(event, callback);
    }
    once(event, callback) {
        this.eventEmitter.once(event, callback);
    }
    off(event, callback) {
        this.eventEmitter.removeListener(event, callback);
    }
    unbind() {
        this.eventEmitter.removeAllListeners();
    }
}
__webpack_require__.g.wazoClients = __webpack_require__.g.wazoClients || {};
__webpack_require__.g.wazoClientId = __webpack_require__.g.wazoClientId || {};
__webpack_require__.g.wazoClientToken = __webpack_require__.g.wazoClientToken || {};
__webpack_require__.g.wazoRefreshToken = __webpack_require__.g.wazoRefreshToken || {};
__webpack_require__.g.wazoRefreshTenantId = __webpack_require__.g.wazoRefreshTenantId || {};
__webpack_require__.g.wazoRefreshDomainName = __webpack_require__.g.wazoRefreshDomainName || {};
__webpack_require__.g.wazoOnRefreshToken = __webpack_require__.g.wazoOnRefreshToken || {};
__webpack_require__.g.wazoOnRefreshTokenError = __webpack_require__.g.wazoOnRefreshTokenError || {};
__webpack_require__.g.wazoRefreshExpiration = __webpack_require__.g.wazoRefreshExpiration || {};
__webpack_require__.g.wazoRefreshBackend = __webpack_require__.g.wazoRefreshBackend || {};
__webpack_require__.g.wazoIsMobile = __webpack_require__.g.wazoIsMobile || {};
__webpack_require__.g.wazoRequestApiTimeout = __webpack_require__.g.wazoRequestApiTimeout || {};
__webpack_require__.g.wazoFetchOptions = __webpack_require__.g.wazoFetchOptions || {};
const setApiClientId = (clientId, forServer = null)=>{
    __webpack_require__.g.wazoClientId[String(forServer)] = clientId;
};
const setCurrentServer = (newServer)=>{
    __webpack_require__.g.wazoCurrentServer = newServer;
};
const setApiToken = (newToken, forServer = null)=>{
    __webpack_require__.g.wazoClientToken[String(forServer)] = newToken;
};
const setRefreshToken = (newRefreshToken, forServer = null)=>{
    __webpack_require__.g.wazoRefreshToken[String(forServer)] = newRefreshToken;
};
const setRefreshTenantId = (refreshTenantId, forServer = null)=>{
    console.warn('Use of `setRefreshTenantId` is deprecated, please use `setRefreshDomainName` instead');
    __webpack_require__.g.wazoRefreshTenantId[String(forServer)] = refreshTenantId;
};
const setRefreshDomainName = (refreshDomainName, forServer = null)=>{
    __webpack_require__.g.wazoRefreshDomainName[String(forServer)] = refreshDomainName;
};
const setOnRefreshToken = (onRefreshToken, forServer = null)=>{
    __webpack_require__.g.wazoOnRefreshToken[String(forServer)] = onRefreshToken;
};
const setOnRefreshTokenError = (callback, forServer = null)=>{
    __webpack_require__.g.wazoOnRefreshTokenError[String(forServer)] = callback;
};
const setRefreshExpiration = (refreshExpiration, forServer = null)=>{
    __webpack_require__.g.wazoRefreshExpiration[String(forServer)] = refreshExpiration;
};
const setIsMobile = (isMobile, forServer = null)=>{
    __webpack_require__.g.wazoIsMobile[String(forServer)] = isMobile;
};
const setRequestTimeout = (requestTimeout, forServer = null)=>{
    __webpack_require__.g.wazoRequestApiTimeout[String(forServer)] = requestTimeout;
};
const setFetchOptions = (fetchOptions, forServer = null)=>{
    __webpack_require__.g.wazoFetchOptions[String(forServer)] = fetchOptions;
};
const getFetchOptions = (forServer = null)=>(forServer ? __webpack_require__.g.wazoFetchOptions[forServer] : __webpack_require__.g.wazoFetchOptions.null) || __webpack_require__.g.wazoFetchOptions.null;
const fillClient = (apiClient)=>{
    const { server, token, clientId } = apiClient.client;
    const tenantId = __webpack_require__.g.wazoRefreshTenantId[server] || __webpack_require__.g.wazoRefreshTenantId.null || apiClient.refreshTenantId;
    const requestTimeout = __webpack_require__.g.wazoRequestApiTimeout[server] || __webpack_require__.g.wazoRequestApiTimeout.null;
    apiClient.setToken(__webpack_require__.g.wazoClientToken[server] || __webpack_require__.g.wazoClientToken.null || token);
    apiClient.setClientId(__webpack_require__.g.wazoClientId[server] || __webpack_require__.g.wazoClientId.null || clientId);
    apiClient.setRefreshToken(__webpack_require__.g.wazoRefreshToken[server] || __webpack_require__.g.wazoRefreshToken.null || apiClient.refreshToken);
    if (tenantId) apiClient.setRefreshTenantId(tenantId);
    apiClient.setRefreshDomainName(__webpack_require__.g.wazoRefreshDomainName[server] || __webpack_require__.g.wazoRefreshDomainName.null || apiClient.refreshDomainName);
    apiClient.setFetchOptions(__webpack_require__.g.wazoFetchOptions[server] || __webpack_require__.g.wazoFetchOptions.null || apiClient.fetchOptions);
    apiClient.setOnRefreshToken(__webpack_require__.g.wazoOnRefreshToken[server] || __webpack_require__.g.wazoOnRefreshToken.null || apiClient.onRefreshToken);
    apiClient.setOnRefreshTokenError(__webpack_require__.g.wazoOnRefreshTokenError[server] || __webpack_require__.g.wazoOnRefreshTokenError.null || apiClient.onRefreshTokenError);
    apiClient.setRefreshExpiration(__webpack_require__.g.wazoRefreshExpiration[server] || __webpack_require__.g.wazoRefreshExpiration.null || apiClient.refreshExpiration);
    apiClient.setRefreshBackend(__webpack_require__.g.wazoRefreshBackend[server] || __webpack_require__.g.wazoRefreshBackend.null || apiClient.refreshBackend);
    apiClient.setIsMobile(__webpack_require__.g.wazoIsMobile[server] || __webpack_require__.g.wazoIsMobile.null || apiClient.isMobile);
    if (requestTimeout) apiClient.setRequestTimeout(requestTimeout);
};
const getApiClient = (forServer, Client = ApiClient)=>{
    const server = forServer || __webpack_require__.g.wazoCurrentServer || '';
    if (server in __webpack_require__.g.wazoClients) {
        fillClient(__webpack_require__.g.wazoClients[server]);
        return __webpack_require__.g.wazoClients[server];
    }
    __webpack_require__.g.wazoClients[server] = new Client({
        server
    });
    fillClient(__webpack_require__.g.wazoClients[server]);
    return __webpack_require__.g.wazoClients[server];
};
const service_getApiClient = getApiClient;
class CallApi {
    static async fetchCallLogs(offset, limit) {
        return service_getApiClient().callLogd.listCallLogs(offset, limit);
    }
    static async fetchDistinctCallLogs(offset, limit, distinct = 'peer_exten') {
        return service_getApiClient().callLogd.listDistinctCallLogs(offset, limit, distinct);
    }
    static async fetchActiveCalls() {
        return service_getApiClient().calld.listCalls();
    }
    static async fetchCallLogsFromDate(from, number) {
        return service_getApiClient().callLogd.listCallLogsFromDate(from, number);
    }
    static async search(query, limit) {
        return service_getApiClient().callLogd.search(query, limit);
    }
    static async searchBy(field, value, limit) {
        return service_getApiClient().callLogd.searchBy(field, value, limit);
    }
    static async fetchSIP(session, line) {
        const lineToUse = line || session.primaryLine();
        return service_getApiClient().confd.getUserLineSip(session.uuid, lineToUse ? lineToUse.id : '');
    }
    static async cancelCall(callSession) {
        return service_getApiClient().calld.cancelCall(callSession.callId);
    }
    static async makeCall(callFromLine, extension, isMobile = false, callbackAllLines = false) {
        const lineId = callFromLine ? callFromLine.id : null;
        const response = await service_getApiClient().calld.makeCall(extension, isMobile, lineId, callbackAllLines);
        return Call.parse(response);
    }
    static async relocateCall(callId, line, contactIdentifier) {
        return service_getApiClient().calld.relocateCall(callId, 'line', line, contactIdentifier);
    }
    static async hold(callId) {
        return service_getApiClient().calld.hold(callId);
    }
    static async resume(callId) {
        return service_getApiClient().calld.resume(callId);
    }
    static async mute(callId) {
        return service_getApiClient().calld.mute(callId);
    }
    static async sendDTMF(callId, digits) {
        return service_getApiClient().calld.sendDTMF(callId, digits);
    }
    static async unmute(callId) {
        return service_getApiClient().calld.unmute(callId);
    }
    static async transferCall(callId, number, flow) {
        return service_getApiClient().calld.transferCall(callId, number, flow);
    }
    static async cancelCallTransfer(transferId) {
        return service_getApiClient().calld.cancelCallTransfer(transferId);
    }
    static async confirmCallTransfer(transferId) {
        return service_getApiClient().calld.confirmCallTransfer(transferId);
    }
}
const TRANSFER_FLOW_ATTENDED = 'attended';
const TRANSFER_FLOW_BLIND = 'blind';
const CTIPhone_logger = IssueReporter ? IssueReporter.loggerFor('cti-phone') : console;
class CTIPhone extends Emitter {
    session;
    isMobile;
    callbackAllLines;
    currentCall;
    client = null;
    constructor(session, isMobile = false, callbackAllLines = false){
        super();
        CTIPhone_logger.info('CTI Phone created');
        this.session = session;
        this.isMobile = isMobile;
        this.callbackAllLines = callbackAllLines;
    }
    getOptions() {
        return {
            accept: false,
            decline: true,
            mute: true,
            hold: false,
            transfer: true,
            sendKey: true,
            addParticipant: false,
            record: true,
            merge: false
        };
    }
    hasAnActiveCall() {
        return !!this.currentCall;
    }
    callCount() {
        return this.currentCall ? 1 : 0;
    }
    isWebRTC() {
        return false;
    }
    getUserAgent() {
        return 'cti-phone';
    }
    startHeartbeat() {}
    setOnHeartbeatTimeout() {}
    setOnHeartbeatCallback() {}
    stopHeartbeat() {}
    bindClientEvents() {}
    onConnect() {
        return Promise.resolve();
    }
    onDisconnect() {}
    async makeCall(number, line) {
        CTIPhone_logger.info('make CTI call', {
            number
        });
        if (!number) return null;
        try {
            this.currentCall = await CallApi.makeCall(line, number, this.isMobile, this.callbackAllLines);
        } catch (_) {}
        if (!this.currentCall) return null;
        const callSession = CallSession.parseCall(this.currentCall);
        this.eventEmitter.emit('onCallOutgoing', callSession);
        return callSession;
    }
    accept(callSession) {
        if (!callSession) return Promise.resolve(null);
        CTIPhone_logger.info('accept CTI call', {
            callId: callSession.getId(),
            number: callSession.number
        });
        if (!this.currentCall) this.currentCall = callSession.call;
        return Promise.resolve(callSession.getId());
    }
    endCurrentCall(callSession) {
        if (!callSession) return;
        CTIPhone_logger.info('end current CTI call', {
            callId: callSession.getId(),
            number: callSession.number
        });
        this.currentCall = void 0;
        this.eventEmitter.emit('onCallEnded', callSession);
    }
    async hangup(callSession) {
        if (!callSession) return Promise.resolve(false);
        CTIPhone_logger.info('hangup CTI call', {
            callId: callSession.getId(),
            number: callSession.number
        });
        try {
            await CallApi.cancelCall(callSession);
            if (this.currentCall && callSession.callId === this.currentCall.id) this.endCurrentCall(callSession);
            this.eventEmitter.emit('onCallEnded', callSession);
            return true;
        } catch (e) {
            CTIPhone_logger.error('hangup CTI call, error', e);
            this.eventEmitter.emit('onCallFailed', callSession);
            return false;
        }
    }
    ignore() {}
    async reject(callSession) {
        if (!callSession) return;
        CTIPhone_logger.info('reject CTI call', {
            callId: callSession.getId(),
            number: callSession.number
        });
        await CallApi.cancelCall(callSession);
        this.eventEmitter.emit('onCallEnded', callSession);
    }
    async transfer(callSession, number) {
        if (!callSession) return;
        CTIPhone_logger.info('transfer CTI call', {
            callId: callSession.getId(),
            number: callSession.number,
            to: number
        });
        await CallApi.transferCall(callSession.callId, number, TRANSFER_FLOW_BLIND);
    }
    indirectTransfer() {
        return Promise.resolve(false);
    }
    async initiateCTIIndirectTransfer(callSession, number) {
        if (!callSession) return Promise.resolve(null);
        CTIPhone_logger.info('indirect CTI transfer', {
            callId: callSession.getId(),
            number: callSession.number,
            to: number
        });
        return CallApi.transferCall(callSession.callId, number, TRANSFER_FLOW_ATTENDED);
    }
    async cancelCTIIndirectTransfer(transferId) {
        CTIPhone_logger.info('cancel CTI transfer', {
            transferId
        });
        return CallApi.cancelCallTransfer(transferId);
    }
    async confirmCTIIndirectTransfer(transferId) {
        CTIPhone_logger.info('confirm CTI transfer', {
            transferId
        });
        return CallApi.confirmCallTransfer(transferId);
    }
    sendKey(callSession, digits) {
        if (!callSession) return;
        CTIPhone_logger.info('send CTI key', {
            callId: callSession.getId(),
            number: callSession.number,
            digits
        });
        CallApi.sendDTMF(callSession.callId, digits);
    }
    onConnectionMade() {
        CTIPhone_logger.info('on CTI connection made');
        this.eventEmitter.emit('onCallAccepted');
    }
    async close() {
        CTIPhone_logger.info('CTI close');
        return Promise.resolve();
    }
    async hold(callSession) {
        if (!callSession) return false;
        CTIPhone_logger.info('CTI hold', {
            callId: callSession.getId(),
            number: callSession.number
        });
        return CallApi.hold(callSession.callId);
    }
    async resume(callSession) {
        if (!callSession) return false;
        CTIPhone_logger.info('CTI resume', {
            callId: callSession.getId(),
            number: callSession.number
        });
        return CallApi.resume(callSession.callId);
    }
    async mute(callSession) {
        if (!callSession) return;
        CTIPhone_logger.info('CTI mute', {
            callId: callSession.getId(),
            number: callSession.number
        });
        await CallApi.mute(callSession.callId);
    }
    async unmute(callSession) {
        if (!callSession) return;
        CTIPhone_logger.info('CTI unmute', {
            callId: callSession.getId(),
            number: callSession.number
        });
        await CallApi.unmute(callSession.callId);
    }
    putOnSpeaker() {}
    putOffSpeaker() {}
    turnCameraOff() {}
    turnCameraOn() {}
    changeAudioInputDevice() {
        return Promise.resolve(null);
    }
    changeVideoInputDevice() {
        return Promise.resolve(null);
    }
    changeAudioDevice() {
        return Promise.resolve();
    }
    changeRingDevice() {}
    changeAudioVolume() {}
    changeRingVolume() {}
    hasVideo() {
        return false;
    }
    hasAVideoTrack() {
        return false;
    }
    getLocalStreamForCall() {
        return null;
    }
    getRemoteStreamForCall() {
        return null;
    }
    getLocalVideoStream() {
        return null;
    }
    setActiveSipSession() {}
    isRegistered() {
        return true;
    }
    hasIncomingCallSession() {
        return true;
    }
    hasActiveRemoteVideoStream() {
        return false;
    }
    getCurrentCallSession() {
        return this.currentCall ? CallSession.parseCall(this.currentCall) : null;
    }
    enableRinging() {}
    sendMessage() {}
    disableRinging() {}
    getLocalStream() {
        return null;
    }
    getRemoteStream() {
        return null;
    }
    getRemoteVideoStream() {
        return null;
    }
    getRemoteAudioStream() {
        return null;
    }
    hasLocalVideo() {
        return false;
    }
    useLocalVideoElement() {}
    setMediaConstraints() {}
    register() {
        return Promise.resolve(null);
    }
}
const ctid_ng = (client, baseUrl)=>({
        updatePresence: (presence)=>client.put(`${baseUrl}/users/me/presences`, {
                presence
            }, null, ApiRequester.successResponseParser),
        listMessages: (participantUuid, limit)=>{
            const query = {};
            if (participantUuid) query.participant_user_uuid = participantUuid;
            if (limit) query.limit = limit;
            return client.get(`${baseUrl}/users/me/chats`, query).then(ChatMessage.parseMany);
        },
        sendMessage: (alias, msg, toUserId)=>{
            const body = {
                alias,
                msg,
                to: toUserId
            };
            return client.post(`${baseUrl}/users/me/chats`, body, null, ApiRequester.successResponseParser);
        },
        makeCall: (extension, fromMobile, lineId, allLines = false)=>{
            const query = {
                from_mobile: fromMobile,
                extension
            };
            if (lineId) query.line_id = lineId;
            if (allLines) query.all_lines = true;
            return client.post(`${baseUrl}/users/me/calls`, query);
        },
        cancelCall: (callId)=>client.delete(`${baseUrl}/users/me/calls/${callId}`),
        listCalls: ()=>client.get(`${baseUrl}/users/me/calls`).then((response)=>Call.parseMany(response.items)),
        relocateCall (callId, destination, lineId, contact) {
            const body = {
                completions: [
                    'answer'
                ],
                destination,
                initiator_call: callId,
                auto_answer: true
            };
            if (lineId || contact) body.location = {};
            if (lineId) body.location.line_id = lineId;
            if (contact) body.location.contact = contact;
            return client.post(`${baseUrl}/users/me/relocates`, body).then(domain_Relocation.parse);
        },
        transferCall (callId, number, flow = TRANSFER_FLOW_BLIND) {
            const body = {
                exten: number,
                flow,
                initiator_call: callId
            };
            return client.post(`${baseUrl}/users/me/transfers`, body);
        },
        cancelCallTransfer: (transferId)=>client.delete(`${baseUrl}/users/me/transfers/${transferId}`),
        confirmCallTransfer: (transferId)=>client.put(`${baseUrl}/users/me/transfers/${transferId}/complete`),
        listVoicemails: ()=>client.get(`${baseUrl}/users/me/voicemails`, null).then((response)=>Voicemail.parseMany(response)),
        deleteVoicemail: (voicemailId)=>client.delete(`${baseUrl}/users/me/voicemails/messages/${voicemailId}`, null),
        getPresence: (contactUuid)=>client.get(`${baseUrl}/users/${contactUuid}/presences`, null),
        getStatus: (lineUuid)=>client.get(`${baseUrl}/lines/${lineUuid}/presences`, null),
        fetchSwitchboardHeldCalls: (switchboardUuid)=>client.get(`${baseUrl}/switchboards/${switchboardUuid}/calls/held`, null),
        holdSwitchboardCall: (switchboardUuid, callId)=>client.put(`${baseUrl}/switchboards/${switchboardUuid}/calls/held/${callId}`, null, null, ApiRequester.successResponseParser),
        answerSwitchboardHeldCall: (switchboardUuid, callId)=>client.put(`${baseUrl}/switchboards/${switchboardUuid}/calls/held/${callId}/answer`, null),
        fetchSwitchboardQueuedCalls: (switchboardUuid)=>client.get(`${baseUrl}/switchboards/${switchboardUuid}/calls/queued`, null),
        answerSwitchboardQueuedCall: (switchboardUuid, callId)=>client.put(`${baseUrl}/switchboards/${switchboardUuid}/calls/queued/${callId}/answer`, null),
        sendFax: (extension, fax, callerId = null)=>{
            const headers = {
                'Content-type': 'application/pdf',
                'X-Auth-Token': client.token
            };
            const params = ApiRequester.getQueryString({
                extension,
                caller_id: callerId
            });
            return client.post(`${baseUrl}/users/me/faxes?${params}`, fax, headers);
        }
    });
const getContactPayload = (contact)=>({
        email: contact.email,
        firstname: contact.firstName ? contact.firstName : '',
        lastname: contact.lastName ? contact.lastName : '',
        number: contact.phoneNumber ? contact.phoneNumber : '',
        entreprise: contact.entreprise ? contact.entreprise : '',
        birthday: contact.birthday ? contact.birthday : '',
        address: contact.address ? contact.address : '',
        note: contact.note ? contact.note : ''
    });
const dird = (client, baseUrl)=>({
        search: (context, term, offset = 0, limit = null)=>client.get(`${baseUrl}/directories/lookup/${context}`, {
                term
            }).then((response)=>Contact.parseMany(response, offset, limit)),
        listPersonalContacts: (queryParams)=>client.get(`${baseUrl}/personal`, queryParams).then((response)=>Contact.parseManyPersonal(response.items)),
        fetchPersonalContact: (contactUuid)=>client.get(`${baseUrl}/personal/${contactUuid}`).then(Contact.parsePersonal),
        addContact: (contact)=>client.post(`${baseUrl}/personal`, getContactPayload(contact)).then(Contact.parsePersonal),
        editContact: (contact)=>client.put(`${baseUrl}/personal/${contact.sourceId || contact.id || ''}`, getContactPayload(contact)).then(Contact.parsePersonal),
        importContacts: async (csv)=>{
            const headers = {
                'Content-Type': 'text/csv; charset=utf-8',
                'X-Auth-Token': client.token
            };
            return client.post(`${baseUrl}/personal/import`, csv, headers).then((result)=>Contact.parseManyPersonal(result.created));
        },
        deleteContact: (contactUuid)=>client.delete(`${baseUrl}/personal/${contactUuid}`),
        listFavorites: (context)=>client.get(`${baseUrl}/directories/favorites/${context}`).then(Contact.parseMany),
        markAsFavorite: (source, sourceId)=>{
            const url = `${baseUrl}/directories/favorites/${source}/${sourceId}`;
            return client.put(url, null, null, ApiRequester.successResponseParser);
        },
        removeFavorite: (source, sourceId)=>client.delete(`${baseUrl}/directories/favorites/${source}/${sourceId}`),
        fetchOffice365Source: (context)=>client.get(`${baseUrl}/directories/${context}/sources`, {
                backend: 'office365'
            }),
        fetchOffice365Contacts: async (source, queryParams)=>{
            if (!source) return Promise.resolve([]);
            return client.get(`${baseUrl}/backends/office365/sources/${source.uuid}/contacts`, queryParams).then((response)=>Contact.parseManyOffice365(response.items, source));
        },
        fetchWazoSource: (context)=>client.get(`${baseUrl}/directories/${context}/sources`, {
                backend: 'wazo'
            }),
        fetchWazoContacts: async (source, queryParams, options)=>{
            if (!source) return [];
            const defaultParser = (response, src)=>Contact.parseManyWazo(response.items, src);
            const parser = options?.parser ?? defaultParser;
            return client.get(`${baseUrl}/backends/wazo/sources/${source.uuid}/contacts`, queryParams).then((response)=>parser(response, source));
        },
        fetchGoogleSource: (context)=>client.get(`${baseUrl}/directories/${context}/sources`, {
                backend: 'google'
            }),
        fetchGoogleContacts: async (source, queryParams)=>{
            if (!source) return Promise.resolve([]);
            return client.get(`${baseUrl}/backends/google/sources/${source.uuid}/contacts`, queryParams).then((response)=>Contact.parseManyGoogle(response.items, source));
        },
        fetchConferenceSource: (context)=>client.get(`${baseUrl}/directories/${context}/sources`, {
                backend: 'conference'
            }),
        fetchSourcesFor: (context, backend)=>client.get(`${baseUrl}/directories/${context}/sources`, {
                backend
            }),
        fetchPhonebookContacts: async (source, queryParams)=>{
            if (!source) return Promise.resolve({
                items: [],
                total: 0
            });
            return client.get(`${baseUrl}/backends/phonebook/sources/${source.uuid}/contacts`, queryParams);
        },
        fetchConferenceContacts: async (source, queryParams)=>{
            if (!source) return Promise.resolve([]);
            return client.get(`${baseUrl}/backends/conference/sources/${source.uuid}/contacts`, queryParams).then((response)=>Contact.parseManyConference(response.items, source));
        },
        findMultipleContactsByNumber: (numbers, fields)=>{
            const query = (0, __WEBPACK_EXTERNAL_MODULE_json_to_graphql_query_lib_jsonToGraphQLQuery_86e5fe4e__.jsonToGraphQLQuery)({
                me: {
                    contacts: {
                        __args: {
                            profile: 'default',
                            extens: numbers
                        },
                        edges: {
                            node: fields || {
                                firstname: true,
                                lastname: true,
                                wazoReverse: true,
                                wazoBackend: true,
                                email: true,
                                wazoSourceEntryId: true,
                                wazoSourceName: true,
                                '... on WazoContact': {
                                    userUuid: true
                                }
                            }
                        }
                    }
                }
            });
            return client.post(`${baseUrl}/graphql`, {
                query: `{${query}}`
            }).then(Contact.manyGraphQlWithNumbersParser(numbers));
        }
    });
class Recording {
    deleted;
    end;
    fileName;
    start;
    uuid;
    static parseMany(recordings = []) {
        if (!recordings) return [];
        return recordings.map((item)=>Recording.parse(item));
    }
    static parse(plain) {
        return new Recording({
            deleted: plain.deleted,
            fileName: plain.filename,
            end: plain.end_time ? (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])(plain.end_time).toDate() : null,
            start: (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])(plain.start_time).toDate(),
            uuid: plain.uuid
        });
    }
    constructor({ deleted, end, fileName, start, uuid }){
        this.deleted = deleted;
        this.end = end;
        this.fileName = fileName;
        this.start = start;
        this.uuid = uuid;
    }
}
const CALL_LOG_VALID_REQUESTED_VERSION = '24.14';
class CallLog {
    type;
    answer;
    answered;
    newMissedCall;
    callDirection;
    callStatus;
    destination;
    requested;
    recordings;
    source;
    id;
    duration;
    start;
    end;
    static merge(current, toMerge) {
        const onlyUnique = (value, index, self)=>self.indexOf(value) === index;
        const allLogs = current.concat(toMerge);
        const onlyUniqueIds = allLogs.map((c)=>c.id).filter(onlyUnique);
        return onlyUniqueIds.map((id)=>allLogs.find((log)=>log && log.id === id));
    }
    static parseMany(plain) {
        if (!plain || !plain.items) return [];
        return plain.items.map((item)=>CallLog.parse(item));
    }
    static parse(plain) {
        return new CallLog({
            answer: plain.answer ? (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])(plain.answer).toDate() : null,
            answered: plain.answered,
            callDirection: plain.call_direction,
            callStatus: plain.call_status || (plain?.answered ? 'answered' : 'unknown'),
            destination: {
                uuid: plain.destination_user_uuid,
                name: plain.requested_name || plain.destination_name || '',
                extension: plain.requested_extension || plain.destination_extension || `meeting-${plain.requested_name || plain.destination_name || ''}`,
                plainExtension: plain.destination_extension,
                plainName: plain.destination_name
            },
            requested: {
                uuid: plain.requested_user_uuid,
                name: plain.requested_name || '',
                extension: plain.requested_extension
            },
            source: {
                uuid: plain.source_user_uuid,
                name: plain.source_name,
                extension: plain.source_extension
            },
            id: plain.id,
            duration: 1000 * (plain.duration || 0),
            start: (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])(plain.start).toDate(),
            end: plain.end ? (0, __WEBPACK_EXTERNAL_MODULE_moment__["default"])(plain.end).toDate() : null,
            recordings: Recording.parseMany(plain.recordings || [])
        });
    }
    static parseNew(plain, session) {
        const callLog = CallLog.parse(plain);
        callLog.newMissedCall = session && plain.destination_user_uuid === session.uuid && !plain.answered;
        return callLog;
    }
    static newFrom(profile) {
        return new_from(profile, CallLog);
    }
    constructor({ answer, answered, callDirection, callStatus = 'unknown', destination, requested, source, id, duration, start, end, recordings }){
        this.answer = answer;
        this.answered = answered;
        this.callDirection = callDirection;
        this.callStatus = callStatus;
        this.destination = destination;
        this.requested = requested;
        this.source = source;
        this.id = id;
        this.duration = duration;
        this.start = start;
        this.end = end;
        this.recordings = recordings || [];
        this.type = 'CallLog';
    }
    isFromSameParty(other, session) {
        return this.theOtherParty(session).extension === other.theOtherParty(session).extension;
    }
    theOtherParty(session) {
        if ('inbound' === this.callDirection) return this.source;
        if ('outbound' === this.callDirection) return this.destination;
        return session?.hasExtension(this.source.extension) ? this.destination : this.source;
    }
    isNewMissedCall() {
        return this.newMissedCall;
    }
    acknowledgeCall() {
        this.newMissedCall = false;
        return this;
    }
    isAcknowledged() {
        return this.newMissedCall;
    }
    isAnswered() {
        return this.answered;
    }
    isOutgoing(session) {
        if ('internal' === this.callDirection) return session.hasExtension(this.source.extension);
        return 'outbound' === this.callDirection;
    }
    isIncoming(session) {
        if ('internal' === this.callDirection) return session.hasExtension(this.destination.plainExtension) || session.hasExtension(this.requested.extension) || session.uuid === this.destination.uuid || session.uuid === this.requested.uuid;
        return 'inbound' === this.callDirection;
    }
    isIncomingAndForwarded(session) {
        if (!session.hasEngineVersionGte(CALL_LOG_VALID_REQUESTED_VERSION) || !this.isIncoming(session)) return false;
        return this.requested.extension !== this.destination.plainExtension;
    }
    isAnOutgoingCall(session) {
        console.warn(`@wazo/sdk
      CallLog.isAnOutgoingcall(session) method is obsolete.
      Please use CallLog.isOutgoing(session).
    `);
        return session.hasExtension(this.source.extension) && this.answered;
    }
    isAMissedOutgoingCall(session) {
        return session.hasExtension(this.source.extension) && !this.answered;
    }
    isAnIncomingCall(session) {
        console.warn(`@wazo/sdk
      CallLog.isAnIncomingCall(session) method is obsolete.
      Please use CallLog.isIncoming(session).
    `);
        return session.hasExtension(this.destination.extension) && this.answered;
    }
    isADeclinedCall(session) {
        return !this.answered && session.hasExtension(this.destination.extension);
    }
    getRecordings() {
        return this.recordings;
    }
}
const call_logd = (client, baseUrl)=>({
        search: (search, limit = 5)=>client.get(`${baseUrl}/users/me/cdr`, {
                search,
                limit
            }).then(CallLog.parseMany),
        searchBy: (field, value, limit = 5)=>client.get(`${baseUrl}/users/me/cdr`, {
                [field]: value,
                limit
            }).then(CallLog.parseMany),
        listCallLogs: (offset, limit = 5, queryParameters = {})=>client.get(`${baseUrl}/users/me/cdr`, {
                offset,
                limit,
                ...queryParameters
            }).then(CallLog.parseMany),
        listDistinctCallLogs: (offset, limit = 5, distinct)=>client.get(`${baseUrl}/users/me/cdr`, {
                offset,
                limit,
                distinct
            }).then(CallLog.parseMany),
        listCallLogsFromDate: (from, number)=>client.get(`${baseUrl}/users/me/cdr`, {
                from: from.toISOString(),
                number
            }).then(CallLog.parseMany)
    });
class ChatRoom {
    type;
    uuid;
    name;
    users;
    kind;
    static parseMany(plain) {
        if (!plain || !plain.items) return [];
        return plain.items.map((item)=>ChatRoom.parse(item));
    }
    static parse(plain) {
        return new ChatRoom({
            uuid: plain.uuid,
            name: plain.name,
            users: plain.users,
            kind: plain.kind
        });
    }
    static newFrom(room) {
        return new_from(room, ChatRoom);
    }
    constructor({ uuid, name, users, kind } = {}){
        this.uuid = uuid;
        this.name = name;
        this.users = users;
        this.kind = kind;
        this.type = 'ChatRoom';
    }
}
const MAX_PRESENCE_FETCHED = 30;
const chatd = (client, baseUrl)=>({
        updateState: (contactUuid, state)=>client.put(`${baseUrl}/users/${contactUuid}/presences`, {
                state
            }, null, ApiRequester.successResponseParser),
        updateStatus: (contactUuid, state, status)=>{
            const body = {
                state,
                status
            };
            return client.put(`${baseUrl}/users/${contactUuid}/presences`, body, null, ApiRequester.successResponseParser);
        },
        getState: async (contactUuid)=>client.get(`${baseUrl}/users/${contactUuid}/presences`).then((response)=>response.state),
        getContactStatusInfo: async (contactUuid)=>client.get(`${baseUrl}/users/${contactUuid}/presences`).then((response)=>response),
        getLineState: async (contactUuid)=>client.get(`${baseUrl}/users/${contactUuid}/presences`).then((response)=>Profile.getLinesState(response.lines)),
        async getMultipleLineState (contactUuids) {
            const body = {};
            const uuids = contactUuids || [];
            if (uuids.length > MAX_PRESENCE_FETCHED) {
                const requests = uuids.reduce((acc, _, i)=>{
                    if (i % MAX_PRESENCE_FETCHED === 0) acc.push(this.getMultipleLineState(uuids.slice(i, i + MAX_PRESENCE_FETCHED)));
                    return acc;
                }, []);
                const splittedStatuses = await Promise.all(requests);
                return splittedStatuses.flat();
            }
            if (uuids.length) body.user_uuid = uuids.join(',');
            return client.get(`${baseUrl}/users/presences`, body).then((response)=>response.items);
        },
        getUserRooms: async ()=>client.get(`${baseUrl}/users/me/rooms`).then(ChatRoom.parseMany),
        createRoom: async (name, users, kind)=>client.post(`${baseUrl}/users/me/rooms`, {
                name,
                users,
                kind
            }).then(ChatRoom.parse),
        getRoomMessages: async (roomUuid, params)=>{
            const qs = ApiRequester.getQueryString(params || {});
            return client.get(`${baseUrl}/users/me/rooms/${roomUuid}/messages${qs.length ? `?${qs}` : ''}`).then((response)=>ChatMessage.parseMany(response));
        },
        sendRoomMessage: async (roomUuid, message)=>client.post(`${baseUrl}/users/me/rooms/${roomUuid}/messages`, message).then(ChatMessage.parse),
        getMessages: async (options)=>client.get(`${baseUrl}/users/me/rooms/messages`, options)
    });
class IndirectTransfer {
    status;
    id;
    sourceId;
    destinationId;
    constructor({ sourceId, destinationId, status, id }){
        this.sourceId = sourceId;
        this.destinationId = destinationId;
        this.status = status;
        this.id = id;
    }
    static parseFromCallSession(source, destination) {
        return new IndirectTransfer({
            sourceId: source.getId(),
            destinationId: destination.getId()
        });
    }
    static parseFromApi(plain) {
        return new IndirectTransfer({
            id: plain.id,
            status: plain.status,
            sourceId: plain.initiator_call,
            destinationId: plain.recipient_call
        });
    }
    destinationIs(callSession) {
        return callSession.isId(this.destinationId);
    }
    sourceIs(callSession) {
        return callSession.isId(this.sourceId);
    }
    updateFrom(indirectTransfer) {
        update_from(this, indirectTransfer);
    }
    static newFrom(indirectTransfer) {
        return new_from(indirectTransfer, IndirectTransfer);
    }
}
class MeetingStatus {
    type;
    full;
    constructor({ full } = {}){
        this.full = full;
        this.type = 'MeetingStatus';
    }
    static parse(plain) {
        return new MeetingStatus({
            full: plain.full
        });
    }
}
const calld = (client, baseUrl)=>({
        updatePresence: (presence)=>client.put(`${baseUrl}/users/me/presences`, {
                presence
            }, null, ApiRequester.successResponseParser),
        listMessages: (participantUuid, limit)=>{
            const query = {};
            if (participantUuid) query.participant_user_uuid = participantUuid;
            if (limit) query.limit = limit;
            return client.get(`${baseUrl}/users/me/chats`, query).then((response)=>ChatMessage.parseMany(response));
        },
        sendMessage: (alias, msg, toUserId)=>{
            const body = {
                alias,
                msg,
                to: toUserId
            };
            return client.post(`${baseUrl}/users/me/chats`, body, null, ApiRequester.successResponseParser);
        },
        makeCall: (extension, fromMobile, lineId, allLines = false)=>{
            const query = {
                from_mobile: fromMobile,
                extension
            };
            if (lineId) query.line_id = lineId;
            if (allLines) query.all_lines = true;
            return client.post(`${baseUrl}/users/me/calls`, query);
        },
        cancelCall: (callId)=>client.delete(`${baseUrl}/users/me/calls/${callId}`, null),
        listCalls: ()=>client.get(`${baseUrl}/users/me/calls`, null).then((response)=>Call.parseMany(response.items)),
        relocateCall (callId, destination, lineId, contact) {
            const body = {
                completions: [
                    'answer'
                ],
                destination,
                initiator_call: callId,
                auto_answer: true
            };
            if (lineId || contact) body.location = {};
            if (lineId) body.location.line_id = lineId;
            if (contact) body.location.contact = contact;
            return client.post(`${baseUrl}/users/me/relocates`, body).then((response)=>domain_Relocation.parse(response));
        },
        listVoicemails: ()=>client.get(`${baseUrl}/users/me/voicemails`).then((response)=>Voicemail.parseMany(response)),
        listVoicemailsMessages: (params = {})=>client.get({
                path: `${baseUrl}/users/me/voicemails/messages`,
                body: params
            }).then((response)=>params.raw ? response : Voicemail.parseListData(response)),
        deleteVoicemail: (voicemailId)=>client.delete(`${baseUrl}/users/me/voicemails/messages/${voicemailId}`),
        getVoicemailUrl: (voicemail)=>{
            const body = {
                token: client.token
            };
            return client.computeUrl('get', `${baseUrl}/users/me/voicemails/messages/${voicemail.id}/recording`, body);
        },
        updateVoicemailFolder: (voicemail, folder)=>client.put(`${baseUrl}/users/me/voicemails/messages/${voicemail.id}`, {
                folder_id: Voicemail.getFolderMappingFromType(folder)
            }, null, ApiRequester.successResponseParser),
        fetchSwitchboardHeldCalls: (switchboardUuid)=>client.get(`${baseUrl}/switchboards/${switchboardUuid}/calls/held`),
        holdSwitchboardCall: (switchboardUuid, callId)=>client.put(`${baseUrl}/switchboards/${switchboardUuid}/calls/held/${callId}`, null, null, ApiRequester.successResponseParser),
        answerSwitchboardHeldCall: (switchboardUuid, callId, lineId = null)=>client.put(`${baseUrl}/switchboards/${switchboardUuid}/calls/held/${callId}/answer${lineId ? `?line_id=${lineId}` : ''}`),
        fetchSwitchboardQueuedCalls: (switchboardUuid)=>client.get(`${baseUrl}/switchboards/${switchboardUuid}/calls/queued`),
        answerSwitchboardQueuedCall: (switchboardUuid, callId, lineId = null)=>client.put(`${baseUrl}/switchboards/${switchboardUuid}/calls/queued/${callId}/answer${lineId ? `?line_id=${lineId}` : ''}`),
        sendFax: (extension, fax, callerId)=>{
            const headers = {
                'Content-type': 'application/pdf',
                'X-Auth-Token': client.token
            };
            const params = ApiRequester.getQueryString({
                extension,
                caller_id: callerId
            });
            return client.post(`${baseUrl}/users/me/faxes?${params}`, fax, headers);
        },
        getConferenceParticipantsAsUser: async (conferenceId)=>client.get(`${baseUrl}/users/me/conferences/${conferenceId}/participants`),
        getMeetingParticipantsAsUser: async (meetingUuid)=>client.get(`${baseUrl}/users/me/meetings/${meetingUuid}/participants`),
        banMeetingParticipant: (meetingUuid, participantUuid)=>client.delete(`${baseUrl}/users/me/meetings/${meetingUuid}/participants/${participantUuid}`, null, null, ApiRequester.successResponseParser),
        listTrunks: ()=>client.get(`${baseUrl}/trunks`),
        mute: (callId)=>client.put(`${baseUrl}/users/me/calls/${callId}/mute/start`, null, null, ApiRequester.successResponseParser),
        unmute: (callId)=>client.put(`${baseUrl}/users/me/calls/${callId}/mute/stop`, null, null, ApiRequester.successResponseParser),
        hold: (callId)=>client.put(`${baseUrl}/users/me/calls/${callId}/hold/start`, null, null, ApiRequester.successResponseParser),
        resume: (callId)=>client.put(`${baseUrl}/users/me/calls/${callId}/hold/stop`, null, null, ApiRequester.successResponseParser),
        transferCall: (initiator_call, exten, flow)=>client.post(`${baseUrl}/users/me/transfers`, {
                initiator_call,
                exten,
                flow
            }).then(IndirectTransfer.parseFromApi),
        confirmCallTransfer: (transferId)=>client.put(`${baseUrl}/users/me/transfers/${transferId}/complete`, null, null, ApiRequester.successResponseParser),
        cancelCallTransfer: (transferId)=>client.delete(`${baseUrl}/users/me/transfers/${transferId}`, null, null, ApiRequester.successResponseParser),
        sendDTMF: (callId, digits)=>client.put(`${baseUrl}/users/me/calls/${callId}/dtmf?digits=${encodeURIComponent(digits)}`, null, null, ApiRequester.successResponseParser),
        isAhHocConferenceAPIEnabled: ()=>client.head(`${baseUrl}/users/me/conferences/adhoc`, null, null, ApiRequester.successResponseParser),
        createAdHocConference: (hostCallId, participantCallIds)=>client.post(`${baseUrl}/users/me/conferences/adhoc`, {
                host_call_id: hostCallId,
                participant_call_ids: participantCallIds
            }),
        addAdHocConferenceParticipant: (conferenceId, callId)=>client.put(`${baseUrl}/users/me/conferences/adhoc/${conferenceId}/participants/${callId}`, null, null, ApiRequester.successResponseParser),
        removeAdHocConferenceParticipant: (conferenceId, participantCallId)=>client.delete(`${baseUrl}/users/me/conferences/adhoc/${conferenceId}/participants/${participantCallId}`, null, null, ApiRequester.successResponseParser),
        deleteAdHocConference: (conferenceId)=>client.delete(`${baseUrl}/users/me/conferences/adhoc/${conferenceId}`, null, null, ApiRequester.successResponseParser),
        startRecording: (callId)=>client.put(`${baseUrl}/users/me/calls/${callId}/record/start`, null, null, ApiRequester.successResponseParser),
        stopRecording: (callId)=>client.put(`${baseUrl}/users/me/calls/${callId}/record/stop`, null, null, ApiRequester.successResponseParser),
        pauseRecording: (callId)=>client.put(`${baseUrl}/users/me/calls/${callId}/record/pause`, null, null, ApiRequester.successResponseParser),
        resumeRecording: (callId)=>client.put(`${baseUrl}/users/me/calls/${callId}/record/resume`, null, null, ApiRequester.successResponseParser),
        guestGetMeetingStatus: (meetingUuid)=>client.get(`${baseUrl}/guests/me/meetings/${meetingUuid}/status`).then(MeetingStatus.parse)
    });
class Agent {
    context;
    extension;
    id;
    logged;
    number;
    originUuid;
    paused;
    pausedReason;
    queues;
    stateInterface;
    tenantUuid;
    static parse(plain) {
        return new Agent({
            context: plain.context,
            extension: plain.extension,
            id: plain.id,
            logged: plain.logged,
            number: plain.number,
            originUuid: plain.origin_uuid ?? '',
            paused: plain.paused,
            pausedReason: plain.paused_reason,
            queues: plain.queues ? plain.queues.map((queue)=>({
                    displayName: queue.display_name,
                    id: queue.id,
                    logged: queue.logged,
                    name: queue.name,
                    paused: queue.paused,
                    pausedReason: queue.paused_reason
                })) : [],
            stateInterface: plain.state_interface ?? '',
            tenantUuid: plain.tenant_uuid ?? ''
        });
    }
    constructor({ context, extension, id, logged, number, originUuid = '', paused, pausedReason, queues = [], stateInterface = '', tenantUuid = '' }){
        this.context = context;
        this.extension = extension;
        this.id = id;
        this.logged = logged;
        this.number = number;
        this.originUuid = originUuid;
        this.paused = paused;
        this.pausedReason = pausedReason;
        this.queues = queues;
        this.stateInterface = stateInterface;
        this.tenantUuid = tenantUuid;
    }
}
const domain_Agent = Agent;
const agentd = (client, baseUrl)=>({
        getAgent: (agentId)=>client.get(`${baseUrl}/agents/by-id/${agentId}`, null).then(domain_Agent.parse),
        login: (agentNumber, context, extension)=>client.post(`${baseUrl}/agents/by-number/${agentNumber}/login`, {
                context,
                extension
            }, null, ApiRequester.successResponseParser),
        loginWithLineId: (lineId)=>client.post(`${baseUrl}/users/me/agents/login`, {
                line_id: lineId
            }, null, ApiRequester.successResponseParser),
        logout: (agentNumber)=>client.post(`${baseUrl}/agents/by-number/${agentNumber}/logoff`, null, null, ApiRequester.successResponseParser),
        pause: (agentNumber, reason = 'songbird_reason')=>client.post(`${baseUrl}/agents/by-number/${agentNumber}/pause`, {
                reason
            }, null, ApiRequester.successResponseParser),
        resume: (agentNumber)=>client.post(`${baseUrl}/agents/by-number/${agentNumber}/unpause`, null, null, ApiRequester.successResponseParser),
        getStatus: ()=>client.get(`${baseUrl}/users/me/agents`, null).then(domain_Agent.parse),
        staticLogout: ()=>client.post(`${baseUrl}/users/me/agents/logoff`, null, null, ApiRequester.successResponseParser),
        staticPause: (reason = 'songbird_reason')=>client.post(`${baseUrl}/users/me/agents/pause`, {
                reason
            }, null, ApiRequester.successResponseParser),
        staticResume: ()=>client.post(`${baseUrl}/users/me/agents/unpause`, null, null, ApiRequester.successResponseParser),
        loginToQueue: (queueId)=>client.put(`${baseUrl}/users/me/agents/queues/${queueId}/login`, null, null, ApiRequester.successResponseParser),
        logoffFromQueue: (queueId)=>client.put(`${baseUrl}/users/me/agents/queues/${queueId}/logoff`, null, null, ApiRequester.successResponseParser)
    });
class Subscription {
    name;
    events;
    config;
    uuid;
    service;
    eventsUserUuid;
    eventsWazoUuid;
    metadata;
    ownerTenantUuid;
    ownerUserUuid;
    static parse(plain) {
        return new Subscription({
            name: plain.name,
            events: plain.events,
            config: plain.config,
            uuid: plain.uuid,
            service: plain.service,
            eventsUserUuid: plain.events_user_uuid,
            eventsWazoUuid: plain.events_wazo_uuid,
            metadata: plain.metadata,
            ownerTenantUuid: plain.owner_tenant_uuid,
            ownerUserUuid: plain.owner_user_uuid
        });
    }
    static parseMany(response) {
        return response.items.map((payload)=>Subscription.parse(payload));
    }
    constructor({ name, events, config, uuid, service, eventsUserUuid, eventsWazoUuid, metadata, ownerTenantUuid, ownerUserUuid }){
        this.name = name;
        this.events = events;
        this.config = config;
        this.uuid = uuid;
        this.service = service;
        this.eventsUserUuid = eventsUserUuid;
        this.eventsWazoUuid = eventsWazoUuid;
        this.metadata = metadata;
        this.ownerTenantUuid = ownerTenantUuid;
        this.ownerUserUuid = ownerUserUuid;
    }
}
const domain_Subscription = Subscription;
const webhookd = (client, baseUrl)=>({
        getSubscriptions: ()=>client.get(`${baseUrl}/users/me/subscriptions`).then(domain_Subscription.parseMany),
        getSubscription: (uuid)=>client.get(`${baseUrl}/users/me/subscriptions/${uuid}`).then(domain_Subscription.parse),
        createSubscription: (payload)=>client.post(`${baseUrl}/users/me/subscriptions`, payload),
        removeSubscription: (uuid)=>client.delete(`${baseUrl}/users/me/subscriptions/${uuid}`)
    });
const amid = (client, baseUrl)=>({
        action: (action, args = {})=>client.post(`${baseUrl}/action/${action}`, args),
        getAors: async (endpoint)=>{
            try {
                const rawEvents = await client.post(`${baseUrl}/action/PJSIPShowEndpoint`, {
                    Endpoint: endpoint
                }) || [];
                if (!rawEvents) return [];
                return rawEvents.filter((event)=>'ContactStatusDetail' === event.Event);
            } catch  {
                return [];
            }
        }
    });
const AUTH_VERSION = '0.1';
const APPLICATION_VERSION = '1.0';
const CONFD_VERSION = '1.1';
const CTIDNG_VERSION = '1.0';
const DIRD_VERSION = '0.1';
const CALL_LOGD_VERSION = '1.0';
const CHATD_VERSION = '1.0';
const CALLD_VERSION = '1.0';
const AGENTD_VERSION = '1.0';
const WEBHOOKD_VERSION = '1.0';
const AMID_VERSION = '1.0';
const swarmPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmkXOuNfY8u5xoTiIhkb8
djnbIwG/Wrz3vpo8BZir8L5e1a1nSy740qBjP7ZINBQoALDhFfmdOfJnCyEGiHuz
ZW6jbG6C3PryE3Bu6GKwqSmD6k3q4Zk27fpwYAnNl+rWhYYM563rJZBda/INyHNN
pK7M1mixWi7gNdjjXwoEXSSBx+VpYMkY6LiAB2mvHXTY9M1qI14dvgGoQISZQoKi
NMTRCg5UP2ic0Dd9nSz/XpcOxGfa+0fwIl1F7RC1tJXOqvkGGPTOV4LLfg/Yta3h
nUPX9EZZDIX6vO/0IBV1LzjSl2A1bYFYAjJfowv3i1CpvONBOClHjSY5t9Y8MH6p
BwIDAQAB
-----END PUBLIC KEY-----`;
const pubkey = swarmPublicKey;
const BACKEND = {
    OFFICE365: 'office365',
    PERSONAL: 'personal',
    GOOGLE: 'google',
    WAZO: 'wazo',
    CONFERENCE: 'conference',
    PHONEBOOK: 'phonebook'
};
const SOURCE_MOBILE = 'mobile';
class Contact {
    static BACKEND = BACKEND;
    type;
    id;
    uuid;
    name;
    firstName;
    lastName;
    external;
    number;
    numbers;
    favorited;
    email;
    emails;
    entreprise;
    birthday;
    address;
    note;
    endpointId;
    personal;
    state;
    lineState;
    previousPresential;
    lastActivity;
    mobile;
    source;
    sourceId;
    status;
    backend;
    personalStatus;
    sessions;
    connected;
    doNotDisturb;
    ringing;
    lines;
    static merge(oldContacts, newContacts) {
        return newContacts.map((current)=>{
            const old = oldContacts.find((contact)=>contact && contact.is(current));
            return old ? current.merge(old) : current;
        });
    }
    static sortContacts(a, b) {
        const aNames = a.separateName();
        const bNames = b.separateName();
        const aLastName = aNames.lastName;
        const bLastName = bNames.lastName;
        if (aLastName === bLastName) return aNames.firstName.localeCompare(bNames.firstName);
        return aLastName.localeCompare(bLastName);
    }
    static parseMany(response, offset = 0, limit = null) {
        if (!response || !response.results || 0 === limit) return [];
        const results = null !== limit && limit > 0 ? response.results.slice(offset, limit) : offset > 0 ? response.results.slice(offset) : response.results;
        return results.map((r)=>Contact.parse(r, response.column_types));
    }
    static manyGraphQlWithNumbersParser(numbers) {
        return (response)=>{
            if (!response.data || !response.data.me || !response.data.me.contacts) return [];
            return response.data.me.contacts.edges.map((edge, i)=>{
                if (!edge.node) return null;
                const { email } = edge.node;
                const name = edge.node.firstname && edge.node.lastname ? `${edge.node.firstname || ''} ${edge.node.lastname || ''}` : edge.node.wazoReverse;
                return new Contact({
                    name,
                    firstName: edge.node.firstname,
                    lastName: edge.node.lastname,
                    number: numbers[i],
                    numbers: [
                        {
                            label: 'primary',
                            number: numbers[i]
                        }
                    ],
                    backend: edge.node.wazoBackend,
                    source: edge.node.wazoSourceName,
                    sourceId: edge.node.wazoSourceEntryId || '',
                    email: email || '',
                    emails: email ? [
                        {
                            label: 'primary',
                            email
                        }
                    ] : [],
                    uuid: edge.node.userUuid
                });
            }).filter((contact)=>!!contact);
        };
    }
    static fetchNumbers(plain, columns) {
        const numberColumns = columns.map((e, index)=>({
                index,
                columnName: e
            })).filter((e)=>'number' === e.columnName || 'callable' === e.columnName).map((e)=>e.index);
        return plain.column_values.filter((e, index)=>numberColumns.some((i)=>i === index) && null !== e);
    }
    static parse(plain, columns) {
        const numbers = Contact.fetchNumbers(plain, columns);
        const email = plain.column_values[columns.indexOf('email')];
        return new Contact({
            name: plain.column_values[columns.indexOf('name')],
            firstName: plain.column_values[columns.indexOf('firstname')],
            lastName: plain.column_values[columns.indexOf('lastname')],
            number: numbers.length ? numbers[0] : '',
            numbers: numbers.map((number, i)=>({
                    label: 0 === i ? 'primary' : 'secondary',
                    number
                })),
            favorited: plain.column_values[columns.indexOf('favorite')],
            email: email || '',
            emails: email ? [
                {
                    label: 'primary',
                    email
                }
            ] : [],
            entreprise: plain.column_values[columns.indexOf('entreprise')] || '',
            birthday: plain.column_values[columns.indexOf('birthday')] || '',
            address: plain.column_values[columns.indexOf('address')] || '',
            note: plain.column_values[columns.indexOf('note')] || '',
            endpointId: plain.relations.endpoint_id,
            personal: plain.column_values[columns.indexOf('personal')],
            source: plain.source,
            sourceId: plain.relations.source_entry_id || '',
            uuid: plain.relations.user_uuid,
            backend: plain.backend || ''
        });
    }
    static parseManyPersonal(results) {
        return results.map((r)=>Contact.parsePersonal(r));
    }
    static parsePersonal(plain) {
        return new Contact({
            name: `${plain.firstName || plain.firstname || ''} ${plain.lastName || plain.lastname || ''}`,
            firstName: plain.firstName || plain.firstname,
            lastName: plain.lastName || plain.lastname,
            number: plain.number || '',
            numbers: plain.number ? [
                {
                    label: 'primary',
                    number: plain.number
                }
            ] : [],
            email: plain.email || '',
            emails: plain.email ? [
                {
                    label: 'primary',
                    email: plain.email
                }
            ] : [],
            source: 'personal',
            sourceId: plain.id || '',
            entreprise: plain.entreprise || '',
            birthday: plain.birthday || '',
            address: plain.address || '',
            note: plain.note || '',
            favorited: plain.favorited,
            personal: true,
            backend: plain.backend || BACKEND.PERSONAL
        });
    }
    static parseMobile(plain) {
        let address = '';
        if (plain.postalAddresses.length) {
            const postalAddress = plain.postalAddresses[0];
            address = `${postalAddress.street} ${postalAddress.city} ${postalAddress.postCode} ${postalAddress.country}`;
        }
        const firstName = plain.givenName || '';
        const lastName = plain.familyName || '';
        const companyName = plain.company || '';
        const isCompanyAccount = !firstName && !lastName;
        const name = isCompanyAccount ? companyName : `${firstName} ${lastName}`;
        return new Contact({
            name,
            firstName,
            lastName,
            number: plain.phoneNumbers.length ? plain.phoneNumbers[0].number : '',
            numbers: [
                ...new Map(plain.phoneNumbers.map((item)=>[
                        item.number,
                        item
                    ])).values()
            ].map((item, idx)=>({
                    label: 0 === idx ? 'primary' : 'secondary',
                    number: item.number
                })),
            email: plain.emailAddresses.length ? plain.emailAddresses[0].email : '',
            emails: plain.emailAddresses.length ? [
                {
                    label: 'primary',
                    email: plain.emailAddresses[0].email
                }
            ] : [],
            source: SOURCE_MOBILE,
            sourceId: plain.recordID || '',
            birthday: plain.birthday ? `${plain.birthday.year}-${plain.birthday.month}-${plain.birthday.day}` : '',
            address,
            note: plain.note || '',
            favorited: false,
            personal: true
        });
    }
    static parseManyOffice365(response, source) {
        return response.map((r)=>Contact.parseOffice365(r, source));
    }
    static parseOffice365(single, source) {
        const emails = [];
        const numbers = [];
        if (single.emailAddresses) single.emailAddresses.map((email)=>emails.push({
                email: email.address
            }));
        if (single.businessPhones) single.businessPhones.map((phone)=>numbers.push({
                label: 'business',
                number: phone
            }));
        if (single.mobilePhone) numbers.push({
            label: 'mobile',
            number: single.mobilePhone
        });
        if (single.homePhones) single.homePhones.map((phone)=>numbers.push({
                label: 'home',
                number: phone
            }));
        return new Contact({
            sourceId: single.id || '',
            name: single.displayName || '',
            firstName: single.givenName,
            lastName: single.surname,
            number: numbers.length ? numbers[0].number : '',
            numbers,
            emails,
            source: source.name,
            backend: BACKEND.OFFICE365
        });
    }
    static parseManyGoogle(response, source) {
        return response.map((r)=>Contact.parseGoogle(r, source));
    }
    static parseGoogle(single, source) {
        const emails = [];
        const numbers = [];
        if (single.emails) single.emails.forEach((email)=>'object' == typeof email ? {
                email: email.address,
                label: email.label
            } : {
                email
            });
        if (single.numbers_by_label) Object.keys(single.numbers_by_label).forEach((label)=>numbers.push({
                label,
                number: single.numbers_by_label[label]
            }));
        else if (single.numbers) single.numbers.forEach((phone)=>numbers.push({
                number: phone
            }));
        return new Contact({
            sourceId: single.id || '',
            name: single.name || '',
            firstName: single.firstname || '',
            lastName: single.lastname || '',
            number: numbers.length ? numbers[0].number : '',
            numbers,
            emails,
            source: source.name,
            backend: BACKEND.GOOGLE
        });
    }
    static parseManyWazo(response, source) {
        return response.map((r)=>Contact.parseWazo(r, source));
    }
    static parseWazo(single, source) {
        const emails = [];
        const numbers = [];
        if (single.email) emails.push({
            label: 'email',
            email: single.email
        });
        if (single.exten) numbers.push({
            label: 'exten',
            number: single.exten
        });
        if (single.mobile_phone_number) numbers.push({
            label: 'mobile',
            number: single.mobile_phone_number
        });
        return new Contact({
            uuid: single.uuid,
            sourceId: String(single.id) || '',
            name: `${single.firstname}${single.lastname ? ` ${single.lastname}` : ''}`,
            firstName: single.firstname,
            lastName: single.lastname,
            number: numbers.length ? numbers[0].number : '',
            numbers,
            emails,
            source: source.name,
            backend: BACKEND.WAZO
        });
    }
    static parseManyConference(response, source) {
        return response.map((r)=>Contact.parseConference(r, source));
    }
    static parseConference(single, source) {
        const numbers = [];
        let firstNumber = '';
        if (single && single.extensions && single.extensions.length > 0 && single.extensions[0].exten) {
            firstNumber = single.extensions[0].exten;
            numbers.push({
                label: 'exten',
                number: firstNumber
            });
        }
        return new Contact({
            sourceId: String(single.id),
            name: single.name,
            number: firstNumber,
            numbers,
            source: source.name,
            backend: BACKEND.CONFERENCE
        });
    }
    static newFrom(contact) {
        return new_from(contact, Contact);
    }
    constructor({ id, uuid, name, firstName, lastName, external, number, numbers, email, emails, source, sourceId, entreprise, birthday, address, note, state, lineState, lastActivity, mobile, status, endpointId, personal, favorited, backend, personalStatus, sessions, connected, doNotDisturb, ringing, previousPresential, lines } = {}){
        this.id = id;
        this.uuid = uuid;
        this.name = name || '';
        this.firstName = firstName || '';
        this.lastName = lastName || '';
        this.external = external || false;
        this.number = number;
        this.numbers = numbers;
        this.email = email;
        this.emails = emails;
        this.source = source;
        this.sourceId = sourceId;
        this.entreprise = entreprise;
        this.birthday = birthday;
        this.address = address;
        this.note = note;
        this.state = state;
        this.lineState = lineState;
        this.lastActivity = lastActivity;
        this.mobile = mobile;
        this.status = status;
        this.endpointId = endpointId;
        this.personal = personal;
        this.favorited = favorited;
        this.backend = backend;
        this.personalStatus = personalStatus || '';
        this.sessions = sessions || [];
        this.connected = connected;
        this.doNotDisturb = doNotDisturb;
        this.ringing = ringing;
        this.previousPresential = previousPresential;
        this.lines = lines || [];
        this.type = 'Contact';
    }
    setFavorite(value) {
        this.favorited = value;
        return this;
    }
    is(other) {
        const sameSourceId = null !== this.sourceId && null !== other.sourceId && this.sourceId === other.sourceId;
        const sameUuid = !!this.uuid && !!other.uuid && this.uuid === other.uuid;
        const hasSameId = sameSourceId || sameUuid;
        const hasSameBackend = !!this.backend && !!other.backend && this.backend === other.backend;
        const hasSameSource = !!this.source && !!other.source && this.source === other.source;
        return !!other && hasSameId && hasSameBackend && hasSameSource;
    }
    hasId(id) {
        return this.uuid === id;
    }
    hasNumber(number) {
        return this.number === number;
    }
    hasEndpointId(endpointId) {
        return this.endpointId === endpointId;
    }
    isAvailable() {
        return this.state === STATE.AVAILABLE;
    }
    isAway() {
        return this.state === STATE.AWAY;
    }
    isUnavailable() {
        return this.state === STATE.UNAVAILABLE;
    }
    isInvisible() {
        return this.state === STATE.INVISIBLE;
    }
    isInCall() {
        return this.lineState === LINE_STATE.TALKING || this.lineState === LINE_STATE.HOLDING;
    }
    isRinging() {
        return this.ringing;
    }
    isInUseOrRinging() {
        return this.lineState === LINE_STATE.TALKING || this.lineState === LINE_STATE.RINGING;
    }
    isProgressing() {
        return this.lineState === LINE_STATE.PROGRESSING;
    }
    merge(old) {
        Object.keys(old).filter((key)=>'lineState' !== key).forEach((key)=>{
            this[key] = old[key] || this[key];
        });
        if (old.lineState) this.lineState = old.lineState;
        return this;
    }
    isIntern() {
        return !!this.uuid;
    }
    hasSourceId() {
        return !!this.sourceId;
    }
    isCallable(session) {
        return !!this.number && !!session && !session.is(this);
    }
    isFromMobile() {
        return this.source === SOURCE_MOBILE;
    }
    isFavorite() {
        return this.favorited;
    }
    separateName() {
        if (!this.name) return {
            firstName: '',
            lastName: ''
        };
        const names = this.name.split(/\s+/);
        const firstName = names[0];
        const lastName = names.slice(1).join(' ');
        return {
            firstName,
            lastName
        };
    }
}
const compareVersions = (a, b)=>{
    let i;
    let diff;
    const regExStrip0 = /(\.0+)+$/;
    const segmentsA = a.replace(regExStrip0, '').split('.');
    const segmentsB = b.replace(regExStrip0, '').split('.');
    const l = Math.min(segmentsA.length, segmentsB.length);
    for(i = 0; i < l; i++){
        diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
        if (diff) return diff;
    }
    return segmentsA.length - segmentsB.length;
};
const compare_version = compareVersions;
const { jws } = __WEBPACK_EXTERNAL_MODULE_jsrsasign__.KJUR;
const swarmKey = __WEBPACK_EXTERNAL_MODULE_jsrsasign__.KEYUTIL.getKey(pubkey);
const MINIMUM_WAZO_ENGINE_VERSION_FOR_DEFAULT_CONTEXT = '19.08';
class Session {
    acl;
    contact;
    token;
    refreshToken;
    uuid;
    tenantUuid;
    stackUuid;
    sessionUuid;
    engineVersion;
    _stackHostFromHeader;
    profile;
    expiresAt;
    authorizations;
    metadata;
    static parse(plain) {
        const token = plain.data.metadata ? plain.data.metadata.jwt : null;
        let authorizations = [];
        if (token) {
            const isValid = jws.JWS.verifyJWT(token, swarmKey, {
                alg: [
                    'RS256'
                ],
                verifyAt: new Date()
            });
            if (isValid) {
                const decodedToken = jws.JWS.readSafeJSONString((0, __WEBPACK_EXTERNAL_MODULE_jsrsasign__.b64utoutf8)(token.split('.')[1]));
                authorizations = decodedToken ? decodedToken.authorizations : [];
            }
        }
        return new Session({
            token: plain.data.token,
            refreshToken: plain.data.refresh_token || null,
            uuid: plain.data.metadata ? plain.data.metadata.uuid : null,
            sessionUuid: plain.data.session_uuid,
            authorizations,
            acl: plain.data.acls ? plain.data.acls : plain.data.acl ? plain.data.acl : [],
            tenantUuid: plain.data.metadata ? plain.data.metadata.tenant_uuid : void 0,
            expiresAt: __WEBPACK_EXTERNAL_MODULE_moment__["default"].utc(plain.data.utc_expires_at).toDate(),
            stackUuid: plain.data.xivo_uuid,
            metadata: plain.data.metadata,
            stackHostFromHeader: plain._headers?.get?.('wazo-stack-host')
        });
    }
    static newFrom(profile) {
        return new_from(profile, Session);
    }
    constructor({ token, uuid, tenantUuid, profile, expiresAt, authorizations, acl, engineVersion, refreshToken, sessionUuid, stackUuid, metadata, stackHostFromHeader }){
        this.token = token;
        this.uuid = uuid;
        this.tenantUuid = tenantUuid || null;
        this.profile = profile;
        this.expiresAt = expiresAt;
        this.authorizations = authorizations || [];
        this.acl = acl || [];
        this.engineVersion = engineVersion;
        this.refreshToken = refreshToken;
        this.sessionUuid = sessionUuid;
        this.stackUuid = stackUuid;
        this.metadata = metadata;
        this._stackHostFromHeader = stackHostFromHeader;
    }
    hasExpired(date = new Date()) {
        return date >= this.expiresAt;
    }
    is(contact) {
        return Boolean(contact) && this.uuid === contact.uuid;
    }
    using(profile) {
        this.profile = profile;
        return this;
    }
    hasAuthorizations() {
        return this.authorizations && !!this.authorizations.length;
    }
    displayName() {
        return this.profile ? `${this.profile.firstName} ${this.profile.lastName}` : '';
    }
    hasAccessToVoicemail() {
        if (!this.profile) return false;
        return !!this.profile.voicemail;
    }
    primaryLine() {
        return this.profile && this.profile.lines.length > 0 ? this.profile.lines[0] : null;
    }
    primarySipLine() {
        return this.profile && this.profile.sipLines.length > 0 ? this.profile.sipLines[0] : null;
    }
    primaryWebRtcLine() {
        return this.profile && (this.profile.sipLines || []).find((sipLine)=>sipLine && sipLine.isWebRtc());
    }
    primaryCtiLine() {
        return this.profile && (this.profile.sipLines || []).find((sipLine)=>sipLine && !sipLine.isWebRtc());
    }
    getContact() {
        if (this.contact) return this.contact;
        const { email, firstName, lastName, mobileNumber, state, status } = this.profile || {};
        const number = this.primaryNumber() || '';
        const numbers = [
            {
                label: 'primary',
                number
            }
        ];
        if (mobileNumber) numbers.push({
            label: 'mobile',
            number: mobileNumber
        });
        return new Contact({
            uuid: this.uuid || '',
            email,
            name: `${firstName} ${lastName}`,
            number,
            numbers,
            state: state || '',
            status,
            backend: 'wazo',
            source: 'default'
        });
    }
    primaryContext() {
        if (this.engineVersion) {
            if (this.hasEngineVersionGte(MINIMUM_WAZO_ENGINE_VERSION_FOR_DEFAULT_CONTEXT)) return 'default';
        }
        const line = this.primaryLine();
        return line && Array.isArray(line.extensions) && line.extensions.length > 0 ? line.extensions[0].context : 'default';
    }
    hasEngineVersionGte(version) {
        return !!this.engineVersion && compare_version(String(this.engineVersion), String(version)) >= 0;
    }
    primaryNumber() {
        const line = this.primaryLine();
        return line && Array.isArray(line.extensions) && line.extensions.length ? line.extensions[0].exten : null;
    }
    allLines() {
        return this.profile ? this.profile.lines || [] : [];
    }
    allNumbers() {
        const extensions = this.allLines().map((line)=>line.extensions?.map((extension)=>extension.exten) || []);
        if (!extensions.length) return [];
        return extensions.reduce((a, b)=>a.concat(b));
    }
    hasExtension(extension) {
        return this.allNumbers().some((number)=>number === extension);
    }
    getHostFromHeader() {
        return this._stackHostFromHeader;
    }
    get acls() {
        console.warn('`acls` property of Session has been removed in Wazo\'s SDK, please use `acl` instead.');
        return this.acl;
    }
    get engineUuid() {
        console.warn('`engineUuid` property of Session has been removed in Wazo\'s SDK, please use `stackUuid` instead.');
        return this.stackUuid;
    }
    toJSON() {
        return {
            ...this,
            engineUuid: this.stackUuid
        };
    }
}
const DEFAULT_BACKEND_USER = 'wazo_user';
const BACKEND_LDAP_USER = 'ldap_user';
const DETAULT_EXPIRATION = 3600;
const auth = (client, baseUrl)=>({
        checkToken: (token)=>client.head(`${baseUrl}/token/${token}`, null, {}),
        authenticate: (token)=>client.get(`${baseUrl}/token/${token}`, null, {}).then((response)=>Session.parse(response)),
        logIn (params) {
            const body = {
                backend: params.backend || DEFAULT_BACKEND_USER,
                expiration: params.expiration || DETAULT_EXPIRATION
            };
            const headers = {
                Authorization: `Basic ${ApiRequester.base64Encode(`${params.username}:${params.password}`)}`,
                'Content-Type': 'application/json',
                ...params.headers || {}
            };
            if (client.clientId) {
                body.access_type = 'offline';
                body.client_id = client.clientId;
            }
            if (params.mobile) headers['Wazo-Session-Type'] = 'mobile';
            if (params.tenantId) {
                console.warn('Use of `tenantId` is deprecated when calling logIn() method, use `domainName` instead.');
                body.tenant_id = params.tenantId;
            }
            if (params.domainName) body.domain_name = params.domainName;
            return client.post(`${baseUrl}/token`, body, headers).then((response)=>Session.parse(response));
        },
        logOut: (token)=>client.delete(`${baseUrl}/token/${token}`, null, {}, ApiRequester.successResponseParser),
        samlLogIn: async (samlSessionId)=>{
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            };
            const body = {
                saml_session_id: samlSessionId
            };
            if (client.clientId) {
                body.access_type = 'offline';
                body.client_id = client.clientId;
            }
            if (Wazo.Auth.mobile) headers['Wazo-Session-Type'] = 'mobile';
            return client.post(`${baseUrl}/token`, body, headers).then(Session.parse);
        },
        samlLogOut () {
            return client.get(`${baseUrl}/saml/logout`, null, null);
        },
        initiateIdpAuthentication: async (domain, redirectUrl)=>{
            const body = {
                domain,
                redirect_url: redirectUrl
            };
            const headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            };
            return client.post(`${baseUrl}/saml/sso`, body, headers);
        },
        refreshToken: (refreshToken, backend, expiration, isMobile, tenantId, domainName)=>{
            const body = {
                backend: backend || DEFAULT_BACKEND_USER,
                expiration: expiration || DETAULT_EXPIRATION,
                refresh_token: refreshToken,
                client_id: client.clientId
            };
            if (tenantId) {
                console.warn('Use of `tenantId` is deprecated when calling refreshToken() method, use `domainName` instead.');
                body.tenant_id = tenantId;
            }
            if (domainName) body.domain_name = domainName;
            const headers = {
                'Content-Type': 'application/json',
                ...isMobile ? {
                    'Wazo-Session-Type': 'mobile'
                } : {}
            };
            return client.post(`${baseUrl}/token`, body, headers, ApiRequester.defaultParser, false).then(Session.parse);
        },
        deleteRefreshToken: (clientId)=>client.delete(`${baseUrl}/users/me/tokens/${clientId}`, null, null, ApiRequester.successResponseParser),
        updatePassword: (userUuid, oldPassword, newPassword)=>{
            const body = {
                new_password: newPassword,
                old_password: oldPassword
            };
            return client.put(`${baseUrl}/users/${userUuid}/password`, body, null, ApiRequester.successResponseParser);
        },
        getDeviceToken: (userUuid)=>client.get(`${baseUrl}/users/${userUuid}/external/mobile`),
        sendDeviceToken: (userUuid, deviceToken, apnsVoipToken, apnsNotificationToken)=>{
            const body = {
                token: deviceToken
            };
            if (apnsVoipToken) {
                body.apns_token = apnsVoipToken;
                body.apns_voip_token = apnsVoipToken;
            }
            if (apnsNotificationToken) body.apns_notification_token = apnsNotificationToken;
            return client.post(`${baseUrl}/users/${userUuid}/external/mobile`, body);
        },
        getPushNotificationSenderId: (userUuid)=>client.get(`${baseUrl}/users/${userUuid}/external/mobile/sender_id`, null).then((response)=>response.sender_id),
        sendResetPasswordEmail: ({ username, email })=>{
            const body = {};
            if (username) body.username = username;
            if (email) body.email = email;
            return client.get(`${baseUrl}/users/password/reset`, body, {}, ApiRequester.successResponseParser);
        },
        resetPassword: (userUuid, password)=>{
            const body = {
                password
            };
            return client.post(`${baseUrl}/users/password/reset?user_uuid=${userUuid}`, body, null, ApiRequester.successResponseParser);
        },
        removeDeviceToken: (userUuid)=>client.delete(`${baseUrl}/users/${userUuid}/external/mobile`),
        createUser: (username, password, firstname, lastname)=>{
            const body = {
                username,
                password,
                firstname,
                lastname
            };
            return client.post(`${baseUrl}/users`, body);
        },
        addUserEmail: (userUuid, email, main)=>{
            const body = {
                emails: [
                    {
                        address: email,
                        main
                    }
                ]
            };
            return client.put(`${baseUrl}/users/${userUuid}/emails`, body);
        },
        addUserPolicy: (userUuid, policyUuid)=>client.put(`${baseUrl}/users/${userUuid}/policies/${policyUuid}`),
        getRestrictionPolicies: (scopes)=>client.post(`${baseUrl}/token/${client.token}/scopes/check`, {
                scopes
            }),
        deleteUserPolicy: (userUuid, policyUuid)=>client.delete(`${baseUrl}/users/${userUuid}/policies/${policyUuid}`),
        addUserGroup: (userUuid, groupUuid)=>client.put(`${baseUrl}/groups/${groupUuid}/users/${userUuid}`),
        listUsersGroup: (groupUuid)=>client.get(`${baseUrl}/groups/${groupUuid}/users`),
        deleteUserGroup: (userUuid, groupUuid)=>client.delete(`${baseUrl}/groups/${groupUuid}/users/${userUuid}`),
        getUser: (userUuid)=>client.get(`${baseUrl}/users/${userUuid}`),
        getUserSession: (userUuid)=>client.get(`${baseUrl}/users/${userUuid}/sessions`),
        deleteUserSession: (userUuid, sessionUuids)=>client.delete(`${baseUrl}/users/${userUuid}/sessions/${sessionUuids}`),
        listUsers: ()=>client.get(`${baseUrl}/users`),
        deleteUser: (userUuid)=>client.delete(`${baseUrl}/users/${userUuid}`),
        listTenants: ()=>client.get(`${baseUrl}/tenants`),
        getTenant: (tenantUuid)=>client.get(`${baseUrl}/tenants/${tenantUuid}`),
        createTenant: (name)=>client.post(`${baseUrl}/tenants`, {
                name
            }),
        updateTenant: (uuid, name, contact, phone, address)=>{
            const body = {
                name,
                contact,
                phone,
                address
            };
            return client.put(`${baseUrl}/tenants/${uuid}`, body);
        },
        deleteTenant: (uuid)=>client.delete(`${baseUrl}/tenants/${uuid}`),
        createGroup: (name)=>client.post(`${baseUrl}/groups`, {
                name
            }),
        listGroups: ()=>client.get(`${baseUrl}/groups`),
        deleteGroup: (uuid)=>client.delete(`${baseUrl}/groups/${uuid}`),
        createPolicy: (name, description, aclTemplates)=>{
            const body = {
                name,
                description,
                acl_templates: aclTemplates,
                acl: aclTemplates
            };
            return client.post(`${baseUrl}/policies`, body);
        },
        listPolicies: ()=>client.get(`${baseUrl}/policies`),
        deletePolicy: (policyUuid)=>client.delete(`${baseUrl}/policies/${policyUuid}`),
        getProviders: (userUuid)=>client.get(`${baseUrl}/users/${userUuid}/external`),
        getProviderToken: (userUuid, provider)=>client.get(`${baseUrl}/users/${userUuid}/external/${provider}`),
        getProviderAuthUrl: (userUuid, provider)=>client.post(`${baseUrl}/users/${userUuid}/external/${provider}`, {}),
        deleteProviderToken: (userUuid, provider)=>client.delete(`${baseUrl}/users/${userUuid}/external/${provider}`)
    });
const base_api_client_logger = IssueReporter ? IssueReporter.loggerFor('api') : console;
class BaseApiClient {
    client;
    auth;
    refreshToken;
    onRefreshToken;
    onRefreshTokenError;
    refreshExpiration;
    refreshBackend;
    refreshTenantId;
    refreshDomainName;
    isMobile;
    fetchOptions;
    constructor({ server, agent = null, refreshToken, clientId, isMobile = false, fetchOptions }){
        this.updateParameters({
            server,
            agent,
            clientId,
            fetchOptions
        });
        this.refreshToken = refreshToken;
        this.isMobile = isMobile || false;
    }
    initializeEndpoints() {
        this.auth = auth(this.client, `auth/${AUTH_VERSION}`);
    }
    updateParameters({ server, agent, clientId, fetchOptions }) {
        const refreshTokenCallback = this.refreshTokenCallback.bind(this);
        this.client = new ApiRequester({
            server,
            agent,
            refreshTokenCallback,
            clientId,
            fetchOptions
        });
        this.initializeEndpoints();
    }
    async forceRefreshToken() {
        base_api_client_logger.info('forcing refresh token, calling callback');
        return this.refreshTokenCallback();
    }
    async refreshTokenCallback() {
        base_api_client_logger.info('refresh token callback called', {
            refreshToken: obfuscateToken(this.refreshToken),
            refreshBackend: this.refreshBackend,
            refreshTenantId: this.refreshTenantId,
            refreshDomainName: this.refreshDomainName,
            refreshExpiration: this.refreshExpiration,
            isMobile: this.isMobile
        });
        if (!this.refreshToken) return null;
        try {
            const session = await this.auth.refreshToken(this.refreshToken, this.refreshBackend, this.refreshExpiration, this.isMobile, this.refreshTenantId, this.refreshDomainName);
            if (!session) return null;
            base_api_client_logger.info('token refreshed', {
                token: obfuscateToken(session.token)
            });
            if (this.onRefreshToken) this.onRefreshToken(session.token, session);
            this.setToken(session.token);
            return session.token;
        } catch (error) {
            base_api_client_logger.error('token refresh, error', error);
            if (this.onRefreshTokenError) this.onRefreshTokenError(error);
        }
        return null;
    }
    setToken(token) {
        this.client.setToken(token);
    }
    setTenant(tenant) {
        this.client.setTenant(tenant);
    }
    setRefreshToken(refreshToken) {
        this.refreshToken = refreshToken;
    }
    setRequestTimeout(requestTimeout) {
        this.client.setRequestTimeout(requestTimeout);
    }
    setClientId(clientId) {
        this.client.clientId = clientId;
    }
    setOnRefreshToken(onRefreshToken) {
        this.onRefreshToken = onRefreshToken;
    }
    setOnRefreshTokenError(callback) {
        this.onRefreshTokenError = callback;
    }
    setRefreshExpiration(refreshExpiration) {
        this.refreshExpiration = refreshExpiration;
    }
    setRefreshBackend(refreshBackend) {
        this.refreshBackend = refreshBackend;
    }
    setRefreshTenantId(tenantId) {
        console.warn('Use of `setRefreshTenantId` is deprecated, use `setRefreshDomainName` instead');
        this.refreshTenantId = tenantId;
    }
    setRefreshDomainName(domainName) {
        this.refreshDomainName = domainName;
    }
    setIsMobile(isMobile) {
        this.isMobile = isMobile;
    }
    setFetchOptions(fetchOptions) {
        this.fetchOptions = fetchOptions;
        this.client.setFetchOptions(fetchOptions);
    }
    disableErrorLogging() {
        this.client.disableErrorLogging();
    }
}
class ApiClient extends BaseApiClient {
    application;
    confd;
    ctidNg;
    dird;
    callLogd;
    chatd;
    calld;
    agentd;
    webhookd;
    amid;
    constructor(args){
        super(args);
        this.initializeEndpoints();
    }
    initializeEndpoints() {
        super.initializeEndpoints();
        this.application = application(this.client, `calld/${APPLICATION_VERSION}/applications`);
        this.confd = confd(this.client, `confd/${CONFD_VERSION}`);
        this.ctidNg = ctid_ng(this.client, `ctid-ng/${CTIDNG_VERSION}`);
        this.dird = dird(this.client, `dird/${DIRD_VERSION}`);
        this.callLogd = call_logd(this.client, `call-logd/${CALL_LOGD_VERSION}`);
        this.chatd = chatd(this.client, `chatd/${CHATD_VERSION}`);
        this.calld = calld(this.client, `calld/${CALLD_VERSION}`);
        this.agentd = agentd(this.client, `agentd/${AGENTD_VERSION}`);
        this.webhookd = webhookd(this.client, `webhookd/${WEBHOOKD_VERSION}`);
        this.amid = amid(this.client, `amid/${AMID_VERSION}`);
    }
}
const api = {
    name: 'API',
    check: async (server, session)=>{
        const client = new ApiClient({
            server
        });
        client.setToken(session.token);
        client.disableErrorLogging();
        const handleApiError = (apiName, error)=>{
            const statusText = error instanceof ServerError ? 'server error' : 'api error';
            throw new Error(`${apiName} fails with status (${error.status}, ${statusText}) : ${error.message}`);
        };
        try {
            await client.auth.getPushNotificationSenderId(session.uuid);
            await client.auth.getProviders(session.uuid);
        } catch (e) {
            handleApiError('wazo-auth', e);
        }
        try {
            await client.callLogd.listCallLogs();
        } catch (e) {
            handleApiError('wazo-callogd', e);
        }
        try {
            await client.calld.listCalls();
        } catch (e) {
            handleApiError('wazo-calld', e);
        }
        try {
            await client.calld.listVoicemails();
        } catch (e) {
            if (404 !== e.status) handleApiError('wazo-calld', e);
        }
        try {
            await client.chatd.getState(session.uuid);
            await client.chatd.getContactStatusInfo(session.uuid);
            await client.chatd.getUserRooms();
        } catch (e) {
            handleApiError('wazo-chatd', e);
        }
        try {
            await client.confd.getInfos();
            await client.confd.getUser(session.uuid);
        } catch (e) {
            handleApiError('wazo-confd', e);
        }
        try {
            await client.dird.listPersonalContacts();
            await client.dird.listFavorites(session.primaryContext());
            await client.dird.fetchWazoSource(session.primaryContext());
            const conferenceSource = await client.dird.fetchConferenceSource(session.primaryContext());
            await client.dird.fetchConferenceContacts(conferenceSource.items[0]);
        } catch (e) {
            handleApiError('wazo-dird', e);
        }
        try {
            await client.webhookd.getSubscriptions();
        } catch (e) {
            handleApiError('wazo-webhookd', e);
        }
    }
};
const checks_aor = {
    name: 'List of AOR',
    check: async (server, session)=>{
        const apiClient = new ApiClient({
            server
        });
        apiClient.setToken(session.token);
        apiClient.disableErrorLogging();
        const line = session.primaryWebRtcLine();
        if (!line) return 'No WebRTC line for this user';
        const { username } = line;
        try {
            const aors = await apiClient.amid.getAors(username);
            const nbAors = aors.length;
            const availableAors = aors.filter((aor)=>'Reachable' === aor.status);
            return `Number of AOR: ${nbAors} (${availableAors.length} Avail, ${nbAors - availableAors.length} Unavail)`;
        } catch (e) {
            if (401 === e.status) return 'Not available for this user';
            throw e;
        }
    }
};
const DEFAULT_HEARTBEAT_DELAY = 2000;
const DEFAULT_HEARTBEAT_TIMEOUT = 5000;
const DEFAULT_MAX_HEARTBEATS = 3;
class Heartbeat_Heartbeat {
    heartbeatDelay;
    heartbeatTimeout;
    maxHeartbeats;
    hasHeartbeat;
    _heartbeatDelayTimeout;
    _heartbeatNotReceivedTimeout;
    _heartbeatTries;
    _sendHeartbeatCallback;
    _onTimeoutCallback;
    constructor(heartbeatDelay = DEFAULT_HEARTBEAT_DELAY, heartbeatTimeout = DEFAULT_HEARTBEAT_TIMEOUT, maxHeartbeats = DEFAULT_MAX_HEARTBEATS){
        this.heartbeatDelay = heartbeatDelay;
        this.heartbeatTimeout = heartbeatTimeout;
        this.maxHeartbeats = maxHeartbeats;
        this.hasHeartbeat = false;
        this._heartbeatTries = 0;
    }
    setSendHeartbeat(cb) {
        this._sendHeartbeatCallback = cb;
    }
    setOnHeartbeatTimeout(cb) {
        this._onTimeoutCallback = cb;
    }
    stop() {
        this.hasHeartbeat = false;
        if (this._heartbeatNotReceivedTimeout) clearTimeout(this._heartbeatNotReceivedTimeout);
        if (this._heartbeatDelayTimeout) clearTimeout(this._heartbeatDelayTimeout);
    }
    start() {
        this.stop();
        this.hasHeartbeat = true;
        this._heartbeatTries = 0;
        this._sendHeartbeat();
    }
    onHeartbeat() {
        this._clearTimeouts();
        if (!this.hasHeartbeat) return;
        this._sendHeartbeat();
    }
    _sendHeartbeat() {
        if (this._heartbeatTries >= this.maxHeartbeats) return;
        this._clearTimeouts();
        this._heartbeatDelayTimeout = setTimeout(()=>{
            this._heartbeatTries++;
            if (this._sendHeartbeatCallback) this._sendHeartbeatCallback();
        }, this.heartbeatDelay);
        if (this._onTimeoutCallback) this._heartbeatNotReceivedTimeout = setTimeout(this._onTimeoutCallback, this.heartbeatTimeout);
    }
    _clearTimeouts() {
        if (this._heartbeatNotReceivedTimeout) clearTimeout(this._heartbeatNotReceivedTimeout);
        if (this._heartbeatDelayTimeout) clearTimeout(this._heartbeatDelayTimeout);
    }
}
const Heartbeat = Heartbeat_Heartbeat;
const SOCKET_EVENTS = {
    ON_OPEN: 'onopen',
    ON_MESSAGE: 'onmessage',
    ON_ERROR: 'onerror',
    ON_CLOSE: 'onclose',
    INITIALIZED: 'initialized',
    ON_AUTH_FAILED: 'on_auth_failed'
};
const AUTH_SESSION_EXPIRE_SOON = 'auth_session_expire_soon';
const FAVORITE_ADDED = 'favorite_added';
const FAVORITE_DELETED = 'favorite_deleted';
const USER_STATUS_UPDATE = 'user_status_update';
const CHAT_MESSAGE_SENT = 'chat_message_sent';
const CHAT_MESSAGE_RECEIVED = 'chat_message_received';
const ENDPOINT_STATUS_UPDATE = 'endpoint_status_update';
const USERS_FORWARDS_BUSY_UPDATED = 'users_forwards_busy_updated';
const USERS_FORWARDS_NOANSWER_UPDATED = 'users_forwards_noanswer_updated';
const USERS_FORWARDS_UNCONDITIONAL_UPDATED = 'users_forwards_unconditional_updated';
const USERS_SERVICES_DND_UPDATED = 'users_services_dnd_updated';
const GLOBAL_VOICEMAIL_MESSAGE_CREATED = 'global_voicemail_message_created';
const GLOBAL_VOICEMAIL_MESSAGE_UPDATED = 'global_voicemail_message_updated';
const GLOBAL_VOICEMAIL_MESSAGE_DELETED = 'global_voicemail_message_deleted';
const USER_VOICEMAIL_MESSAGE_CREATED = 'user_voicemail_message_created';
const USER_VOICEMAIL_MESSAGE_UPDATED = 'user_voicemail_message_updated';
const USER_VOICEMAIL_MESSAGE_DELETED = 'user_voicemail_message_deleted';
const CALL_LOG_USER_CREATED = 'call_log_user_created';
const CALL_CREATED = 'call_created';
const CALL_ANSWERED = 'call_answered';
const CALL_DTMF_CREATED = 'call_dtmf_created';
const CALL_ENDED = 'call_ended';
const CALL_UPDATED = 'call_updated';
const CALL_HELD = 'call_held';
const CALL_RESUMED = 'call_resumed';
const AUTH_USER_EXTERNAL_AUTH_ADDED = 'auth_user_external_auth_added';
const AUTH_USER_EXTERNAL_AUTH_DELETED = 'auth_user_external_auth_deleted';
const CHATD_PRESENCE_UPDATED = 'chatd_presence_updated';
const CHATD_USER_ROOM_MESSAGE_CREATED = 'chatd_user_room_message_created';
const CHATD_USER_ROOM_CREATED = 'chatd_user_room_created';
const CONFERENCE_USER_PARTICIPANT_JOINED = 'conference_user_participant_joined';
const CONFERENCE_USER_PARTICIPANT_LEFT = 'conference_user_participant_left';
const CONFERENCE_USER_PARTICIPANT_TALK_STARTED = 'conference_user_participant_talk_started';
const CONFERENCE_USER_PARTICIPANT_TALK_STOPPED = 'conference_user_participant_talk_stopped';
const MEETING_USER_PARTICIPANT_JOINED = 'meeting_user_participant_joined';
const MEETING_USER_PARTICIPANT_LEFT = 'meeting_user_participant_left';
const SWITCHBOARD_QUEUED_CALLS_UPDATED = 'switchboard_queued_calls_updated';
const SWITCHBOARD_QUEUED_CALL_ANSWERED = 'switchboard_queued_call_answered';
const SWITCHBOARD_HELD_CALLS_UPDATED = 'switchboard_held_calls_updated';
const SWITCHBOARD_HELD_CALL_ANSWERED = 'switchboard_held_call_answered';
const FAX_OUTBOUND_USER_CREATED = 'fax_outbound_user_created';
const FAX_OUTBOUND_USER_SUCCEEDED = 'fax_outbound_user_succeeded';
const FAX_OUTBOUND_USER_FAILED = 'fax_outbound_user_failed';
const APPLICATION_CALL_DTMF_RECEIVED = 'application_call_dtmf_received';
const APPLICATION_CALL_ENTERED = 'application_call_entered';
const APPLICATION_CALL_INITIATED = 'application_call_initiated';
const APPLICATION_CALL_DELETED = 'application_call_deleted';
const APPLICATION_CALL_UPDATED = 'application_call_updated';
const APPLICATION_CALL_ANSWERED = 'application_call_answered';
const APPLICATION_PROGRESS_STARTED = 'application_progress_started';
const APPLICATION_PROGRESS_STOPPED = 'application_progress_stopped';
const APPLICATION_DESTINATION_NODE_CREATED = 'application_destination_node_created';
const APPLICATION_NODE_CREATED = 'application_node_created';
const APPLICATION_NODE_DELETED = 'application_node_deleted';
const APPLICATION_NODE_UPDATED = 'application_node_updated';
const APPLICATION_PLAYBACK_CREATED = 'application_playback_created';
const APPLICATION_PLAYBACK_DELETED = 'application_playback_deleted';
const APPLICATION_SNOOP_CREATED = 'application_snoop_created';
const APPLICATION_SNOOP_DELETED = 'application_snoop_deleted';
const APPLICATION_SNOOP_UPDATED = 'application_snoop_updated';
const APPLICATION_USER_OUTGOING_CALL_CREATED = 'application_user_outgoing_call_created';
const TRUNK_STATUS_UPDATED = 'trunk_status_updated';
const LINE_STATUS_UPDATED = 'line_status_updated';
const AGENT_STATUS_UPDATE = 'agent_status_update';
const AGENT_PAUSED = 'agent_paused';
const AGENT_UNPAUSED = 'agent_unpaused';
const AGENT_QUEUE_LOGGED_IN = 'user_agent_queue_logged_in';
const AGENT_QUEUE_LOGGED_OUT = 'user_agent_queue_logged_out';
const CONFERENCE_ADHOC_PARTICIPANT_LEFT = 'conference_adhoc_participant_left';
const CONFERENCE_ADHOC_DELETED = 'conference_adhoc_deleted';
const MEETING_USER_PROGRESS = 'meeting_user_progress';
const MEETING_USER_GUEST_AUTHORIZATION_CREATED = 'meeting_user_guest_authorization_created';
const BLACKLIST_EVENTS = [
    CHAT_MESSAGE_SENT,
    CHAT_MESSAGE_RECEIVED,
    CHATD_USER_ROOM_MESSAGE_CREATED,
    CHATD_USER_ROOM_CREATED
];
const HEARTBEAT_ENGINE_VERSION = '20.09';
const websocket_client_logger = IssueReporter.loggerFor('wazo-ws');
const messageLogger = IssueReporter.loggerFor('wazo-ws-message');
class WebSocketClient extends Emitter {
    initialized;
    session;
    host;
    version;
    token;
    events;
    options;
    socket;
    _boundOnHeartbeat;
    heartbeat;
    onHeartBeatTimeout;
    heartbeatCb;
    eventLists;
    static eventLists;
    constructor({ host, token, version, events, heartbeat, session }, options = {
        host,
        token,
        version: 1,
        events: [],
        heartbeat: {},
        session: null
    }){
        super();
        this.initialized = false;
        this.socket = null;
        this.host = host;
        this.token = token;
        this.events = events;
        this.options = options;
        this.version = version;
        this.session = session;
        this._boundOnHeartbeat = this._onHeartbeat.bind(this);
        const { delay, timeout, max } = heartbeat || {};
        this.heartbeat = new Heartbeat(delay, timeout, max);
        this.heartbeat.setSendHeartbeat(this.pingServer.bind(this));
        this.heartbeat.setOnHeartbeatTimeout(this._onHeartbeatTimeout.bind(this));
        this.eventLists = WebSocketClient.eventLists;
    }
    connect() {
        websocket_client_logger.info('connect method started', {
            host: this.host,
            token: obfuscateToken(this.token)
        });
        this.socket = new __WEBPACK_EXTERNAL_MODULE_reconnecting_websocket_e103ba3a__["default"](this._getUrl.bind(this), [], this.options);
        if (this.options.binaryType) this.socket.binaryType = this.options.binaryType;
        this.socket.onopen = ()=>{
            websocket_client_logger.info('on Wazo WS open', {
                method: 'connect',
                host: this.host
            });
            this.eventEmitter.emit(SOCKET_EVENTS.ON_OPEN);
        };
        this.socket.onerror = (event)=>{
            websocket_client_logger.error('on Wazo WS error', event.target);
            this.eventEmitter.emit(SOCKET_EVENTS.ON_ERROR, event);
        };
        this.socket.onmessage = (event)=>{
            this.eventEmitter.emit(SOCKET_EVENTS.ON_MESSAGE, event.data);
            const message = JSON.parse('string' == typeof event.data ? event.data : '{}');
            let { name } = message;
            if (message.data && message.data.name) name = message.data.name;
            if (-1 === BLACKLIST_EVENTS.indexOf(name)) messageLogger.trace(IssueReporter.removeSlashes(event.data), {
                method: 'onmessage'
            });
            else messageLogger.trace(`{"name": "${name}", "info": "content not shown"}`, {
                method: 'onmessage'
            });
            if (this.initialized) this._handleMessage(message);
            else this._handleInitMessage(message, this.socket);
        };
        this.socket.onclose = (event)=>{
            websocket_client_logger.info('on Wazo WS close', {
                reason: event.reason,
                code: event.code,
                readyState: event.target.readyState,
                host: this.host,
                token: obfuscateToken(this.token)
            });
            this.initialized = false;
            this.eventEmitter.emit(SOCKET_EVENTS.ON_CLOSE, event);
            switch(event.code){
                case 4002:
                    this.eventEmitter.emit(SOCKET_EVENTS.ON_AUTH_FAILED);
                    break;
                case 4003:
                    break;
                default:
            }
        };
        this.socket.onerror = (event)=>{
            websocket_client_logger.info('Wazo WS error', {
                message: event.message,
                code: event.code,
                readyState: event.target.readyState
            });
        };
    }
    close(force = false) {
        websocket_client_logger.info('Wazo WS close', {
            socket: !!this.socket,
            host: this.host,
            token: obfuscateToken(this.token)
        });
        if (!this.socket) return;
        if (3 === this.socket.readyState) {
            websocket_client_logger.warn('Trying to close an already closed websocket, bailing.', {
                url: this._getUrl()
            });
            return;
        }
        this.socket.close(1000);
        this.initialized = false;
        if (force) {
            this.host = null;
            this.token = null;
            this.socket = null;
        }
    }
    updateToken(token) {
        this.token = token;
        websocket_client_logger.info('Wazo WS updating token', {
            url: this._getUrl(),
            token: obfuscateToken(token),
            socket: !!this.socket
        });
        if (this.socket) {
            if (this.isConnected() && Number(this.version) >= 2) this.socket.send(JSON.stringify({
                op: 'token',
                data: {
                    token
                }
            }));
            else if (!this.isConnected()) this.reconnect('token refreshed');
        }
    }
    hasHeartbeat() {
        return this.heartbeat.hasHeartbeat;
    }
    startHeartbeat() {
        websocket_client_logger.info('Wazo WS start heartbeat', {
            host: this.host,
            token: obfuscateToken(this.token)
        });
        if (!this.socket) {
            this.heartbeat.stop();
            return;
        }
        this.off('pong', this._boundOnHeartbeat);
        this.on('pong', this._boundOnHeartbeat);
        this.heartbeat.start();
    }
    stopHeartbeat() {
        websocket_client_logger.info('Wazo WS stop heartbeat', {
            host: this.host,
            token: obfuscateToken(this.token)
        });
        this.heartbeat.stop();
    }
    setOnHeartbeatTimeout(cb) {
        this.onHeartBeatTimeout = cb;
    }
    setOnHeartbeatCallback(cb) {
        this.heartbeatCb = cb;
    }
    pingServer() {
        if (!this.socket || !this.isConnected()) return;
        try {
            this.socket.send(JSON.stringify({
                op: 'ping',
                data: {
                    payload: 'pong'
                }
            }));
        } catch (_) {}
    }
    isConnected() {
        return this.socket && this.socket.readyState === this.socket.OPEN;
    }
    reconnect(reason) {
        websocket_client_logger.info('Wazo WS reconnect', {
            reason,
            socket: !!this.socket,
            host: this.host,
            token: obfuscateToken(this.token)
        });
        if (!this.socket) return;
        this.socket.reconnect(0, reason);
    }
    _handleInitMessage(message, sock) {
        switch(message.op){
            case 'init':
                this.events?.forEach((event)=>{
                    const op = {
                        op: 'subscribe',
                        data: {
                            event_name: event
                        }
                    };
                    sock.send(JSON.stringify(op));
                });
                sock.send(JSON.stringify({
                    op: 'start'
                }));
                break;
            case 'subscribe':
                break;
            case 'start':
                this.initialized = true;
                this.eventEmitter.emit(SOCKET_EVENTS.INITIALIZED);
                break;
            default:
                this.eventEmitter.emit('message', message);
        }
    }
    _handleMessage(message) {
        if ('pong' === message.op) {
            this.eventEmitter.emit('pong', message.data);
            if (this.heartbeatCb) this.heartbeatCb();
            return;
        }
        if (1 === this.version) {
            this.eventEmitter.emit(message.name, message);
            return;
        }
        if (Number(this.version) >= 2 && 'event' === message.op) this.eventEmitter.emit(message.data.name, message.data);
    }
    _getUrl() {
        if (!this.host || !this.token) this.close();
        let url = `wss://${this.host || ''}/api/websocketd/?token=${this.token || ''}&version=${this.version}`;
        if (this.session) url += `&userUuid=${this.session.uuid}`;
        websocket_client_logger.info('Wazo WS url computed to reconnect', {
            url: url.replace(this.token, obfuscateToken(this.token))
        });
        return url;
    }
    _onHeartbeat(message) {
        if ('pong' === message.payload) {
            this.heartbeat.onHeartbeat();
            websocket_client_logger.log('on heartbeat received from Wazo WS');
        }
    }
    async _onHeartbeatTimeout() {
        websocket_client_logger.log('heartbeat timed out', {
            host: this.host,
            token: obfuscateToken(this.token)
        });
        this.close();
        this.eventEmitter.emit(SOCKET_EVENTS.ON_CLOSE, new Error('Websocket ping failure.'));
        if (this.onHeartBeatTimeout) this.onHeartBeatTimeout();
    }
}
WebSocketClient.eventLists = [
    AUTH_SESSION_EXPIRE_SOON,
    FAVORITE_ADDED,
    FAVORITE_DELETED,
    USER_STATUS_UPDATE,
    CHAT_MESSAGE_SENT,
    CHAT_MESSAGE_RECEIVED,
    ENDPOINT_STATUS_UPDATE,
    USERS_FORWARDS_BUSY_UPDATED,
    USERS_FORWARDS_NOANSWER_UPDATED,
    USERS_FORWARDS_UNCONDITIONAL_UPDATED,
    USERS_SERVICES_DND_UPDATED,
    GLOBAL_VOICEMAIL_MESSAGE_CREATED,
    GLOBAL_VOICEMAIL_MESSAGE_UPDATED,
    GLOBAL_VOICEMAIL_MESSAGE_DELETED,
    USER_VOICEMAIL_MESSAGE_CREATED,
    USER_VOICEMAIL_MESSAGE_UPDATED,
    USER_VOICEMAIL_MESSAGE_DELETED,
    CALL_LOG_USER_CREATED,
    CALL_ANSWERED,
    CALL_CREATED,
    CALL_DTMF_CREATED,
    CALL_ENDED,
    CALL_UPDATED,
    CALL_HELD,
    CALL_RESUMED,
    AUTH_USER_EXTERNAL_AUTH_ADDED,
    AUTH_USER_EXTERNAL_AUTH_DELETED,
    CHATD_PRESENCE_UPDATED,
    CHATD_USER_ROOM_MESSAGE_CREATED,
    CHATD_USER_ROOM_CREATED,
    CONFERENCE_USER_PARTICIPANT_JOINED,
    CONFERENCE_USER_PARTICIPANT_LEFT,
    MEETING_USER_PARTICIPANT_JOINED,
    MEETING_USER_PARTICIPANT_LEFT,
    CONFERENCE_USER_PARTICIPANT_TALK_STARTED,
    CONFERENCE_USER_PARTICIPANT_TALK_STOPPED,
    SWITCHBOARD_QUEUED_CALLS_UPDATED,
    SWITCHBOARD_QUEUED_CALL_ANSWERED,
    SWITCHBOARD_HELD_CALLS_UPDATED,
    SWITCHBOARD_HELD_CALL_ANSWERED,
    FAX_OUTBOUND_USER_CREATED,
    FAX_OUTBOUND_USER_SUCCEEDED,
    FAX_OUTBOUND_USER_FAILED,
    APPLICATION_CALL_DTMF_RECEIVED,
    APPLICATION_CALL_ENTERED,
    APPLICATION_CALL_INITIATED,
    APPLICATION_CALL_DELETED,
    APPLICATION_CALL_UPDATED,
    APPLICATION_CALL_ANSWERED,
    APPLICATION_PROGRESS_STARTED,
    APPLICATION_PROGRESS_STOPPED,
    APPLICATION_DESTINATION_NODE_CREATED,
    APPLICATION_NODE_CREATED,
    APPLICATION_NODE_DELETED,
    APPLICATION_NODE_UPDATED,
    APPLICATION_PLAYBACK_CREATED,
    APPLICATION_PLAYBACK_DELETED,
    APPLICATION_SNOOP_CREATED,
    APPLICATION_SNOOP_DELETED,
    APPLICATION_SNOOP_UPDATED,
    APPLICATION_USER_OUTGOING_CALL_CREATED,
    TRUNK_STATUS_UPDATED,
    LINE_STATUS_UPDATED,
    AGENT_STATUS_UPDATE,
    AGENT_PAUSED,
    AGENT_UNPAUSED,
    AGENT_QUEUE_LOGGED_IN,
    AGENT_QUEUE_LOGGED_OUT,
    CONFERENCE_ADHOC_PARTICIPANT_LEFT,
    CONFERENCE_ADHOC_DELETED,
    MEETING_USER_PROGRESS,
    MEETING_USER_GUEST_AUTHORIZATION_CREATED
];
const websocket_client = WebSocketClient;
const wazo_websocket = {
    name: 'Event transport (WS)',
    check: (server, session)=>new Promise((resolve, reject)=>{
            const client = new websocket_client({
                host: server,
                token: session.token,
                version: 2
            });
            const handleError = (message)=>{
                client.close();
                reject(new Error(message));
            };
            const handleSuccess = ()=>{
                client.stopHeartbeat();
                client.close();
                resolve();
            };
            client.on(SOCKET_EVENTS.ON_ERROR, (error)=>{
                handleError(`Connection error : ${error}`);
            });
            client.on(SOCKET_EVENTS.ON_OPEN, ()=>{
                if (session.hasEngineVersionGte(HEARTBEAT_ENGINE_VERSION)) {
                    client.setOnHeartbeatTimeout(()=>{
                        handleError('No response to heartbeat');
                    });
                    client.setOnHeartbeatCallback(()=>{
                        handleSuccess();
                    });
                    client.startHeartbeat();
                } else handleSuccess();
            });
            client.connect();
        })
};
const parseCandidate = (candidate)=>{
    if (!candidate) return null;
    const result = __WEBPACK_EXTERNAL_MODULE_sdp_transform_45b84e5d__["default"].parse(0 === candidate.indexOf('a=') ? candidate : `a=${candidate}`);
    return result.candidates ? result.candidates[0] : null;
};
const getSrflxOrRelay = (candidates)=>candidates.filter((candidate)=>candidate && ('srflx' === candidate.type || 'relay' === candidate.type));
const getVideoDirection = (sdp)=>{
    const parsedSdp = __WEBPACK_EXTERNAL_MODULE_sdp_transform_45b84e5d__["default"].parse(sdp);
    const videoMedia = parsedSdp.media.find((media)=>'video' === media.type);
    if (!videoMedia) return null;
    return videoMedia.direction;
};
const hasAnActiveVideo = (sdp)=>{
    if (!sdp) return false;
    const parsedSdp = __WEBPACK_EXTERNAL_MODULE_sdp_transform_45b84e5d__["default"].parse(sdp);
    return !!parsedSdp.media.find((media)=>'video' === media.type && media.port > 10 && (!media.direction || 'inactive' !== media.direction));
};
const fixSdp = (sdp, candidates, forcePort = true)=>{
    const parsedSdp = __WEBPACK_EXTERNAL_MODULE_sdp_transform_45b84e5d__["default"].parse(sdp);
    const mainCandidate = getSrflxOrRelay(candidates)[0];
    const ip = mainCandidate ? mainCandidate.ip : null;
    if (ip) parsedSdp.origin.address = ip;
    parsedSdp.media = parsedSdp.media.map((media)=>{
        const port = forcePort ? mainCandidate ? mainCandidate.port : media.port : media.port;
        return {
            ...media,
            port,
            candidates: (media.candidates || []).concat(candidates),
            direction: port < 10 ? 'inactive' : media.direction
        };
    });
    let fixed = __WEBPACK_EXTERNAL_MODULE_sdp_transform_45b84e5d__["default"].write(parsedSdp);
    if (ip) fixed = fixed.replace(/IN IP4 0.0.0.0/g, `IN IP4 ${ip}`);
    return fixed;
};
const addIcesInAllBundles = (sdp)=>{
    const parsedSdp = __WEBPACK_EXTERNAL_MODULE_sdp_transform_45b84e5d__["default"].parse(sdp);
    const mediaWithCandidate = parsedSdp.media.find((media)=>!!media.candidates);
    if (!mediaWithCandidate) return sdp;
    const { candidates } = mediaWithCandidate;
    parsedSdp.media = parsedSdp.media.map((media)=>({
            ...media,
            candidates: media.candidates || candidates
        }));
    return __WEBPACK_EXTERNAL_MODULE_sdp_transform_45b84e5d__["default"].write(parsedSdp);
};
const wazoLogger = IssueReporter ? IssueReporter.loggerFor('webrtc-sdh') : console;
const wazoMediaStreamFactory = (constraints)=>{
    if (!constraints.audio && !constraints.video) return Promise.resolve(new MediaStream());
    if (void 0 === navigator.mediaDevices) return Promise.reject(new Error('Media devices not available in insecure contexts.'));
    if (constraints.screen && !constraints.desktop) return navigator.mediaDevices.getDisplayMedia.call(navigator.mediaDevices, constraints);
    return navigator.mediaDevices.getUserMedia.call(navigator.mediaDevices, constraints);
};
class WazoSessionDescriptionHandler extends __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_session_description_handler_session_description_handler_fdd90ea0__.SessionDescriptionHandler {
    gatheredCandidates;
    eventEmitter;
    isWeb;
    session;
    constructor(logger, mediaStreamFactory, sessionDescriptionHandlerConfiguration, isWeb, session){
        super(logger, mediaStreamFactory, sessionDescriptionHandlerConfiguration);
        this.eventEmitter = new __WEBPACK_EXTERNAL_MODULE_events__["default"]();
        this.isWeb = isWeb;
        this.session = session;
    }
    on(event, callback) {
        this.eventEmitter.on(event, callback);
    }
    off(event, callback) {
        this.eventEmitter.removeListener(event, callback);
    }
    setRemoteSessionDescription(sessionDescription) {
        try {
            const result = super.setRemoteSessionDescription(sessionDescription);
            this.eventEmitter.emit("setDescription", sessionDescription);
            return result;
        } catch (error) {
            this.logger.error(`SessionDescriptionHandler.setRemoteSessionDescription: ${error}`);
            throw error;
        }
    }
    getDescription(options = {}, modifiers) {
        this.logger.debug("SessionDescriptionHandler.getDescription");
        if (void 0 === this._peerConnection) return Promise.reject(new Error('Peer connection closed.'));
        this.onDataChannel = options.onDataChannel;
        const iceRestart = !!options.offerOptions && options.offerOptions.iceRestart;
        const isConference = !!options && !!options.conference;
        const audioOnly = !!options && !!options.audioOnly;
        const shouldWaitForIce = !this.session.pendingReinviteAck && (iceRestart || 'constraints' in options);
        const iceTimeout = void 0 === options.iceGatheringTimeout ? this.sessionDescriptionHandlerConfiguration?.iceGatheringTimeout : options.iceGatheringTimeout;
        wazoLogger.trace("getting SDP description", {
            iceRestart,
            shouldWaitForIce,
            iceTimeout
        });
        this.gatheredCandidates = [];
        if (!this.peerConnectionDelegate) this.peerConnectionDelegate = {};
        this.peerConnectionDelegate.onicecandidate = (event)=>{
            wazoLogger.trace('onicecandidate', event.candidate ? event.candidate.candidate : {
                done: true
            });
            if (event.candidate) {
                this.gatheredCandidates.push(parseCandidate(event.candidate.candidate));
                if (-1 !== event.candidate.candidate.indexOf('srflx') || -1 !== event.candidate.candidate.indexOf('relay')) {
                    wazoLogger.info('A valid ice was found, triggering ice gathering complete callback.', {
                        ice: event.candidate.candidate
                    });
                    this.iceGatheringComplete();
                }
            }
        };
        return this.getLocalMediaStream(options).then(()=>this.updateDirection(options, isConference, audioOnly)).then(()=>this.createDataChannel(options)).then(()=>{
            if (isConference && options.constraints && !options.constraints.video && !('hold' in options) && !audioOnly) {
                if (this.peerConnection?.addTransceiver) this.peerConnection.addTransceiver('video', {
                    streams: [
                        this._localMediaStream
                    ],
                    direction: 'sendrecv'
                });
            }
        }).then(()=>this.createLocalOfferOrAnswer(options)).then((sessionDescription)=>this.setLocalSessionDescription(sessionDescription)).then(()=>this.waitForIceGatheringComplete(iceRestart, iceTimeout)).then(()=>this.getLocalSessionDescription()).then((description)=>{
            const { sdp } = description;
            if (-1 !== sdp.indexOf('a=candidate')) return {
                type: description.type,
                sdp: addIcesInAllBundles(sdp)
            };
            wazoLogger.info('No ICE candidates found in SDP, fixing it with gathered ices', this.gatheredCandidates);
            return {
                type: description.type,
                sdp: fixSdp(sdp, this.gatheredCandidates, !!options && !!options.constraints && options.constraints.video)
            };
        }).then((sessionDescription)=>this.applyModifiers(sessionDescription, modifiers)).then((sessionDescription)=>({
                body: sessionDescription.sdp,
                contentType: 'application/sdp'
            })).catch((error)=>{
            wazoLogger.error('error when creating media', error);
            this.logger.error(`SessionDescriptionHandler.getDescription failed - ${error}`);
            throw error;
        });
    }
    sendDtmf(tones, options = {
        duration: 0,
        interToneGap: 0
    }) {
        if (this.isWeb) return super.sendDtmf(tones, options);
        this.logger.debug(`DTMF sent via INFO: ${tones.toString()}`);
        const body = {
            contentDisposition: 'render',
            contentType: 'application/dtmf-relay',
            content: `Signal=${tones}\r\nDuration=${options.duration || 1000}`
        };
        const requestOptions = {
            body
        };
        return this.session.info({
            requestOptions
        });
    }
    close() {
        wazoLogger.info('closing sdh');
        if (this.isWeb) return super.close();
        this.logger.debug("SessionDescriptionHandler.close");
        if (void 0 === this._peerConnection) return;
        if (this.peerConnection?.getLocalStreams) {
            this.peerConnection?.getLocalStreams().forEach((stream)=>{
                stream.getTracks().filter((track)=>track.enabled).forEach((track)=>track.stop());
            });
            this.peerConnection?.getRemoteStreams().forEach((stream)=>{
                stream.getTracks().filter((track)=>track.enabled).forEach((track)=>track.stop());
            });
        }
        if (this._dataChannel) this._dataChannel.close();
        this._peerConnection.close();
        this._peerConnection = void 0;
    }
    updateDirection(options, isConference = false, audioOnly = false) {
        if (void 0 === this._peerConnection) return Promise.reject(new Error('Peer connection closed.'));
        if (!this._peerConnection.getTransceivers) return Promise.resolve();
        switch(this._peerConnection.signalingState){
            case 'stable':
                {
                    this.logger.debug("SessionDescriptionHandler.updateDirection - setting offer direction");
                    const directionToOffer = (currentDirection, transceiver)=>{
                        if (isConference) {
                            if (audioOnly && transceiver.receiver.track && 'video' === transceiver.receiver.track.kind) return 'sendonly';
                            return options && options.hold ? 'sendonly' : 'sendrecv';
                        }
                        switch(currentDirection){
                            case 'inactive':
                                return options && options.hold ? 'inactive' : isConference && !audioOnly ? 'sendrecv' : 'recvonly';
                            case 'recvonly':
                                return options && options.hold ? 'inactive' : 'recvonly';
                            case 'sendonly':
                                return options && options.hold ? 'sendonly' : 'sendrecv';
                            case 'sendrecv':
                                return options && options.hold ? 'sendonly' : 'sendrecv';
                            case 'stopped':
                                return 'stopped';
                            default:
                                throw new Error('Should never happen');
                        }
                    };
                    this._peerConnection.getTransceivers().forEach((transceiver)=>{
                        if (transceiver.direction) {
                            const offerDirection = directionToOffer(transceiver.direction, transceiver);
                            if (transceiver.direction !== offerDirection) transceiver.direction = offerDirection;
                            if (transceiver.receiver?.track) transceiver.receiver.track.enabled = 'sendrecv' === offerDirection || 'recvonly' === offerDirection;
                        }
                    });
                }
                break;
            case 'have-remote-offer':
                {
                    this.logger.debug("SessionDescriptionHandler.updateDirection - setting answer direction");
                    const offeredDirection = (()=>{
                        const description = this._peerConnection.remoteDescription;
                        if (!description) throw new Error('Failed to read remote offer');
                        const searchResult = /a=sendrecv\r\n|a=sendonly\r\n|a=recvonly\r\n|a=inactive\r\n/.exec(description.sdp);
                        if (searchResult) switch(searchResult[0]){
                            case 'a=inactive\r\n':
                                return 'inactive';
                            case 'a=recvonly\r\n':
                                return 'recvonly';
                            case 'a=sendonly\r\n':
                                return 'sendonly';
                            case 'a=sendrecv\r\n':
                                break;
                            default:
                                throw new Error('Should never happen');
                        }
                        return 'sendrecv';
                    })();
                    const answerDirection = (()=>{
                        switch(offeredDirection){
                            case 'inactive':
                                return 'inactive';
                            case 'recvonly':
                                return 'sendonly';
                            case 'sendonly':
                                return options && options.hold ? 'inactive' : 'recvonly';
                            case 'sendrecv':
                                return options && options.hold ? 'sendonly' : 'sendrecv';
                            default:
                                throw new Error('Should never happen');
                        }
                    })();
                    this._peerConnection.getTransceivers().forEach((transceiver)=>{
                        if (transceiver.stopped) return;
                        if (transceiver.direction) {
                            const { receiver } = transceiver;
                            if (isConference && audioOnly && receiver.track && 'video' === receiver.track.kind) {
                                transceiver.direction = 'inactive';
                                receiver.track.enabled = false;
                                return;
                            }
                            if ('stopped' !== transceiver.direction && transceiver.direction !== answerDirection) transceiver.direction = answerDirection;
                            if (receiver?.track) receiver.track.enabled = 'sendrecv' === answerDirection || 'recvonly' === answerDirection;
                        }
                    });
                }
                break;
            case 'have-local-offer':
            case 'have-local-pranswer':
            case 'have-remote-pranswer':
            case 'closed':
            default:
                return Promise.reject(new Error(`Invalid signaling state ${this._peerConnection.signalingState}`));
        }
        return Promise.resolve();
    }
    setLocalMediaStream(stream) {
        this.logger.debug("SessionDescriptionHandler.setLocalMediaStream");
        if (!this._peerConnection) throw new Error('Peer connection undefined.');
        const pc = this._peerConnection;
        const { sfu } = pc;
        const localStream = this._localMediaStream;
        const trackUpdates = [];
        const updateTrack = (newTrack)=>{
            const { kind } = newTrack;
            if ('audio' !== kind && 'video' !== kind) throw new Error(`Unknown new track kind ${kind}.`);
            const sender = pc.getSenders && pc.getSenders().find((otherSender)=>otherSender.track && otherSender.track.kind === kind);
            if (sender && (!sfu || 'audio' === newTrack.kind)) {
                if (sender.track) newTrack.enabled = sender.track.enabled;
                trackUpdates.push(new Promise((resolve)=>{
                    this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - replacing sender ${kind} track`);
                    resolve(null);
                }).then(()=>sender.replaceTrack(newTrack).then(()=>{
                        const oldTrack = localStream.getTracks().find((localTrack)=>localTrack.kind === kind);
                        if (oldTrack) {
                            oldTrack.stop();
                            localStream.removeTrack(oldTrack);
                            __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_session_description_handler_session_description_handler_fdd90ea0__.SessionDescriptionHandler.dispatchRemoveTrackEvent(localStream, oldTrack);
                        }
                        localStream.addTrack(newTrack);
                        __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_session_description_handler_session_description_handler_fdd90ea0__.SessionDescriptionHandler.dispatchAddTrackEvent(localStream, newTrack);
                    }).catch((error)=>{
                        this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to replace sender ${kind} track`);
                        throw error;
                    })));
            } else trackUpdates.push(new Promise((resolve)=>{
                this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - adding sender ${kind} track`);
                resolve(null);
            }).then(()=>{
                try {
                    if (pc.addTrack) pc.addTrack(newTrack, localStream);
                    else pc.addStream(localStream);
                } catch (error) {
                    this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to add sender ${kind} track`);
                    throw error;
                }
                localStream.addTrack(newTrack);
                __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_session_description_handler_session_description_handler_fdd90ea0__.SessionDescriptionHandler.dispatchAddTrackEvent(localStream, newTrack);
            }));
        };
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length) updateTrack(audioTracks[0]);
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length) updateTrack(videoTracks[0]);
        return trackUpdates.reduce((p, x)=>p.then(()=>x), Promise.resolve());
    }
    getLocalMediaStream(options) {
        this.logger.debug("WazoSessionDescriptionHandler.getLocalMediaStream");
        if (void 0 === this._peerConnection) return Promise.reject(new Error('Peer connection closed.'));
        let constraints = options.constraints ? {
            ...options.constraints
        } : {};
        if (this.localMediaStreamConstraints) {
            if (this._constraintsEqual(this.localMediaStreamConstraints.audio, constraints.audio) && this._constraintsEqual(this.localMediaStreamConstraints.video, constraints.video)) {
                const existingAudioTracks = this._localMediaStream?.getAudioTracks() || [];
                const hasActiveAudioTrack = existingAudioTracks.some((t)=>'live' === t.readyState && t.enabled);
                if (hasActiveAudioTrack) return Promise.resolve();
            }
        } else if (void 0 === constraints.audio && void 0 === constraints.video) constraints = {
            audio: true
        };
        this.localMediaStreamConstraints = constraints;
        wazoLogger.info('getLocalMediaStream: acquiring media stream', {
            audioConstraints: constraints.audio,
            videoConstraints: !!constraints.video
        });
        return this.mediaStreamFactory(constraints, this).then((mediaStream)=>{
            const audioTracks = mediaStream.getAudioTracks();
            wazoLogger.info('getLocalMediaStream: media stream acquired', {
                audioTracks: audioTracks.map((t)=>({
                        id: t.id,
                        label: t.label,
                        readyState: t.readyState,
                        enabled: t.enabled
                    }))
            });
            this.setLocalMediaStream(mediaStream);
            return mediaStream;
        });
    }
    _constraintsEqual(a, b) {
        if (a === b) return true;
        if (typeof a !== typeof b) return false;
        if ('object' != typeof a || null === a || null === b) return a === b;
        const keysA = Object.keys(a).sort();
        const keysB = Object.keys(b).sort();
        if (keysA.length !== keysB.length) return false;
        return keysA.every((key, i)=>keysB[i] === key && this._constraintsEqual(a[key], b[key]));
    }
}
const lib_WazoSessionDescriptionHandler = WazoSessionDescriptionHandler;
const lastIndexOf = (array, method)=>{
    const start = array.length - 1;
    for(let i = start; i >= 0; i--)if (method(array[i])) return i;
    return -1;
};
const replaceLocalIpModifier = (description)=>Promise.resolve({
        ...JSON.parse(JSON.stringify(description)),
        sdp: description.sdp.replace('c=IN IP4 0.0.0.0', 'c=IN IP4 127.0.0.1')
    });
const DEFAULT_ICE_TIMEOUT = 3000;
const SEND_STATS_DELAY = 5000;
const MAX_ICE_RECONNECT_ATTEMPTS = 5;
const DEFAULT_ICE_RECONNECT_DELAY = 500;
const states = [
    'STATUS_NULL',
    'STATUS_NEW',
    'STATUS_CONNECTING',
    'STATUS_CONNECTED',
    'STATUS_COMPLETED'
];
const web_rtc_client_logger = IssueReporter ? IssueReporter.loggerFor('webrtc-client') : console;
const statsLogger = IssueReporter ? IssueReporter.loggerFor('webrtc-stats') : console;
const REGISTERED = 'registered';
const UNREGISTERED = 'unregistered';
const REGISTRATION_FAILED = 'registrationFailed';
const INVITE = 'invite';
const CONNECTED = 'connected';
const DISCONNECTED = 'disconnected';
const TRANSPORT_ERROR = 'transportError';
const MESSAGE = 'message';
const web_rtc_client_ACCEPTED = 'accepted';
const web_rtc_client_REJECTED = 'rejected';
const ON_TRACK = 'onTrack';
const ON_PROGRESS = 'onProgress';
const ON_EARLY_MEDIA = 'onEarlyMedia';
const ON_REINVITE = 'reinvite';
const ON_ERROR = 'onError';
const ON_SCREEN_SHARING_REINVITE = 'onScreenSharingReinvite';
const ON_NETWORK_STATS = 'onNetworkStats';
const ON_ICE_DISCONNECTED = 'onIceDisconnected';
const ON_ICE_RECONNECTING = 'onIceReconnecting';
const ON_ICE_RECONNECTED = 'onIceReconnected';
const ON_MEDIA_CONNECTED = 'onMediaConnected';
const web_rtc_client_events = [
    REGISTERED,
    UNREGISTERED,
    REGISTRATION_FAILED,
    INVITE
];
const transportEvents = [
    CONNECTED,
    DISCONNECTED,
    TRANSPORT_ERROR,
    MESSAGE
];
class CanceledCallError extends Error {
}
const MAX_REGISTER_TRIES = 5;
const NO_ANSWER_TIMEOUT = 86400;
class WebRTCClient extends Emitter {
    clientId;
    config;
    uaConfigOverrides;
    userAgent;
    registerer;
    hasAudio;
    audio;
    audioElements;
    video;
    audioStreams;
    audioOutputDeviceId;
    audioOutputVolume;
    heldSessions;
    connectionPromise;
    _boundOnHeartbeat;
    heartbeat;
    heartbeatTimeoutCb;
    heartbeatCb;
    statsIntervals;
    sipSessions;
    conferences;
    skipRegister;
    networkMonitoringInterval;
    sessionNetworkStats;
    forceClosed;
    iceReconnectAttempts;
    mediaConnectedSessions;
    iceReconnectDelay;
    _warmupStream;
    ON_USER_AGENT;
    REGISTERED;
    UNREGISTERED;
    REGISTRATION_FAILED;
    INVITE;
    CONNECTED;
    DISCONNECTED;
    TRANSPORT_ERROR;
    MESSAGE;
    ACCEPTED;
    REJECTED;
    ON_TRACK;
    ON_REINVITE;
    ON_ERROR;
    ON_SCREEN_SHARING_REINVITE;
    ON_NETWORK_STATS;
    ON_EARLY_MEDIA;
    ON_PROGRESS;
    ON_ICE_DISCONNECTED;
    ON_ICE_RECONNECTING;
    ON_ICE_RECONNECTED;
    ON_MEDIA_CONNECTED;
    static isAPrivateIp(ip) {
        const regex = /^(?:10|127|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\..*/;
        return null == regex.exec(ip);
    }
    static getIceServers(ip) {
        if (WebRTCClient.isAPrivateIp(ip)) return [
            {
                urls: [
                    'stun:stun.l.google.com:19302',
                    'stun:stun4.l.google.com:19302'
                ]
            }
        ];
        return [];
    }
    constructor(config, session, uaConfigOverrides){
        super();
        this.clientId = Math.ceil(1000 * Math.random());
        web_rtc_client_logger.info('sdk webrtc constructor', {
            clientId: this.clientId
        });
        this.uaConfigOverrides = uaConfigOverrides;
        this.config = config;
        this.skipRegister = config.skipRegister;
        this._buildConfig(config, session).then((newConfig)=>{
            this.config = newConfig;
            this.userAgent = this.createUserAgent(uaConfigOverrides);
        });
        this.audioOutputDeviceId = config.audioDeviceOutput;
        this.audioOutputVolume = config.audioOutputVolume || 1;
        if (config.media) {
            this.configureMedia(config.media);
            this.setMediaConstraints({
                audio: config.media.audio,
                video: config.media.video
            });
        }
        this.heldSessions = {};
        this.statsIntervals = {};
        this.connectionPromise = null;
        this.sipSessions = {};
        this.conferences = {};
        this.networkMonitoringInterval = {};
        this.sessionNetworkStats = {};
        this.forceClosed = false;
        this.iceReconnectAttempts = {};
        this.mediaConnectedSessions = {};
        this.iceReconnectDelay = config.iceReconnectDelay || DEFAULT_ICE_RECONNECT_DELAY;
        this._warmupStream = null;
        this._boundOnHeartbeat = this._onHeartbeat.bind(this);
        this.heartbeat = new Heartbeat(config.heartbeatDelay, config.heartbeatTimeout, config.maxHeartbeats);
        this.heartbeat.setSendHeartbeat(this.pingServer.bind(this));
        this.heartbeat.setOnHeartbeatTimeout(this._onHeartbeatTimeout.bind(this));
        this.REGISTERED = REGISTERED;
        this.UNREGISTERED = UNREGISTERED;
        this.REGISTRATION_FAILED = REGISTRATION_FAILED;
        this.INVITE = INVITE;
        this.CONNECTED = CONNECTED;
        this.DISCONNECTED = DISCONNECTED;
        this.TRANSPORT_ERROR = TRANSPORT_ERROR;
        this.MESSAGE = MESSAGE;
        this.ACCEPTED = web_rtc_client_ACCEPTED;
        this.REJECTED = web_rtc_client_REJECTED;
        this.ON_TRACK = ON_TRACK;
        this.ON_REINVITE = ON_REINVITE;
        this.ON_ERROR = ON_ERROR;
        this.ON_SCREEN_SHARING_REINVITE = ON_SCREEN_SHARING_REINVITE;
        this.ON_NETWORK_STATS = ON_NETWORK_STATS;
        this.ON_ICE_DISCONNECTED = ON_ICE_DISCONNECTED;
        this.ON_EARLY_MEDIA = ON_EARLY_MEDIA;
        this.ON_PROGRESS = ON_PROGRESS;
        this.ON_ICE_RECONNECTING = ON_ICE_RECONNECTING;
        this.ON_ICE_RECONNECTED = ON_ICE_RECONNECTED;
        this.ON_MEDIA_CONNECTED = ON_MEDIA_CONNECTED;
    }
    configureMedia(media) {
        this.hasAudio = !!media.audio;
        this.audioStreams = {};
        this.audioElements = {};
    }
    setMediaConstraints(media) {
        this.video = media.video;
        this.audio = media.audio;
    }
    createUserAgent(uaConfigOverrides) {
        const uaOptions = this._createUaOptions(uaConfigOverrides);
        web_rtc_client_logger.info('sdk webrtc, creating UA', {
            uaOptions: {
                ...uaOptions,
                authorizationPassword: `${uaOptions?.authorizationPassword?.slice(0, 5)}xxxx`
            },
            clientId: this.clientId
        });
        uaOptions.delegate = {
            onConnect: this.onConnect.bind(this),
            onDisconnect: this.onDisconnect.bind(this),
            onInvite: (invitation)=>{
                web_rtc_client_logger.info('sdk webrtc on invite', {
                    method: 'delegate.onInvite',
                    clientId: this.clientId,
                    id: this.getSipSessionId(invitation),
                    remoteURI: invitation.remoteURI
                });
                this._setupSession(invitation);
                const shouldAutoAnswer = !!invitation.request.getHeader('alert-info');
                this.eventEmitter.emit(INVITE, invitation, this.sessionWantsToDoVideo(invitation), shouldAutoAnswer);
            }
        };
        const ua = new __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_user_agent_8471afcd__.UserAgent(uaOptions);
        ua.start();
        if (ua.transport && ua.transport.connectPromise) ua.transport.connectPromise.catch((e)=>{
            web_rtc_client_logger.warn('Transport connect error', e);
        });
        ua.transport.onMessage = (rawMessage)=>{
            const message = __WEBPACK_EXTERNAL_MODULE_sip_js_lib_core_messages_parser_9974076a__.Parser.parseMessage(rawMessage, ua.transport.logger);
            ua.onTransportMessage(rawMessage);
            this.eventEmitter.emit(MESSAGE, message);
            if (message && message.method === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_core_messages_methods_constants_78ac14f1__.C.MESSAGE) ua.userAgentCore.replyStateless(message, {
                statusCode: 200
            });
        };
        return ua;
    }
    isConnected() {
        return Boolean(this.userAgent?.isConnected());
    }
    isConnecting() {
        return this.userAgent?.transport?.state === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_transport_state_2606bc5d__.TransportState.Connecting;
    }
    isRegistered() {
        return Boolean(this.registerer && this.registerer.state === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_registerer_state_6e58ddd6__.RegistererState.Registered);
    }
    onConnect() {
        web_rtc_client_logger.info('sdk webrtc connected', {
            method: 'delegate.onConnect',
            clientId: this.clientId
        });
        this.eventEmitter.emit(CONNECTED);
        if (!this.isRegistered() && this.registerer?.waiting) this.registerer.waitingToggle(false);
        return this.register();
    }
    async onDisconnect(error) {
        web_rtc_client_logger.info('sdk webrtc disconnected', {
            method: 'delegate.onConnect',
            clientId: this.clientId,
            error
        });
        this.connectionPromise = null;
        this.eventEmitter.emit(DISCONNECTED, error);
        if (this.isRegistered()) {
            await this.unregister();
            if (this.registerer?.waiting) this.registerer.waitingToggle(false);
            this.eventEmitter.emit(UNREGISTERED);
        }
    }
    async register(tries = 0) {
        const logInfo = {
            clientId: this.clientId,
            userAgent: !!this.userAgent,
            registered: this.isRegistered(),
            connectionPromise: !!this.connectionPromise,
            registerer: !!this.registerer,
            waiting: this.registerer && this.registerer.waiting,
            tries,
            skipRegister: this.skipRegister
        };
        this.forceClosed = false;
        if (this.skipRegister) {
            web_rtc_client_logger.info('sdk webrtc skip register...', logInfo);
            return Promise.resolve();
        }
        web_rtc_client_logger.info('sdk webrtc registering...', logInfo);
        if (!this.userAgent) {
            web_rtc_client_logger.info('sdk webrtc recreating User Agent');
            this.userAgent = this.createUserAgent(this.uaConfigOverrides);
        }
        if (!this.userAgent || this.isRegistered()) {
            web_rtc_client_logger.info('sdk webrtc registering aborted, already registered or no UA can be created');
            return Promise.resolve();
        }
        if (this.connectionPromise || this.registerer?.waiting) {
            web_rtc_client_logger.info('sdk webrtc registering aborted due to a registration in progress.', {
                clientId: this.clientId
            });
            return Promise.resolve();
        }
        const registerOptions = this._isWeb() ? {} : {
            extraContactHeaderParams: [
                'mobility=mobile'
            ]
        };
        const onRegisterFailed = ()=>{
            web_rtc_client_logger.info('sdk webrtc registering failed', {
                tries,
                clientId: this.clientId,
                registerer: !!this.registerer,
                forceClosed: this.forceClosed
            });
            if (this.forceClosed) return;
            this.connectionPromise = null;
            if (this.registerer && this.registerer.waiting) this.registerer.waitingToggle(false);
            if (tries <= MAX_REGISTER_TRIES) {
                web_rtc_client_logger.info('sdk webrtc registering, retrying...', {
                    clientId: this.clientId,
                    tries
                });
                setTimeout(()=>this.register(tries + 1), 300);
            }
        };
        return this._connectIfNeeded().then(()=>{
            if (!this.userAgent) {
                web_rtc_client_logger.info('sdk webrtc recreating User Agent after connection');
                this.userAgent = this.createUserAgent(this.uaConfigOverrides);
            }
            web_rtc_client_logger.info('sdk webrtc registering, transport connected', {
                registerOptions,
                ua: !!this.userAgent,
                clientId: this.clientId
            });
            this.registerer = new __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Registerer(this.userAgent, registerOptions);
            this.connectionPromise = null;
            this._monkeyPatchRegisterer(this.registerer);
            this.registerer.stateChange.addListener((newState)=>{
                web_rtc_client_logger.info('sdk webrtc registering, state changed', {
                    newState,
                    clientId: this.clientId
                });
                if (newState === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_registerer_state_6e58ddd6__.RegistererState.Registered && this.registerer?.state === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_registerer_state_6e58ddd6__.RegistererState.Registered) {
                    if (navigator.userAgent?.includes('Windows') && (navigator.userAgent?.includes('Chrome') || navigator.userAgent?.includes('Chromium'))) this._performSacrificialWebRTCOperation().catch((error)=>{
                        web_rtc_client_logger.warn('ICE warmup after registration failed', {
                            error: error.message,
                            clientId: this.clientId
                        });
                    });
                    this.eventEmitter.emit(REGISTERED);
                } else if (newState === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_registerer_state_6e58ddd6__.RegistererState.Unregistered) this.eventEmitter.emit(UNREGISTERED);
            });
            const options = {
                requestDelegate: {
                    onReject: (response)=>{
                        web_rtc_client_logger.error('sdk webrtc registering, rejected', {
                            clientId: this.clientId,
                            response
                        });
                        onRegisterFailed();
                    }
                }
            };
            return this.registerer.register(options).catch((e)=>{
                web_rtc_client_logger.error('sdk webrtc registering, error', e);
                this.eventEmitter.emit(REGISTRATION_FAILED);
                return e;
            });
        }).catch((error)=>{
            web_rtc_client_logger.error('sdk webrtc registering, transport error', error);
            onRegisterFailed();
        });
    }
    _monkeyPatchRegisterer(registerer) {
        if (!registerer) return;
        const oldWaitingToggle = registerer.waitingToggle.bind(registerer);
        const oldUnregistered = registerer.unregistered.bind(registerer);
        registerer.waitingToggle = (waiting)=>{
            if (!registerer || registerer.waiting === waiting) return;
            oldWaitingToggle(waiting);
        };
        registerer.unregistered = ()=>{
            if (!registerer || registerer.state === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_registerer_state_6e58ddd6__.RegistererState.Terminated) return;
            oldUnregistered();
        };
    }
    async unregister() {
        web_rtc_client_logger.info('sdk webrtc unregistering..', {
            clientId: this.clientId,
            userAgent: !!this.userAgent,
            registerer: !!this.registerer
        });
        try {
            return new Promise((resolve, reject)=>{
                if (!this.registerer) return resolve();
                const onRegisterStateChange = (state)=>{
                    if (state === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_registerer_state_6e58ddd6__.RegistererState.Unregistered) {
                        web_rtc_client_logger.info('sdk webrtc unregistered', {
                            clientId: this.clientId
                        });
                        if (this.registerer) this.registerer.stateChange.addListener(onRegisterStateChange);
                        this._cleanupRegister();
                        resolve();
                    }
                };
                this.registerer.stateChange.addListener(onRegisterStateChange);
                this.registerer.unregister().then().catch((e)=>{
                    web_rtc_client_logger.error('sdk webrtc unregistering, promise error', e);
                    this._cleanupRegister();
                    reject();
                });
            });
        } catch (e) {
            web_rtc_client_logger.error('sdk webrtc unregistering, error', e);
            this._cleanupRegister();
        }
    }
    stop() {
        web_rtc_client_logger.info('sdk webrtc stop', {
            clientId: this.clientId,
            userAgent: !!this.userAgent
        });
        if (!this.userAgent) return Promise.resolve();
        return this.userAgent.stop().then(()=>this._cleanupRegister()).catch((e)=>{
            web_rtc_client_logger.warn('sdk webrtc stop, error', {
                message: e.message,
                stack: e.stack
            });
        });
    }
    call(number, enableVideo, audioOnly = false, conference = false, options = {}) {
        web_rtc_client_logger.info('sdk webrtc creating call', {
            clientId: this.clientId,
            number,
            enableVideo,
            audioOnly,
            conference,
            options
        });
        const inviterOptions = {
            sessionDescriptionHandlerOptionsReInvite: {
                conference,
                audioOnly
            },
            earlyMedia: true,
            ...options
        };
        if (audioOnly) inviterOptions.sessionDescriptionHandlerModifiersReInvite = [
            __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_modifiers_modifiers_2ed0685f__.stripVideo
        ];
        const uri = this._makeURI(number);
        let session = null;
        if (uri) session = this.userAgent ? new __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Inviter(this.userAgent, uri, inviterOptions) : null;
        else web_rtc_client_logger.error('Null URI');
        if (session) {
            this.storeSipSession(session);
            this._setupSession(session);
        }
        if (conference) this.conferences[this.getSipSessionId(session)] = true;
        const inviteOptions = {
            requestDelegate: {
                onAccept: (response)=>{
                    if (session?.sessionDescriptionHandler?.peerConnection) (session?.sessionDescriptionHandler).peerConnection.sfu = conference;
                    this._onAccepted(session, response.session, true);
                },
                onProgress: (payload)=>{
                    this._onProgress(payload.session, 183 === payload.message.statusCode);
                },
                onReject: (response)=>{
                    web_rtc_client_logger.info('on call rejected', {
                        id: this.getSipSessionId(session),
                        fromTag: session?.fromTag
                    });
                    this._stopSendingStats(session);
                    this.stopNetworkMonitoring(session);
                    this.eventEmitter.emit(web_rtc_client_REJECTED, session, response);
                }
            },
            sessionDescriptionHandlerOptions: this.getMediaConfiguration(enableVideo || false, conference)
        };
        if (inviteOptions.sessionDescriptionHandlerOptions) inviteOptions.sessionDescriptionHandlerOptions.audioOnly = audioOnly;
        inviteOptions.sessionDescriptionHandlerModifiers = [
            replaceLocalIpModifier
        ];
        if (audioOnly) inviteOptions.sessionDescriptionHandlerModifiers.push(__WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_modifiers_modifiers_2ed0685f__.stripVideo);
        if (session) session.invitePromise = session.invite(inviteOptions).catch((e)=>{
            web_rtc_client_logger.warn('sdk webrtc creating call, error', e);
        });
        return session;
    }
    answer(session, enableVideo) {
        web_rtc_client_logger.info('sdk webrtc answer call', {
            clientId: this.clientId,
            id: this.getSipSessionId(session),
            enableVideo
        });
        if (!session || !session.accept) {
            const error = 'No session to answer, or not an invitation';
            web_rtc_client_logger.warn(error);
            return Promise.reject(new Error(error));
        }
        const options = {
            sessionDescriptionHandlerOptions: this.getMediaConfiguration(enableVideo || false)
        };
        return this._accept(session, options).then(()=>{
            if (session.isCanceled) {
                const message = 'accepted a canceled session (or was canceled during the accept phase).';
                web_rtc_client_logger.error(message, {
                    id: this.getSipSessionId(session)
                });
                this.onCallEnded(session);
                throw new CanceledCallError(message);
            }
            web_rtc_client_logger.info('sdk webrtc answer, accepted.');
            this._onAccepted(session);
        }).catch((e)=>{
            web_rtc_client_logger.error(`answer call error for ${this.getSipSessionId(session)}`, e);
            throw e;
        });
    }
    async hangup(session) {
        const { state, id } = session;
        web_rtc_client_logger.info('sdk webrtc hangup call', {
            clientId: this.clientId,
            id,
            state
        });
        try {
            this._stopSendingStats(session);
            this._cleanupMedia(session);
            delete this.sipSessions[this.getSipSessionId(session)];
            const isInviter = session instanceof __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Inviter;
            const actions = {
                [__WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Initial]: isInviter ? this._cancel.bind(this, session) : this._reject.bind(this, session),
                [__WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Establishing]: isInviter ? this._cancel.bind(this, session) : this._reject.bind(this, session),
                [__WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Established]: this._bye.bind(this, session)
            };
            if (actions[state]) return await actions[state]();
            return await this._bye(session);
        } catch (error) {
            web_rtc_client_logger.warn('sdk webrtc hangup, error', error);
        }
        return Promise.resolve(null);
    }
    async getStats(session) {
        const pc = session.sessionDescriptionHandler?.peerConnection;
        if (!pc) return null;
        return pc.getStats(null);
    }
    startNetworkMonitoring(session, interval = 1000) {
        const sessionId = this.getSipSessionId(session);
        web_rtc_client_logger.info('starting network inspection', {
            id: sessionId,
            clientId: this.clientId
        });
        this.sessionNetworkStats[sessionId] = [];
        this.networkMonitoringInterval[sessionId] = setInterval(()=>this._fetchNetworkStats(sessionId), interval);
    }
    stopNetworkMonitoring(session) {
        const sessionId = this.getSipSessionId(session);
        const exists = sessionId in this.networkMonitoringInterval;
        web_rtc_client_logger.info('stopping network inspection', {
            clientId: this.clientId,
            id: sessionId,
            exists
        });
        if (exists) {
            clearInterval(this.networkMonitoringInterval[sessionId]);
            delete this.networkMonitoringInterval[sessionId];
            delete this.sessionNetworkStats[sessionId];
        }
    }
    async reject(session) {
        web_rtc_client_logger.info('sdk webrtc reject call', {
            clientId: this.clientId,
            id: this.getSipSessionId(session)
        });
        try {
            if (session instanceof __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Invitation) return this._reject(session, {
                statusCode: 603,
                reasonPhrase: 'Decline'
            });
            if (session instanceof __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Inviter) return this._cancel(session);
        } catch (e) {
            web_rtc_client_logger.warn('Error when rejecting call', e.message, e.stack);
        }
    }
    async close(force = false) {
        web_rtc_client_logger.info('sdk webrtc closing client', {
            clientId: this.clientId,
            userAgent: !!this.userAgent,
            force
        });
        this.forceClosed = force;
        this._cleanupMedia();
        this.connectionPromise = null;
        Object.values(this.audioElements).forEach((audioElement)=>{
            audioElement.srcObject = null;
            audioElement.pause();
        });
        this.audioElements = {};
        if (!this.userAgent) return;
        this.stopHeartbeat();
        if (this.userAgent) this.userAgent.delegate = void 0;
        this.userAgent.stateChange.removeAllListeners();
        await this._disconnectTransport(force);
        this._cleanupRegister();
        try {
            this.userAgent.transport.connectReject = ()=>{};
            this.userAgent.stop().catch(console.error);
        } catch (_) {}
        this.userAgent = null;
        web_rtc_client_logger.info('sdk webrtc client closed', {
            clientId: this.clientId
        });
    }
    getNumber(session) {
        if (!session) return null;
        return session.remoteIdentity.uri._normal.user;
    }
    mute(session) {
        web_rtc_client_logger.info('sdk webrtc mute', {
            id: this.getSipSessionId(session)
        });
        this._toggleAudio(session, true);
    }
    unmute(session) {
        web_rtc_client_logger.info('sdk webrtc unmute', {
            id: this.getSipSessionId(session)
        });
        this._toggleAudio(session, false);
    }
    isAudioMuted(session) {
        if (!session || !session.sessionDescriptionHandler) return false;
        let muted = true;
        const pc = session.sessionDescriptionHandler.peerConnection;
        if (!pc) return false;
        if (pc.getSenders) {
            if (!pc.getSenders().length) return false;
            pc.getSenders().forEach((sender)=>{
                if (sender && sender.track && 'audio' === sender.track.kind) muted = muted && !sender.track.enabled;
            });
        } else {
            if (!pc.getLocalStreams().length) return false;
            pc.getLocalStreams().forEach((stream)=>{
                stream.getAudioTracks().forEach((track)=>{
                    muted = muted && !track.enabled;
                });
            });
        }
        return muted;
    }
    toggleCameraOn(session) {
        web_rtc_client_logger.info('sdk webrtc toggle camera on', {
            id: this.getSipSessionId(session)
        });
        this._toggleVideo(session, false);
    }
    toggleCameraOff(session) {
        web_rtc_client_logger.info('sdk webrtc toggle camera off', {
            id: this.getSipSessionId(session)
        });
        this._toggleVideo(session, true);
    }
    hold(session, isConference = false, hadVideo = false) {
        const sessionId = this.getSipSessionId(session);
        const hasVideo = hadVideo || this.hasLocalVideo(sessionId);
        web_rtc_client_logger.info('sdk webrtc hold', {
            sessionId,
            keys: Object.keys(this.heldSessions),
            pendingReinvite: !!session.pendingReinvite,
            isConference,
            hasVideo
        });
        if (sessionId in this.heldSessions) return Promise.resolve();
        if (session.pendingReinvite) return Promise.resolve();
        this.heldSessions[sessionId] = {
            hasVideo,
            isConference
        };
        this.mute(session);
        session.sessionDescriptionHandlerOptionsReInvite = {
            hold: true,
            conference: isConference
        };
        const options = this.getMediaConfiguration(false, isConference);
        if (!this._isWeb()) options.sessionDescriptionHandlerModifiers = [
            __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_modifiers_modifiers_2ed0685f__.holdModifier
        ];
        options.sessionDescriptionHandlerOptions = {
            constraints: options.constraints,
            hold: true,
            conference: isConference
        };
        if (session.sessionDescriptionHandler) session.sessionDescriptionHandler.localMediaStreamConstraints = options.constraints;
        return session.invite(options).catch((e)=>{
            web_rtc_client_logger.warn('sdk webrtc re-invite during hold, error', e);
        });
    }
    unhold(session, isConference = false) {
        const sessionId = this.getSipSessionId(session);
        const hasVideo = sessionId in this.heldSessions && this.heldSessions[sessionId].hasVideo;
        web_rtc_client_logger.info('sdk webrtc unhold', {
            sessionId,
            keys: Object.keys(this.heldSessions),
            pendingReinvite: !!session.pendingReinvite,
            isConference,
            hasVideo
        });
        if (session.pendingReinvite) return Promise.resolve();
        this.unmute(session);
        delete this.heldSessions[this.getSipSessionId(session)];
        session.sessionDescriptionHandlerOptionsReInvite = {
            hold: false,
            conference: isConference
        };
        const options = this.getMediaConfiguration(false, isConference);
        if (!this._isWeb()) options.sessionDescriptionHandlerModifiers = [];
        options.sessionDescriptionHandlerOptions = {
            constraints: options.constraints,
            hold: false,
            conference: isConference
        };
        return session.invite(options).catch((e)=>{
            web_rtc_client_logger.warn('sdk webrtc re-invite during resume, error', e);
        });
    }
    async upgradeToVideo(session, constraints, isConference) {
        const pc = session.sessionDescriptionHandler?.peerConnection;
        let videoSender;
        if (isConference) {
            const transceivers = pc?.getTransceivers() || [];
            const transceiverIdx = lastIndexOf(transceivers, (transceiver)=>null === transceiver.sender.track && transceiver.mid && -1 === transceiver.mid.indexOf('video'));
            videoSender = -1 !== transceiverIdx ? transceivers[transceiverIdx].sender : null;
        } else videoSender = pc && pc.getSenders && pc.getSenders().find((sender)=>null === sender.track);
        if (!videoSender) return;
        const newStream = await this.getStreamFromConstraints(constraints);
        if (!newStream) {
            console.warn(`Can't create media stream with: ${JSON.stringify(constraints || {})}`);
            return;
        }
        if (constraints && !constraints.audio) {
            const localVideoStream = session.sessionDescriptionHandler?.localMediaStream;
            const localAudioTrack = localVideoStream.getTracks().find((track)=>'audio' === track.kind);
            if (localAudioTrack) newStream.addTrack(localAudioTrack);
        }
        const videoTrack = newStream.getVideoTracks()[0];
        if (videoTrack) videoSender.replaceTrack(videoTrack);
        this.setLocalMediaStream(this.getSipSessionId(session), newStream);
        return newStream;
    }
    downgradeToAudio(session) {
        const sessionDescriptionHandler = session.sessionDescriptionHandler;
        const localStream = sessionDescriptionHandler?.localMediaStream;
        const pc = sessionDescriptionHandler?.peerConnection;
        const videoTracks = localStream.getVideoTracks();
        if (pc?.getSenders) pc.getSenders().filter((sender)=>sender.track && 'video' === sender.track.kind).forEach((videoSender)=>{
            videoSender.replaceTrack(null);
        });
        videoTracks.forEach((videoTrack)=>{
            videoTrack.enabled = false;
            videoTrack.stop();
            localStream.removeTrack(videoTrack);
        });
    }
    async getStreamFromConstraints(constraints, conference = false) {
        const video = constraints && constraints.video;
        const { constraints: newConstraints } = this.getMediaConfiguration(video, conference, constraints);
        let newStream = null;
        try {
            newStream = await wazoMediaStreamFactory(newConstraints);
        } catch (e) {}
        if (!newStream) return null;
        newStream.local = true;
        return newStream;
    }
    getHeldSession(sessionId) {
        return this.heldSessions[sessionId];
    }
    isCallHeld(session) {
        return this.getSipSessionId(session) in this.heldSessions;
    }
    isVideoRemotelyHeld(sessionId) {
        const pc = this.getPeerConnection(sessionId);
        const sdp = pc && pc.remoteDescription ? pc.remoteDescription.sdp : null;
        if (!sdp) return false;
        const videoDirection = getVideoDirection(sdp);
        return 'sendonly' === videoDirection;
    }
    sendDTMF(session, tone) {
        if (!session.sessionDescriptionHandler) return false;
        web_rtc_client_logger.info('Sending DTMF', {
            id: this.getSipSessionId(session),
            tone
        });
        return session.sessionDescriptionHandler.sendDtmf(tone);
    }
    message(destination, message) {
        const uri = this._makeURI(destination);
        if (!this.userAgent || !uri) {
            web_rtc_client_logger.warn('Null value on message', {
                uri,
                userAgent: this.userAgent
            });
            return;
        }
        const messager = new __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_messager_c3a09f5d__.Messager(this.userAgent, uri, message);
        messager.message();
    }
    transfer(session, target) {
        this.hold(session);
        web_rtc_client_logger.info('Transfering a session', {
            id: this.getSipSessionId(session),
            target
        });
        const options = {
            requestDelegate: {
                onAccept: ()=>{
                    this.hangup(session);
                }
            }
        };
        setTimeout(()=>{
            const uri = this._makeURI(target);
            if (!uri) {
                web_rtc_client_logger.warn('transfer timeout: null URI');
                return;
            }
            session.refer(uri, options);
        }, 50);
    }
    atxfer(session) {
        this.hold(session);
        web_rtc_client_logger.info('webrtc transfer started', {
            id: this.getSipSessionId(session)
        });
        const result = {
            newSession: null,
            init: async (target)=>{
                web_rtc_client_logger.info('webrtc transfer initialized', {
                    id: this.getSipSessionId(session),
                    target
                });
                result.newSession = await this.call(target);
            },
            complete: ()=>{
                web_rtc_client_logger.info('webrtc transfer completed', {
                    id: this.getSipSessionId(session),
                    referId: this.getSipSessionId(result.newSession)
                });
                session.refer(result.newSession);
            },
            cancel: ()=>{
                this.hangup(result.newSession);
                this.unhold(session);
            }
        };
        return result;
    }
    sendMessage(sipSession = null, body, contentType = 'text/plain') {
        if (!sipSession) return;
        web_rtc_client_logger.info('send WebRTC message', {
            sipId: this.getSipSessionId(sipSession),
            contentType
        });
        try {
            sipSession.message({
                requestOptions: {
                    body: {
                        content: body,
                        contentType,
                        contentDisposition: ''
                    }
                }
            });
        } catch (e) {
            console.warn(e);
        }
    }
    pingServer() {
        if (!this.isConnected()) return;
        const core = this.userAgent?.userAgentCore;
        const fromURI = this._makeURI(this.config.authorizationUser || '');
        const toURI = new __WEBPACK_EXTERNAL_MODULE_sip_js_lib_grammar_uri_b7779ac2__.URI('sip', '', this.config.host);
        if (fromURI) {
            const message = core?.makeOutgoingRequestMessage('OPTIONS', toURI, fromURI, toURI, {});
            if (message) return core?.request(message);
            web_rtc_client_logger.warn('pingServer: null message');
        }
        web_rtc_client_logger.warn('pingServer: null fromURI');
    }
    getState() {
        return this.userAgent ? states[this.userAgent.state] : __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_user_agent_state_a04f4d58__.UserAgentState.Stopped;
    }
    getContactIdentifier() {
        return this.userAgent ? `${this.userAgent.configuration.contactName}/${this.userAgent.contact.uri}` : null;
    }
    isFirefox() {
        return this._isWeb() && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }
    changeAudioOutputVolume(volume) {
        web_rtc_client_logger.info('Changing audio output volume', {
            volume
        });
        Object.values(this.audioElements).forEach((audioElement)=>{
            if (audioElement instanceof HTMLAudioElement) audioElement.volume = volume;
        });
        this.audioOutputVolume = volume;
    }
    async changeAudioOutputDevice(id) {
        web_rtc_client_logger.info('Changing audio output device', {
            id
        });
        this.audioOutputDeviceId = id;
        const promises = [];
        Object.values(this.audioElements).forEach((audioElement)=>promises.push(audioElement.setSinkId(id)));
        await Promise.allSettled(promises);
    }
    async changeAudioInputDevice(id, session, force) {
        const currentId = this.getAudioDeviceId();
        web_rtc_client_logger.info('setting audio input device', {
            id,
            currentId,
            session: !!session
        });
        if (!force && id === currentId) return null;
        let deviceId = id;
        if ('default' === id && navigator.mediaDevices) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const defaultDevice = devices.find((device)=>'default' === device.deviceId);
            if (defaultDevice) {
                const deviceLabel = defaultDevice.label.replace('Default - ', '');
                const targetDevice = devices.find((device)=>device.label === deviceLabel);
                if (targetDevice) {
                    deviceId = targetDevice.deviceId;
                    if (!force && deviceId === currentId) return null;
                }
            }
        }
        if (this.audio) {
            const prevAudio = 'object' == typeof this.audio ? this.audio : {};
            this.audio = {
                deviceId: {
                    exact: deviceId
                },
                ...'autoGainControl' in prevAudio ? {
                    autoGainControl: prevAudio.autoGainControl
                } : {},
                ...'noiseSuppression' in prevAudio ? {
                    noiseSuppression: prevAudio.noiseSuppression
                } : {},
                ...'echoCancellation' in prevAudio ? {
                    echoCancellation: prevAudio.echoCancellation
                } : {}
            };
        }
        if (session && navigator.mediaDevices) {
            const sdh = session.sessionDescriptionHandler;
            const pc = sdh?.peerConnection;
            const constraints = {
                audio: 'object' == typeof this.audio ? {
                    ...this.audio,
                    deviceId: {
                        exact: deviceId
                    }
                } : {
                    deviceId: {
                        exact: deviceId
                    }
                }
            };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            const audioTrack = stream.getAudioTracks()[0];
            const sender = pc && pc.getSenders && pc.getSenders().find((s)=>audioTrack && s && s.track && s.track.kind === audioTrack.kind);
            if (sender) {
                if (sender.track) audioTrack.enabled = sender.track.enabled;
                sender.replaceTrack(audioTrack);
            }
            return stream;
        }
        return null;
    }
    async changeVideoInputDevice(id, session) {
        this.setVideoInputDevice(id);
        if (session) return this.changeSessionVideoInputDevice(id, session);
    }
    setVideoInputDevice(id) {
        const currentId = this.getVideoDeviceId();
        web_rtc_client_logger.info('setting video input device', {
            id,
            currentId
        });
        if (id === currentId) return null;
        const videoObject = 'object' == typeof this.video ? this.video : {};
        this.video = {
            ...videoObject,
            deviceId: {
                exact: id
            }
        };
    }
    changeSessionVideoInputDevice(id, session) {
        if (!this.sessionWantsToDoVideo(session)) return Promise.resolve();
        const sdh = session.sessionDescriptionHandler;
        const pc = sdh.peerConnection;
        const sessionId = this.getSipSessionId(session);
        const localStream = this.getLocalStream(sessionId);
        web_rtc_client_logger.info('changing video input device', {
            id,
            sessionId
        });
        if (localStream) localStream.getVideoTracks().filter((track)=>track.enabled).forEach((track)=>track.stop());
        const constraints = {
            video: !id || {
                deviceId: {
                    exact: id
                }
            }
        };
        return navigator.mediaDevices.getUserMedia(constraints).then(async (stream)=>{
            const videoTrack = stream.getVideoTracks()[0];
            let sender = pc && pc.getSenders && pc.getSenders().find((s)=>videoTrack && s && s.track && s.track.kind === videoTrack.kind);
            let wasTrackEnabled = false;
            if (!sender) sender = pc && pc.getSenders && pc.getSenders().find((s)=>!s.track);
            if (sender) {
                wasTrackEnabled = !!sender.track && sender.track.enabled;
                videoTrack.enabled = wasTrackEnabled;
                if (!wasTrackEnabled) videoTrack.stop();
                sender.replaceTrack(wasTrackEnabled ? videoTrack : null);
            }
            this.eventEmitter.emit('onVideoInputChange', stream);
            this.setLocalMediaStream(sessionId, stream);
            return stream;
        });
    }
    getAudioDeviceId() {
        return this.audio && 'object' == typeof this.audio && 'deviceId' in this.audio ? this.audio.deviceId?.exact : void 0;
    }
    getVideoDeviceId() {
        return this.video && 'object' == typeof this.video && 'deviceId' in this.video ? this.video.deviceId?.exact : void 0;
    }
    reinvite(sipSession, newConstraints = null, conference = false, audioOnly = false, iceRestart = false) {
        if (!sipSession) return Promise.resolve();
        if (sipSession.pendingReinvite) return Promise.resolve();
        const wasMuted = this.isAudioMuted(sipSession);
        const shouldDoVideo = newConstraints ? newConstraints.video : this.sessionWantsToDoVideo(sipSession);
        const shouldDoScreenSharing = newConstraints && newConstraints.screen;
        const desktop = newConstraints && newConstraints.desktop;
        web_rtc_client_logger.info('Sending reinvite', {
            clientId: this.clientId,
            id: this.getSipSessionId(sipSession),
            newConstraints,
            conference,
            audioOnly,
            wasMuted,
            shouldDoVideo,
            shouldDoScreenSharing,
            desktop
        });
        if (newConstraints && newConstraints.video) {
            const modifiers = sipSession.sessionDescriptionHandlerModifiersReInvite;
            sipSession.sessionDescriptionHandlerModifiersReInvite = modifiers.filter((modifier)=>modifier !== __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_modifiers_modifiers_2ed0685f__.stripVideo);
        }
        sipSession.sessionDescriptionHandlerOptionsReInvite = {
            ...sipSession.sessionDescriptionHandlerOptionsReInvite,
            conference,
            audioOnly
        };
        const { constraints } = this.getMediaConfiguration(shouldDoVideo, conference, newConstraints);
        return sipSession.invite({
            requestDelegate: {
                onAccept: (response)=>{
                    if (sipSession instanceof __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Inviter && sipSession.outgoingRequestMessage.body) sipSession.outgoingRequestMessage.body.body = response.message.body;
                    else if (sipSession instanceof __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Invitation) sipSession.incomingInviteRequest.message.body = response.message.body;
                    web_rtc_client_logger.info('on re-INVITE accepted', {
                        id: this.getSipSessionId(sipSession),
                        wasMuted,
                        shouldDoScreenSharing
                    });
                    this.updateRemoteStream(this.getSipSessionId(sipSession), false);
                    if (wasMuted) this.mute(sipSession);
                    this._onAccepted(sipSession, response.session, false, false);
                    if (shouldDoScreenSharing) this.eventEmitter.emit(ON_SCREEN_SHARING_REINVITE, sipSession, response, desktop);
                    return this.eventEmitter.emit(ON_REINVITE, sipSession, response);
                }
            },
            sessionDescriptionHandlerModifiers: [
                replaceLocalIpModifier
            ],
            requestOptions: {
                extraHeaders: [
                    `Subject: ${shouldDoScreenSharing ? 'screenshare' : 'upgrade-video'}`
                ]
            },
            sessionDescriptionHandlerOptions: {
                constraints,
                conference,
                audioOnly,
                offerOptions: {
                    iceRestart
                }
            }
        });
    }
    async warmupAudioDevice() {
        const audioConstraints = this._getAudioConstraints();
        if (!audioConstraints) {
            web_rtc_client_logger.info('warmupAudioDevice: no audio constraints, skipping');
            return;
        }
        this.releaseWarmupStream();
        try {
            const constraintDetails = 'object' == typeof audioConstraints ? audioConstraints : {
                raw: audioConstraints
            };
            web_rtc_client_logger.info('warmupAudioDevice: acquiring mic to trigger communication profile switch', constraintDetails);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: audioConstraints
            });
            const tracks = stream.getAudioTracks();
            const trackInfo = tracks.map((t)=>({
                    id: t.id,
                    label: t.label,
                    readyState: t.readyState,
                    muted: t.muted
                }));
            web_rtc_client_logger.info('warmupAudioDevice: mic acquired, muting tracks but keeping stream alive', {
                tracks: trackInfo
            });
            tracks.forEach((track)=>{
                track.enabled = false;
            });
            this._warmupStream = stream;
        } catch (e) {
            web_rtc_client_logger.warn('warmupAudioDevice: failed to acquire mic', e);
        }
    }
    releaseWarmupStream() {
        if (this._warmupStream) {
            const tracks = this._warmupStream.getAudioTracks();
            const trackInfo = tracks.map((t)=>({
                    id: t.id,
                    label: t.label,
                    readyState: t.readyState
                }));
            web_rtc_client_logger.info('releaseWarmupStream: stopping warmup tracks', {
                tracks: trackInfo
            });
            tracks.forEach((track)=>track.stop());
            this._warmupStream = null;
        }
    }
    async getUserMedia(constraints) {
        const newConstraints = {
            audio: this._getAudioConstraints(),
            video: this._getVideoConstraints(constraints.video)
        };
        return navigator.mediaDevices.getUserMedia(newConstraints);
    }
    getPeerConnection(sessionId) {
        const sipSession = this.sipSessions[sessionId];
        if (!sipSession) return null;
        return sipSession.sessionDescriptionHandler ? sipSession.sessionDescriptionHandler.peerConnection : null;
    }
    getLocalStream(sessionId) {
        const sipSession = this.sipSessions[sessionId];
        return sipSession?.sessionDescriptionHandler?.localMediaStream || null;
    }
    getLocalTracks(sessionId) {
        const localStream = this.getLocalStream(sessionId);
        if (!localStream) return [];
        return localStream.getTracks();
    }
    hasLocalVideo(sessionId) {
        return this.getLocalTracks(sessionId).some(this._isVideoTrack);
    }
    hasALocalVideoTrack(sessionId) {
        return this.getLocalTracks(sessionId).some((track)=>'video' === track.kind);
    }
    getLocalVideoStream(sessionId) {
        return this.hasLocalVideo(sessionId) ? this.getLocalStream(sessionId) : null;
    }
    getRemoteStream(sessionId) {
        const sipSession = this.sipSessions[sessionId];
        return sipSession?.sessionDescriptionHandler?.remoteMediaStream || null;
    }
    getRemoteTracks(sessionId) {
        const remoteStream = this.getRemoteStream(sessionId);
        if (!remoteStream) return [];
        return remoteStream.getTracks();
    }
    hasRemoteVideo(sessionId) {
        return this.getRemoteTracks(sessionId).some(this._isVideoTrack);
    }
    hasARemoteVideoTrack(sessionId) {
        return this.getRemoteTracks(sessionId).some((track)=>'video' === track.kind);
    }
    getRemoteVideoStream(sessionId) {
        if (this.isVideoRemotelyHeld(sessionId)) return null;
        return this.hasRemoteVideo(sessionId) ? this.getRemoteStream(sessionId) : null;
    }
    getRemoteVideoStreamFromPc(sessionId) {
        const pc = this.getPeerConnection(sessionId);
        if (!pc) return null;
        return pc.getRemoteStreams().find((stream)=>!!stream.getVideoTracks().length);
    }
    hasVideo(sessionId) {
        return this.hasLocalVideo(sessionId) || this.hasRemoteVideo(sessionId);
    }
    hasAVideoTrack(sessionId) {
        return this.hasALocalVideoTrack(sessionId) || this.hasARemoteVideoTrack(sessionId);
    }
    getSipSessionId(sipSession) {
        if (!sipSession) return '';
        if (sipSession instanceof __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Inviter && sipSession.outgoingRequestMessage) return sipSession.outgoingRequestMessage.callId;
        if (sipSession instanceof __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Invitation && sipSession.incomingInviteRequest.message) return sipSession.incomingInviteRequest.message.callId;
        if (sipSession instanceof __WEBPACK_EXTERNAL_MODULE_sip_js_lib_core_dialogs_session_dialog_042454ee__.SessionDialog) return sipSession.dialogState.callId;
        return '';
    }
    async waitForRegister() {
        return new Promise((resolve)=>this.on(REGISTERED, resolve));
    }
    sessionWantsToDoVideo(session) {
        if (!session) return false;
        const { body } = session.request || session;
        const sdp = 'object' == typeof body && body ? body.body : body;
        return hasAnActiveVideo(sdp);
    }
    hasHeartbeat() {
        return this.heartbeat.hasHeartbeat;
    }
    startHeartbeat() {
        web_rtc_client_logger.info('sdk webrtc start heartbeat', {
            userAgent: !!this.userAgent,
            clientId: this.clientId
        });
        if (!this.userAgent) {
            this.heartbeat.stop();
            return;
        }
        this.eventEmitter.off(MESSAGE, this._boundOnHeartbeat);
        this.eventEmitter.on(MESSAGE, this._boundOnHeartbeat);
        this.heartbeat.start();
    }
    stopHeartbeat() {
        web_rtc_client_logger.info('sdk webrtc stop heartbeat', {
            clientId: this.clientId
        });
        this.heartbeat.stop();
    }
    setOnHeartbeatTimeout(cb) {
        this.heartbeatTimeoutCb = cb;
    }
    setOnHeartbeatCallback(cb) {
        this.heartbeatCb = cb;
    }
    onCallEnded(session) {
        this._cleanupMedia(session);
        const sessionId = this.getSipSessionId(session);
        delete this.sipSessions[sessionId];
        delete this.iceReconnectAttempts[sessionId];
        delete this.mediaConnectedSessions[sessionId];
        this._stopSendingStats(session);
        this.stopNetworkMonitoring(session);
    }
    async _performSacrificialWebRTCOperation() {
        web_rtc_client_logger.info('Performing sacrificial WebRTC operation for Windows Chromium bug', {
            clientId: this.clientId
        });
        const config = {
            iceServers: this.uaConfigOverrides?.peerConnectionOptions?.iceServers || WebRTCClient.getIceServers(this.config.host)
        };
        const pc1 = new RTCPeerConnection(config);
        const pc2 = new RTCPeerConnection(config);
        pc1.onicecandidate = (event)=>{
            if (event.candidate) pc2.addIceCandidate(event.candidate).catch(()=>{});
        };
        pc2.onicecandidate = (event)=>{
            if (event.candidate) pc1.addIceCandidate(event.candidate).catch(()=>{});
        };
        pc1.addTransceiver('audio', {
            direction: 'recvonly'
        });
        pc1.addTransceiver('video', {
            direction: 'recvonly'
        });
        pc1.createDataChannel('sacrifice');
        const offer = await pc1.createOffer();
        await pc1.setLocalDescription(offer);
        await pc2.setRemoteDescription(offer);
        const answer = await pc2.createAnswer();
        await pc2.setLocalDescription(answer);
        await pc1.setRemoteDescription(answer);
        await new Promise((resolve)=>{
            const timeoutId = setTimeout(()=>{
                web_rtc_client_logger.warn('Sacrificial WebRTC operation timed out waiting for ICE connection state.', {
                    clientId: this.clientId
                });
                resolve();
            }, 10000);
            const checkIceState = ()=>{
                if ('new' !== pc1.iceConnectionState && 'checking' !== pc1.iceConnectionState) {
                    clearTimeout(timeoutId);
                    web_rtc_client_logger.info(`Sacrificial WebRTC: ICE connection state reached ${pc1.iceConnectionState}`, {
                        clientId: this.clientId
                    });
                    resolve();
                }
            };
            pc1.oniceconnectionstatechange = checkIceState;
            checkIceState();
        });
        pc1.close();
        pc2.close();
        web_rtc_client_logger.info('Sacrificial WebRTC operation completed', {
            clientId: this.clientId
        });
    }
    attemptReconnection() {
        web_rtc_client_logger.info('attempt reconnection', {
            clientId: this.clientId,
            userAgent: !!this.userAgent
        });
        if (!this.userAgent) return;
        this.userAgent.attemptReconnection();
    }
    storeSipSession(session) {
        const id = this.getSipSessionId(session);
        web_rtc_client_logger.info('storing sip session', {
            id,
            clientId: this.clientId
        });
        this.sipSessions[id] = session;
    }
    getSipSession(id) {
        return id in this.sipSessions ? this.sipSessions[id] : null;
    }
    getSipSessionIds() {
        return Object.keys(this.sipSessions);
    }
    setLocalMediaStream(sipSessionId, newStream) {
        const sipSession = this.sipSessions[sipSessionId];
        if (!sipSession) return;
        web_rtc_client_logger.info('setting local media stream', {
            sipSessionId,
            tracks: newStream ? newStream.getTracks() : null
        });
        if (sipSession.sessionDescriptionHandler) sipSession.sessionDescriptionHandler._localMediaStream = newStream;
    }
    async updateLocalStream(sipSessionId, newStream) {
        const sipSession = this.sipSessions[sipSessionId];
        if (!sipSession) return;
        const oldStream = this.getLocalStream(sipSessionId);
        web_rtc_client_logger.info('updating local stream', {
            sipSessionId,
            oldStream: !!oldStream,
            tracks: newStream.getTracks()
        });
        if (oldStream) this._cleanupStream(oldStream);
        this.setLocalMediaStream(sipSessionId, newStream);
        await this._setupMedias(sipSession, newStream);
    }
    updateRemoteStream(sessionId, allTracks = true) {
        const remoteStream = this.getRemoteStream(sessionId);
        const pc = this.getPeerConnection(sessionId);
        web_rtc_client_logger.info('Updating remote stream', {
            sessionId,
            tracks: remoteStream ? remoteStream.getTracks() : null,
            receiverTracks: pc && pc.getReceivers ? pc.getReceivers().map((receiver)=>receiver.track) : null
        });
        if (!pc || !remoteStream) return;
        remoteStream.getTracks().forEach((track)=>{
            if (allTracks || 'video' === track.kind) remoteStream.removeTrack(track);
        });
        if (pc.getReceivers) pc.getReceivers().forEach((receiver)=>{
            if (allTracks || 'video' === receiver.track.kind) remoteStream.addTrack(receiver.track);
        });
    }
    getMediaConfiguration(enableVideo, conference = false, constraints = null) {
        const screenSharing = !!constraints && 'screen' in constraints && constraints.screen;
        const isDesktop = !!constraints && 'desktop' in constraints && constraints.desktop;
        const withAudio = !constraints || !('audio' in constraints) || constraints.audio;
        const mandatoryVideo = constraints && 'object' == typeof constraints.video ? constraints.video.mandatory : {};
        web_rtc_client_logger.info('Retrieving media a configuration', {
            enableVideo,
            screenSharing,
            isDesktop,
            withAudio,
            constraints
        });
        return {
            constraints: {
                audio: screenSharing ? !isDesktop : !!withAudio && this._getAudioConstraints(),
                video: screenSharing ? isDesktop ? {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        ...mandatoryVideo || {}
                    }
                } : {
                    cursor: 'always'
                } : this._getVideoConstraints(enableVideo),
                screen: screenSharing,
                desktop: isDesktop,
                conference
            },
            enableVideo,
            conference,
            offerOptions: {
                OfferToReceiveAudio: this._hasAudio(),
                OfferToReceiveVideo: enableVideo,
                mandatory: {
                    OfferToReceiveAudio: this._hasAudio(),
                    OfferToReceiveVideo: enableVideo
                }
            }
        };
    }
    isConference(sessionId) {
        return sessionId in this.conferences;
    }
    async createAudioElementFor(sessionId) {
        const audio = document.createElement('audio');
        audio.setAttribute('id', `audio-${sessionId}`);
        web_rtc_client_logger.info('creating audio element', {
            sessionId,
            audioOutputDeviceId: this.audioOutputDeviceId
        });
        if (this.audioOutputDeviceId) await audio.setSinkId(this.audioOutputDeviceId);
        if (document.body) document.body.appendChild(audio);
        this.audioElements[sessionId] = audio;
        audio.volume = this.audioOutputVolume;
        audio.autoplay = true;
        return audio;
    }
    _onTransportError() {
        web_rtc_client_logger.error('on transport error');
        this.eventEmitter.emit(TRANSPORT_ERROR);
        this.attemptReconnection();
    }
    enableLogger(logConnector) {
        if (!this.userAgent) return;
        if (this.userAgent?.transport) this.userAgent.transport.configuration.traceSip = true;
        this.userAgent.loggerFactory.builtinEnabled = true;
        this.userAgent.loggerFactory.level = 3;
        this.userAgent.loggerFactory.connector = logConnector;
    }
    _onHeartbeat(message) {
        const body = message && 'object' == typeof message ? message.data : message;
        if (body && -1 !== body.indexOf('200 OK')) {
            if (this.hasHeartbeat()) {
                web_rtc_client_logger.info('on heartbeat received from Asterisk', {
                    hasHeartbeat: this.hasHeartbeat()
                });
                this.heartbeat.onHeartbeat();
                if (this.heartbeatCb) this.heartbeatCb();
            }
        }
    }
    async _onHeartbeatTimeout() {
        web_rtc_client_logger.warn('sdk webrtc heartbeat timed out', {
            userAgent: !!this.userAgent,
            cb: !!this.heartbeatTimeoutCb
        });
        if (this.heartbeatTimeoutCb) this.heartbeatTimeoutCb();
        if (this.userAgent && this.userAgent.transport) {
            const transport = this.userAgent.transport;
            if (!transport.transitioningState && !transport.disconnectPromise) try {
                await this.userAgent.transport.disconnect();
            } catch (e) {
                web_rtc_client_logger.error('Transport disconnection after heartbeat timeout, error', e);
            }
            this._onTransportError();
        }
    }
    _isWeb() {
        return 'object' == typeof window && 'object' == typeof document;
    }
    _isVideoTrack(track) {
        return 'video' === track.kind && 'live' === track.readyState;
    }
    _hasAudio() {
        return this.hasAudio;
    }
    _getAudioConstraints() {
        return !this.audio?.deviceId?.exact || this.audio;
    }
    _getVideoConstraints(video = false) {
        if (!video) return false;
        return !this.video?.deviceId?.exact || this.video;
    }
    _connectIfNeeded() {
        web_rtc_client_logger.info('connect if needed, checking', {
            connected: this.isConnected(),
            clientId: this.clientId
        });
        if (!this.userAgent) {
            web_rtc_client_logger.info('need to recreate User Agent');
            this.userAgent = this.createUserAgent(this.uaConfigOverrides);
        }
        if (this.isConnected()) {
            web_rtc_client_logger.info('webrtc sdk, already connected');
            return Promise.resolve();
        }
        if (this.isConnecting()) {
            web_rtc_client_logger.info('webrtc sdk, already connecting...');
            this.connectionPromise = this.userAgent.transport.connectPromise;
            return Promise.resolve(this.connectionPromise);
        }
        if (this.connectionPromise) {
            web_rtc_client_logger.info('webrtc sdk, connection promise connecting...');
            return this.connectionPromise;
        }
        web_rtc_client_logger.info('WebRTC UA needs to connect');
        if (this.userAgent && this.userAgent.state !== __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_user_agent_state_a04f4d58__.UserAgentState.Stopped) this.userAgent.transitionState(__WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_user_agent_state_a04f4d58__.UserAgentState.Stopped);
        if (this.userAgent.transport && this.userAgent.transport.state !== __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_transport_state_2606bc5d__.TransportState.Disconnected) this.userAgent.transport.transitionState(__WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_transport_state_2606bc5d__.TransportState.Disconnected);
        this.connectionPromise = this.userAgent.start().catch(console.error);
        return this.connectionPromise;
    }
    _buildConfig(config, session) {
        if (!session) return new Promise((resolve)=>resolve(config));
        const client = new ApiClient({
            server: `${config.host}:${String(config.port || 443)}`
        });
        client.setToken(session.token);
        client.setRefreshToken(session.refreshToken);
        return client.confd.getUserLineSipFromToken(session.uuid).then((sipLine)=>({
                authorizationUser: sipLine.username,
                password: sipLine.secret,
                uri: `${sipLine.username}@${config.host}`,
                ...config
            }));
    }
    _createUaOptions(uaOptionsOverrides = {}) {
        let { host } = this.config;
        let port = this.config.port || 443;
        if (this.config.websocketSip) {
            const webSocketSip = this.config.websocketSip.split(':');
            [host] = webSocketSip;
            port = Number(webSocketSip[1]);
        }
        const { userUuid } = this.config;
        const uaOptions = {
            noAnswerTimeout: NO_ANSWER_TIMEOUT,
            authorizationUsername: this.config.authorizationUser,
            authorizationPassword: this.config.password,
            displayName: this.config.displayName,
            hackIpInContact: true,
            logBuiltinEnabled: this.config.log ? this.config.log.builtinEnabled : null,
            logLevel: this.config.log ? this.config.log.logLevel : null,
            logConnector: this.config.log ? this.config.log.connector : null,
            uri: this._makeURI(this.config.authorizationUser || ''),
            userAgentString: this.config.userAgentString || 'wazo-sdk',
            reconnectionAttempts: 10000,
            reconnectionDelay: 5,
            sessionDescriptionHandlerFactory: (session, options = {})=>{
                const uaLogger = session.userAgent.getLogger("sip.WazoSessionDescriptionHandler");
                const isWeb = this._isWeb();
                const iceGatheringTimeout = 'peerConnectionOptions' in options ? options.peerConnectionOptions.iceGatheringTimeout || DEFAULT_ICE_TIMEOUT : DEFAULT_ICE_TIMEOUT;
                const sdhOptions = {
                    ...options,
                    iceGatheringTimeout,
                    peerConnectionConfiguration: {
                        ...(0, __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_session_description_handler_peer_connection_configuration_default_48affb33__.defaultPeerConnectionConfiguration)(),
                        ...options.peerConnectionConfiguration || {}
                    }
                };
                const wrappedMediaStreamFactory = (constraints)=>{
                    this.releaseWarmupStream();
                    return wazoMediaStreamFactory(constraints);
                };
                return new lib_WazoSessionDescriptionHandler(uaLogger, wrappedMediaStreamFactory, sdhOptions, isWeb, session);
            },
            transportOptions: {
                traceSip: uaOptionsOverrides?.traceSip || false,
                wsServers: `wss://${host}:${port}/api/asterisk/ws${userUuid ? `?userUuid=${userUuid}` : ''}`
            },
            sessionDescriptionHandlerFactoryOptions: {
                modifiers: [
                    replaceLocalIpModifier
                ],
                alwaysAcquireMediaFirst: this.isFirefox(),
                constraints: {
                    audio: this._getAudioConstraints(),
                    video: this._getVideoConstraints()
                },
                peerConnectionOptions: {
                    iceCheckingTimeout: this.config.iceCheckingTimeout || 1000,
                    iceGatheringTimeout: this.config.iceCheckingTimeout || 1000,
                    rtcConfiguration: {
                        rtcpMuxPolicy: 'require',
                        iceServers: WebRTCClient.getIceServers(this.config.host),
                        ...this._getRtcOptions(),
                        ...uaOptionsOverrides?.peerConnectionOptions || {}
                    }
                },
                peerConnectionConfiguration: {
                    rtcpMuxPolicy: 'require',
                    iceServers: WebRTCClient.getIceServers(this.config.host),
                    ...uaOptionsOverrides?.peerConnectionOptions || {}
                }
            }
        };
        delete uaOptionsOverrides?.traceSip;
        return {
            ...uaOptions,
            ...uaOptionsOverrides
        };
    }
    _getRtcOptions() {
        return {
            mandatory: {
                OfferToReceiveAudio: this._hasAudio(),
                OfferToReceiveVideo: false
            }
        };
    }
    _setupSession(session) {
        const sipSessionId = this.getSipSessionId(session);
        if (!session.delegate) session.delegate = {};
        session.delegate.onSessionDescriptionHandler = (sdh)=>{
            sdh.on('error', (e)=>{
                this.eventEmitter.emit(ON_ERROR, e);
            });
            sdh.peerConnectionDelegate = {
                onicecandidateerror: (error)=>{
                    web_rtc_client_logger.error('on icecandidate error', {
                        address: error.address,
                        port: error.port,
                        errorCode: error.errorCode,
                        errorText: error.errorText,
                        url: error.url
                    });
                }
            };
        };
        const oldInviteRequest = session.onInviteRequest.bind(session);
        let hadRemoteVideo = false;
        session.onInviteRequest = (request)=>{
            hadRemoteVideo = this.hasARemoteVideoTrack(sipSessionId);
            oldInviteRequest(request);
        };
        session.delegate.onInvite = async (request)=>{
            let updatedCalleeName = null;
            let updatedNumber = null;
            if (session.assertedIdentity) {
                updatedNumber = session.assertedIdentity.uri.normal.user;
                updatedCalleeName = session.assertedIdentity.displayName || updatedNumber;
            }
            web_rtc_client_logger.info('re-invite received', {
                updatedCalleeName,
                updatedNumber,
                hadRemoteVideo
            });
            if (session instanceof __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Invitation) session.incomingInviteRequest.message.body = request.body;
            else if (session instanceof __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Inviter && session.outgoingInviteRequest.message.body) session.outgoingInviteRequest.message.body.body = request.body;
            this.updateRemoteStream(sipSessionId, false);
            await this._setupMedias(session);
            return this.eventEmitter.emit(ON_REINVITE, session, request, updatedCalleeName, updatedNumber, hadRemoteVideo);
        };
    }
    async _onProgress(session, early = false) {
        await this._setupMedias(session);
        const sessionId = this.getSipSessionId(session);
        this.updateRemoteStream(sessionId);
        web_rtc_client_logger.info('progress received', {
            sessionId,
            early
        });
        this.eventEmitter.emit(early ? ON_EARLY_MEDIA : ON_PROGRESS, session);
    }
    async _onAccepted(session, sessionDialog, withEvent = true, initAllTracks = true) {
        web_rtc_client_logger.info('on call accepted', {
            id: this.getSipSessionId(session),
            clientId: this.clientId,
            remoteTag: session.remoteTag
        });
        this.storeSipSession(session);
        await this._setupMedias(session);
        this.updateRemoteStream(this.getSipSessionId(session), initAllTracks);
        const pc = session.sessionDescriptionHandler?.peerConnection;
        const onTrack = (event)=>{
            const isAudioOnly = this._isAudioOnly(session);
            const { kind, label, readyState, id, muted } = event.track;
            web_rtc_client_logger.info('on track event', {
                isAudioOnly,
                kind,
                label,
                readyState,
                id,
                muted
            });
            if (isAudioOnly && 'video' === kind) event.track.stop();
            this.eventEmitter.emit(ON_TRACK, session, event);
        };
        const sessionDescriptionHandler = session.sessionDescriptionHandler;
        if (sessionDescriptionHandler?.peerConnection) sessionDescriptionHandler.peerConnection.addEventListener('track', onTrack);
        sessionDescriptionHandler.remoteMediaStream.onaddtrack = onTrack;
        if (pc) {
            const currentSessionId = this.getSipSessionId(session);
            pc.onconnectionstatechange = ()=>{
                web_rtc_client_logger.info('on peer connection state changed', {
                    state: pc.connectionState,
                    sessionId: currentSessionId
                });
                if ('connected' === pc.connectionState && !this.mediaConnectedSessions[currentSessionId]) {
                    this.mediaConnectedSessions[currentSessionId] = true;
                    this.eventEmitter.emit(ON_MEDIA_CONNECTED, session);
                }
            };
            if ('connected' === pc.connectionState && !this.mediaConnectedSessions[currentSessionId]) {
                this.mediaConnectedSessions[currentSessionId] = true;
                this.eventEmitter.emit(ON_MEDIA_CONNECTED, session);
            }
            pc.oniceconnectionstatechange = ()=>{
                web_rtc_client_logger.info('on ice connection state changed', {
                    state: pc.iceConnectionState,
                    sessionId: currentSessionId
                });
                if ('disconnected' === pc.iceConnectionState) {
                    const attempts = this.iceReconnectAttempts[currentSessionId] || 0;
                    if (attempts < MAX_ICE_RECONNECT_ATTEMPTS) {
                        this.eventEmitter.emit(ON_ICE_RECONNECTING, session);
                        this.iceReconnectAttempts[currentSessionId] = attempts + 1;
                        web_rtc_client_logger.info('ICE connection disconnected, attempting to reconnect...', {
                            sessionId: currentSessionId,
                            attempt: attempts + 1
                        });
                        const isConference = this.isConference(currentSessionId);
                        setTimeout(()=>{
                            this.reinvite(session, null, isConference, false, true);
                        }, this.iceReconnectDelay);
                    } else {
                        web_rtc_client_logger.warn('ICE reconnection failed after max attempts', {
                            sessionId: currentSessionId
                        });
                        this.eventEmitter.emit(ON_ICE_DISCONNECTED, session);
                    }
                } else if ('connected' === pc.iceConnectionState || 'completed' === pc.iceConnectionState) {
                    if (this.iceReconnectAttempts[currentSessionId] > 0) {
                        this.eventEmitter.emit(ON_ICE_RECONNECTED, session);
                        web_rtc_client_logger.info('ICE reconnected successfully', {
                            sessionId: currentSessionId
                        });
                    }
                }
            };
        }
        if (withEvent) this.eventEmitter.emit(web_rtc_client_ACCEPTED, session, sessionDialog);
        this._startSendingStats(session);
    }
    _isAudioOnly(session) {
        return Boolean(session.sessionDescriptionHandlerModifiersReInvite.find((modifier)=>modifier === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_platform_web_modifiers_modifiers_2ed0685f__.stripVideo));
    }
    async _setupMedias(session, newStream = null) {
        if (!this._isWeb()) {
            web_rtc_client_logger.info('Setup media on mobile, no need to setup html element, bailing');
            return;
        }
        const sessionId = this.getSipSessionId(session);
        const isConference = this.isConference(sessionId);
        if (sessionId in this.audioElements) {
            const existingAudio = this.audioElements[sessionId];
            if (this.audioOutputDeviceId && existingAudio.sinkId !== this.audioOutputDeviceId) try {
                await existingAudio.setSinkId(this.audioOutputDeviceId);
                web_rtc_client_logger.info('Updated sinkId on existing audio element', {
                    sessionId,
                    sinkId: this.audioOutputDeviceId
                });
            } catch (error) {
                web_rtc_client_logger.error('Failed to update sinkId on existing audio element', {
                    sessionId,
                    error
                });
            }
            web_rtc_client_logger.info('html element already exists for session', {
                sessionId
            });
            return;
        }
        if (this._hasAudio() && this._isWeb() && !(sessionId in this.audioElements)) try {
            await this.createAudioElementFor(sessionId);
            web_rtc_client_logger.info('Audio element created successfully', {
                sessionId
            });
        } catch (error) {
            web_rtc_client_logger.error('Failed to create audio element', {
                sessionId,
                error
            });
        }
        const audioElement = this.audioElements[sessionId];
        if (!audioElement) {
            web_rtc_client_logger.error('No audio element found after creation', {
                sessionId
            });
            return;
        }
        const sipSession = this.sipSessions[session.callId];
        const removeStream = this.getRemoteStream(sessionId);
        const sdh = sipSession?.sessionDescriptionHandler;
        const earlyStream = sdh ? sdh.remoteMediaStream : null;
        const stream = newStream || removeStream || earlyStream;
        if (!stream) {
            web_rtc_client_logger.info('Setup media no stream to attach, bailing');
            return;
        }
        const shouldPause = audioElement.currentTime > 0 && !audioElement.paused && !audioElement.ended && audioElement.readyState > 2;
        web_rtc_client_logger.info('setting up media', {
            sessionId,
            streams: {
                new: !!newStream,
                remove: !!removeStream,
                early: !!earlyStream
            },
            hasAudio: this._hasAudio(),
            isConference,
            shouldPause,
            streamTracks: stream.getTracks().map((t)=>({
                    kind: t.kind,
                    enabled: t.enabled,
                    muted: t.muted
                }))
        });
        if (isConference) return;
        if (shouldPause) audioElement.pause();
        audioElement.srcObject = stream;
        audioElement.volume = this.audioOutputVolume;
        try {
            await audioElement.play();
            web_rtc_client_logger.info('Audio element play() successful', {
                sessionId
            });
        } catch (error) {
            web_rtc_client_logger.error('Audio element play() failed', {
                sessionId,
                error: error.message
            });
        }
    }
    _cleanupMedia(session) {
        const sessionId = this.getSipSessionId(session);
        const localStream = this.getLocalStream(sessionId);
        if (localStream) this._cleanupStream(localStream);
        const cleanLocalElement = (id)=>{
            const element = this.audioElements[id];
            if (!element) return;
            element.pause();
            if (element.parentNode) element.parentNode.removeChild(element);
            element.srcObject = null;
            delete this.audioElements[id];
        };
        if (this._hasAudio() && this._isWeb()) {
            if (session) cleanLocalElement(this.getSipSessionId(session));
            else Object.keys(this.audioElements).forEach((id)=>cleanLocalElement(id));
        }
    }
    _cleanupStream(stream) {
        stream.getTracks().filter((track)=>track.enabled).forEach((track)=>track.stop());
    }
    _toggleAudio(session, muteAudio) {
        const sdh = session.sessionDescriptionHandler;
        const pc = sdh?.peerConnection || null;
        if (!pc) return;
        if (pc.getSenders) pc.getSenders().forEach((sender)=>{
            if (sender && sender.track && 'audio' === sender.track.kind) sender.track.enabled = !muteAudio;
        });
        else pc.getLocalStreams().forEach((stream)=>{
            stream.getAudioTracks().forEach((track)=>{
                track.enabled = !muteAudio;
            });
        });
    }
    _toggleVideo(session, muteCamera) {
        const sdh = session.sessionDescriptionHandler;
        const pc = sdh?.peerConnection;
        if (pc?.getSenders) pc.getSenders().forEach((sender)=>{
            if (sender && sender.track && 'video' === sender.track.kind) sender.track.enabled = !muteCamera;
        });
        else pc.getLocalStreams().forEach((stream)=>{
            stream.getVideoTracks().forEach((track)=>{
                track.enabled = !muteCamera;
            });
        });
    }
    _getRemoteStream(pc) {
        let remoteStream = null;
        if (pc && pc.getReceivers) {
            remoteStream = void 0 !== __webpack_require__.g && __webpack_require__.g.window && __webpack_require__.g.window.MediaStream ? new __webpack_require__.g.window.MediaStream() : new window.MediaStream();
            pc.getReceivers().forEach((receiver)=>{
                const { track } = receiver;
                if (track && remoteStream) remoteStream.addTrack(track);
            });
        } else if (pc) [remoteStream] = pc.getRemoteStreams();
        return remoteStream;
    }
    _cleanupRegister() {
        if (this.registerer) {
            this.registerer.stateChange.removeAllListeners();
            this.registerer = null;
        }
    }
    _startSendingStats(session) {
        const sdh = session.sessionDescriptionHandler;
        const pc = sdh.peerConnection;
        if (!pc) return;
        const sessionId = this.getSipSessionId(session);
        (0, __WEBPACK_EXTERNAL_MODULE_getstats__["default"])(pc, (result)=>{
            const { results, internal, nomore, ...stats } = result;
            this.statsIntervals[sessionId] = nomore;
            statsLogger.trace('stats', {
                sessionId,
                ...stats
            });
        }, SEND_STATS_DELAY);
    }
    _stopSendingStats(session) {
        const sessionId = this.getSipSessionId(session);
        web_rtc_client_logger.trace('Check for stopping stats', {
            sessionId,
            ids: Object.keys(this.statsIntervals)
        });
        if (sessionId in this.statsIntervals) {
            web_rtc_client_logger.trace('Stop sending stats for call', {
                sessionId
            });
            this.statsIntervals[sessionId]();
            delete this.statsIntervals[sessionId];
        }
    }
    _makeURI(target) {
        return __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_user_agent_8471afcd__.UserAgent.makeURI(`sip:${target}@${this.config.host}`);
    }
    async _disconnectTransport(force = false) {
        const transport = this.userAgent?.transport;
        if (force && transport) {
            transport.disconnectResolve = ()=>{};
            if (transport._ws) transport._ws.close(1000);
            return;
        }
        if (transport && !transport.disconnectPromise) try {
            await transport.disconnect();
        } catch (e) {
            web_rtc_client_logger.error('WebRTC transport disconnect, error', e);
        }
    }
    async _fetchNetworkStats(sessionId) {
        const session = this.getSipSession(sessionId);
        const stats = session ? await this.getStats(session) : null;
        if (!stats || !(sessionId in this.sessionNetworkStats)) return Promise.resolve(null);
        const networkStats = {
            audioBytesSent: 0,
            videoBytesSent: 0,
            videoBytesReceived: 0,
            audioBytesReceived: 0
        };
        const nbStats = this.sessionNetworkStats[sessionId].length;
        const lastNetworkStats = this.sessionNetworkStats[sessionId][nbStats - 1];
        const lastAudioSent = lastNetworkStats ? lastNetworkStats.audioBytesSent : 0;
        const lastAudioContentSent = lastNetworkStats ? lastNetworkStats.audioContentSent : 0;
        const lastVideoSent = lastNetworkStats ? lastNetworkStats.videoBytesSent : 0;
        const lastAudioReceived = lastNetworkStats ? lastNetworkStats.audioBytesReceived : 0;
        const lastAudioContentReceived = lastNetworkStats ? lastNetworkStats.audioContentReceived : 0;
        const lastVideoReceived = lastNetworkStats ? lastNetworkStats.videoBytesReceived : 0;
        const lastTransportSent = lastNetworkStats ? lastNetworkStats.transportSent : 0;
        const lastTransportReceived = lastNetworkStats ? lastNetworkStats.transportReceived : 0;
        let audioBytesSent = 0;
        let audioBytesReceived = 0;
        let audioContentSent = 0;
        let audioContentReceived = 0;
        let videoBytesSent = 0;
        let videoBytesReceived = 0;
        let transportSent = 0;
        let transportReceived = 0;
        let packetsLost = 0;
        stats.forEach((report)=>{
            if ('outbound-rtp' === report.type && 'audio' === report.kind) {
                audioBytesSent += Number(report.bytesSent) + Number(report.headerBytesSent);
                audioContentSent += Number(report.bytesSent);
            }
            if ('remote-outbound-rtp' === report.type && 'audio' === report.kind) audioBytesSent += Number(report.bytesSent);
            if ('outbound-rtp' === report.type && 'video' === report.kind) videoBytesSent += Number(report.bytesSent) + Number(report.headerBytesSent);
            if ('inbound-rtp' === report.type && 'audio' === report.kind) {
                packetsLost += Number(report.packetsLost);
                networkStats.packetsReceived = Number(report.packetsReceived);
                audioBytesReceived += Number(report.bytesReceived) + Number(report.headerBytesReceived);
                audioContentReceived += Number(report.bytesReceived);
                if ('audioLevel' in report) networkStats.inboundAudioLevel = Number(report.audioLevel);
            }
            if ('inbound-rtp' === report.type && 'video' === report.kind) videoBytesReceived += Number(report.bytesReceived) + Number(report.headerBytesReceived);
            if ('outbound-rtp' === report.type && 'video' === report.kind) {
                if ('framesPerSecond' in report) networkStats.framesPerSecond = Number(report.framesPerSecond);
                if ('framerateMean' in report) networkStats.framesPerSecond = Math.round(report.framerateMean);
            }
            if ('media-source' === report.type && 'audio' === report.kind) {
                if ('audioLevel' in report) networkStats.outboundAudioLevel = Number(report.audioLevel);
            }
            if ('remote-inbound-rtp' === report.type && 'audio' === report.kind) {
                packetsLost += Number(report.packetsLost);
                networkStats.roundTripTime = Number(report.roundTripTime);
                networkStats.jitter = Number(report.jitter);
            }
            if ('remote-inbound-rtp' === report.type && 'video' === report.kind) packetsLost += Number(report.packetsLost);
            if ('transport' === report.type) {
                transportSent += Number(report.bytesSent);
                transportReceived += Number(report.bytesReceived);
            }
        });
        networkStats.packetsLost = packetsLost;
        networkStats.totalAudioBytesSent = audioBytesSent;
        networkStats.audioBytesSent = audioBytesSent - lastAudioSent;
        networkStats.totalAudioBytesReceived = audioBytesReceived - lastAudioReceived;
        networkStats.audioBytesReceived = audioBytesReceived;
        networkStats.totalAudioContentSent = audioContentSent;
        networkStats.audioContentSent = audioContentSent - lastAudioContentSent;
        networkStats.totalAudioBytesReceived = audioContentReceived - lastAudioContentReceived;
        networkStats.audioContentReceived = audioContentReceived;
        networkStats.totalVideoBytesSent = videoBytesSent;
        networkStats.videoBytesSent = videoBytesSent - lastVideoSent;
        networkStats.totalVideoBytesReceived = videoBytesReceived;
        networkStats.videoBytesReceived = videoBytesReceived - lastVideoReceived;
        networkStats.totalTransportSent = transportSent - lastTransportSent;
        networkStats.transportSent = transportSent;
        networkStats.totalTransportReceived = transportReceived;
        networkStats.transportReceived = transportReceived - lastTransportReceived;
        networkStats.bandwidth = networkStats.audioBytesSent + networkStats.audioBytesReceived + networkStats.videoBytesSent + networkStats.videoBytesReceived + networkStats.transportReceived + networkStats.transportSent;
        statsLogger.info('audio-diagnostics', {
            sessionId,
            audioBytesSent: networkStats.audioBytesSent,
            audioBytesReceived: networkStats.audioBytesReceived,
            audioContentSent: networkStats.audioContentSent,
            audioContentReceived: networkStats.audioContentReceived,
            inboundAudioLevel: networkStats.inboundAudioLevel,
            outboundAudioLevel: networkStats.outboundAudioLevel,
            packetsLost: networkStats.packetsLost,
            roundTripTime: networkStats.roundTripTime,
            jitter: networkStats.jitter
        });
        if (this.sessionNetworkStats[sessionId]) {
            this.eventEmitter.emit(ON_NETWORK_STATS, session, networkStats, this.sessionNetworkStats[sessionId]);
            if (sessionId in this.sessionNetworkStats) this.sessionNetworkStats[sessionId].push(networkStats);
        }
    }
    async _accept(session, options = {}) {
        if (session.state === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Terminated || session.state === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Terminating) {
            const error = 'Trying to accept a terminated sipSession.';
            web_rtc_client_logger.warn(error, {
                state: session.state,
                sessionId: this.getSipSessionId(session)
            });
            throw new Error(error);
        }
        if (session.state !== __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Initial) {
            const error = 'Trying to accept a non Initial sipSession.';
            web_rtc_client_logger.warn(error, {
                state: session.state,
                sessionId: this.getSipSessionId(session)
            });
            throw new Error(error);
        }
        if (!session.incomingInviteRequest.acceptable) {
            const error = 'Trying to reject a non `acceptable` session';
            web_rtc_client_logger.warn(error, {
                state: session.state,
                sessionId: this.getSipSessionId(session)
            });
            throw new Error(error);
        }
        try {
            return await session.accept(options);
        } catch (e) {
            web_rtc_client_logger.warn('Session accept, error', e);
        }
    }
    async _reject(session, options = {}) {
        if (session.state !== __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Initial && session.state !== __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Establishing) {
            web_rtc_client_logger.warn('Trying to reject a session in a wrong state', {
                state: session.state,
                sessionId: this.getSipSessionId(session)
            });
            return;
        }
        if (!session.incomingInviteRequest.rejectable) {
            web_rtc_client_logger.warn('Trying to reject a non `rejectable` session', {
                state: session.state,
                sessionId: this.getSipSessionId(session)
            });
            return;
        }
        try {
            return await session.reject(options);
        } catch (e) {
            web_rtc_client_logger.warn('Session reject, error', e);
        }
    }
    async _cancel(session, options = {}) {
        if (session.state !== __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Initial && session.state !== __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Establishing) {
            web_rtc_client_logger.warn('Trying to cancel a session in a wrong state', {
                state: session.state,
                sessionId: this.getSipSessionId(session)
            });
            return;
        }
        try {
            return await session.cancel(options);
        } catch (e) {
            web_rtc_client_logger.warn('Session cancel, error', e);
        }
    }
    async _bye(session, options = {}) {
        if (session.state !== __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Established) {
            web_rtc_client_logger.warn('Trying to end a session in a wrong state', {
                state: session.state,
                sessionId: this.getSipSessionId(session)
            });
            return null;
        }
        try {
            return await session.bye(options);
        } catch (e) {
            web_rtc_client_logger.warn('Session bye, error', e);
        }
        return null;
    }
    debugAudioStatus(sessionId) {
        const audioElement = this.audioElements[sessionId];
        const session = this.getSipSession(sessionId);
        const remoteStream = this.getRemoteStream(sessionId);
        const pc = this.getPeerConnection(sessionId);
        return {
            sessionId,
            hasAudio: this._hasAudio(),
            audioOutputVolume: this.audioOutputVolume,
            audioOutputDeviceId: this.audioOutputDeviceId,
            audioElement: audioElement ? {
                exists: true,
                paused: audioElement.paused,
                ended: audioElement.ended,
                readyState: audioElement.readyState,
                currentTime: audioElement.currentTime,
                volume: audioElement.volume,
                srcObject: !!audioElement.srcObject,
                muted: audioElement.muted
            } : {
                exists: false
            },
            session: session ? {
                exists: true,
                state: session.state,
                hasSdh: !!session.sessionDescriptionHandler
            } : {
                exists: false
            },
            remoteStream: remoteStream ? {
                exists: true,
                tracks: remoteStream.getTracks().map((t)=>({
                        kind: t.kind,
                        enabled: t.enabled,
                        muted: t.muted,
                        readyState: t.readyState
                    }))
            } : {
                exists: false
            },
            peerConnection: pc ? {
                exists: true,
                iceConnectionState: pc.iceConnectionState,
                connectionState: pc.connectionState,
                signalingState: pc.signalingState
            } : {
                exists: false
            }
        };
    }
}
const webrtc_transport = {
    name: 'WebRTC Transport (WS) ~30s',
    check: (server, session)=>new Promise((resolve, reject)=>{
            const [host, port = 443] = server.split(':');
            const client = new WebRTCClient({
                host,
                port,
                media: {
                    audio: true
                }
            }, session);
            const handleError = (message)=>{
                client.close();
                reject(new Error(message));
            };
            const handleSuccess = async ()=>{
                client.stopHeartbeat();
                await client.close();
                resolve();
            };
            client.on(client.TRANSPORT_ERROR, (error)=>{
                handleError(`Transport error : ${error}`);
            });
            client.on(client.REGISTERED, ()=>{
                client.setOnHeartbeatTimeout(()=>{
                    handleError('No response to heartbeat');
                });
                client.setOnHeartbeatCallback(()=>{
                    handleSuccess();
                });
                client.startHeartbeat();
            });
        })
};
const webrtc = {
    name: 'WebRTC',
    check: (server, session)=>new Promise((resolve, reject)=>{
            if ('undefined' == typeof MediaStream) return resolve('Skipped on node');
            const [host, port = 443] = server.split(':');
            const client = new WebRTCClient({
                host,
                port,
                media: {
                    audio: true
                }
            }, session);
            const handleError = (message)=>{
                client.close();
                reject(new Error(message));
            };
            const handleSuccess = async ()=>{
                client.stopHeartbeat();
                await client.close();
                resolve();
            };
            client.on(client.TRANSPORT_ERROR, (error)=>{
                handleError(`Transport error : ${error}`);
            });
            client.on(client.REGISTERED, ()=>{
                const sipSession = client.call('*10');
                if (!sipSession || !client.getSipSessionId(sipSession)) return handleError('Unable to make call through WebRTC');
                setTimeout(()=>{
                    client.hangup(sipSession);
                    handleSuccess();
                }, 1000);
            });
        })
};
const webrtc_parseCandidate = (line)=>{
    let parts;
    parts = 0 === line.indexOf('a=candidate:') ? line.substring(12).split(' ') : line.substring(10).split(' ');
    const candidate = {
        foundation: parts[0],
        component: parts[1],
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        port: parseInt(parts[5], 10),
        type: parts[7]
    };
    for(let i = 8; i < parts.length; i += 2)switch(parts[i]){
        case 'raddr':
            candidate.relatedAddress = parts[i + 1];
            break;
        case 'rport':
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
        case 'tcptype':
            candidate.tcpType = parts[i + 1];
            break;
        default:
            break;
    }
    return candidate;
};
const timeoutDuration = 8000;
const symmetric_nat = {
    name: 'Symmetric NAT',
    check: ()=>new Promise((resolve, reject)=>{
            if ('undefined' == typeof MediaStream) return resolve('Skipped on node');
            const candidates = {};
            const rawCandidates = [];
            let nbCandidates = 0;
            const pc = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: 'stun:stun.wazo.io:443'
                    },
                    {
                        urls: 'stun:stun1.l.google.com:19302'
                    },
                    {
                        urls: 'stun:stun2.l.google.com:19302'
                    }
                ]
            });
            let timeout;
            const onEnded = ()=>{
                clearTimeout(timeout);
                if (0 === Object.keys(candidates).length) {
                    reject(new Error(`Timed out (${timeoutDuration}ms), ${nbCandidates} candidates : ${rawCandidates.join(', ')}`));
                    return;
                }
                const ports = candidates[Object.keys(candidates)[0]];
                if (1 === ports.length) resolve();
                else reject(new Error('Symmetric NAT detected, you should use a TURN server.'));
            };
            timeout = setTimeout(onEnded, timeoutDuration);
            pc.createDataChannel('wazo-check-nat');
            pc.onicecandidate = (e)=>{
                nbCandidates++;
                if (e.candidate) rawCandidates.push(e.candidate.candidate);
                if (e.candidate && -1 !== e.candidate.candidate.indexOf('srflx')) {
                    const cand = webrtc_parseCandidate(e.candidate.candidate);
                    if (cand.relatedPort) {
                        if (!candidates[cand.relatedPort]) candidates[cand.relatedPort] = [];
                        candidates[cand.relatedPort].push(cand.port);
                    }
                } else if (!e.candidate) onEnded();
            };
            pc.createOffer().then((offer)=>pc.setLocalDescription(offer));
        })
};
const checkIsIPV4 = (ip)=>{
    const blocks = ip.split('.');
    if (4 !== blocks.length) return false;
    return blocks.every((block)=>parseInt(block, 10) >= 0 && parseInt(block, 10) <= 255);
};
const ice_ipv4 = {
    name: 'Non IP v4 ice',
    check: (server, session, externalAppConfig)=>new Promise((resolve, reject)=>{
            if ('undefined' == typeof MediaStream) {
                resolve('Skipped on node');
                return;
            }
            const mobile = utils_isMobile();
            const offerOptions = {
                offerToReceiveAudio: 1
            };
            const ips = [];
            const config = {
                iceServers: [
                    {
                        urls: 'stun:stun1.l.google.com:19302'
                    },
                    {
                        urls: 'stun:stun2.l.google.com:19302'
                    }
                ]
            };
            let hasSrflxOrRelay = false;
            if (externalAppConfig && externalAppConfig.stun_servers) config.iceServers = {
                ...externalAppConfig.stun_servers.split(',').map((url)=>({
                        urls: url
                    })),
                ...config.iceServers
            };
            if (externalAppConfig && externalAppConfig.turn_servers) {
                config.iceServers = [
                    ...JSON.parse(externalAppConfig.turn_servers),
                    ...config.iceServers || []
                ];
                config.iceTransportPolicy = 'relay';
            }
            const pc = new RTCPeerConnection(config);
            pc.createDataChannel('wazo-check-ipv4');
            pc.onicecandidate = (e)=>{
                if (e.candidate) {
                    const rawCandidate = e.candidate.candidate;
                    if (-1 !== rawCandidate.indexOf('srflx') || -1 !== rawCandidate.indexOf('relay')) {
                        hasSrflxOrRelay = true;
                        const candidate = webrtc_parseCandidate(e.candidate.candidate);
                        ips.push(candidate.ip);
                    }
                } else if (!e.candidate) {
                    if (!hasSrflxOrRelay) return reject(new Error('No `srflx` or `relay` found in candidate. Please consider using a TURN server.'));
                    if (ips.every(checkIsIPV4)) resolve(null);
                    else {
                        const nonIPV4 = ips.find((ip)=>!checkIsIPV4(ip));
                        reject(new Error(`Non IPv4 ice candidate found : ${nonIPV4}.`));
                    }
                }
            };
            pc.createOffer(offerOptions).then((offer)=>pc.setLocalDescription(offer)).then((description)=>mobile ? pc.createOffer(offerOptions) : description).then((sessionDescription)=>mobile ? pc.setLocalDescription(sessionDescription) : sessionDescription);
        })
};
const checks = [
    checks_aor,
    api,
    wazo_websocket,
    webrtc_transport,
    webrtc,
    symmetric_nat,
    ice_ipv4
];
const Checker_logger = IssueReporter.loggerFor('engine-check');
class Checker {
    session;
    server;
    externalAppConfig;
    checks;
    constructor(server, session, externalAppConfig = {}){
        this.server = server;
        this.session = session;
        this.externalAppConfig = externalAppConfig;
        this.checks = [
            ...checks
        ];
    }
    async check(onCheckBegin = ()=>{}, onCheckResult = ()=>{}) {
        await this._addEngineVersion();
        Checker_logger.info('Engine check starting');
        for(let i = 0; i < this.checks.length; i++){
            const { name, check } = this.checks[i];
            Checker_logger.info(`Checking ${name} ...`);
            onCheckBegin(name);
            try {
                const result = await check(this.server, this.session, this.externalAppConfig);
                Checker_logger.info(`Checking ${name} success.`, {
                    result
                });
                onCheckResult(name, result);
            } catch (e) {
                Checker_logger.info(`Checking ${name} failure`, {
                    message: e.message
                });
                onCheckResult(name, e);
            }
        }
        Checker_logger.info('Engine check done.');
    }
    addCheck(check) {
        this.checks.push(check);
    }
    async _addEngineVersion() {
        if (!this.session.engineVersion) {
            const apiClient = new ApiClient({
                server: this.server
            });
            apiClient.setToken(this.session.token);
            const { wazo_version: engineVersion } = await apiClient.confd.getInfos();
            this.session.engineVersion = engineVersion;
        }
    }
}
const checker_Checker = Checker;
const FEATURES = [
    'chat',
    'video',
    'call_recording',
    'fax',
    'mobile_double_call',
    'mobile_gsm',
    'meeting',
    'caller_id'
];
const getScopeName = (featureName)=>`enterprise.app.${featureName}`;
const scopesToCheck = FEATURES.map(getScopeName);
class Features {
    _hasChat;
    _hasVideo;
    _hasCallRecording;
    _hasFax;
    _hasMobileDoubleCall;
    _hasMobileGsm;
    _hasMeeting;
    _hasCallerID;
    constructor(){
        this._hasChat = true;
        this._hasVideo = true;
        this._hasCallRecording = true;
        this._hasFax = true;
        this._hasMobileDoubleCall = true;
        this._hasMobileGsm = true;
        this._hasMeeting = true;
        this._hasCallerID = false;
    }
    async fetchAccess() {
        let response;
        try {
            response = await service_getApiClient().auth.getRestrictionPolicies(scopesToCheck);
        } catch (_) {}
        if (!response) return;
        const { scopes } = response;
        this._hasChat = this._hasFeatures(scopes, 'chat');
        this._hasVideo = this._hasFeatures(scopes, 'video');
        this._hasCallRecording = this._hasFeatures(scopes, 'call_recording');
        this._hasFax = this._hasFeatures(scopes, 'fax');
        this._hasMobileDoubleCall = this._hasFeatures(scopes, 'mobile_double_call');
        this._hasMobileGsm = this._hasFeatures(scopes, 'mobile_gsm');
        this._hasMeeting = this._hasFeatures(scopes, 'meeting');
        this._hasCallerID = this._hasFeatures(scopes, 'caller_id');
    }
    hasChat() {
        return this._hasChat;
    }
    hasVideo() {
        return this._hasVideo;
    }
    hasCallRecording() {
        return this._hasCallRecording;
    }
    hasFax() {
        return this._hasFax;
    }
    hasMobileDoubleCall() {
        return this._hasMobileDoubleCall;
    }
    hasMobileGsm() {
        return this._hasMobileGsm;
    }
    hasMeeting() {
        return this._hasMeeting;
    }
    hasCallerID() {
        return this._hasCallerID;
    }
    _hasFeatures(scopes, featureName) {
        const scopeName = getScopeName(featureName);
        if (!scopes || !(scopeName in scopes)) return true;
        return true === scopes[scopeName];
    }
}
const domain_Features = new Features();
class NotificationOptions {
    sound;
    vibration;
    static parse(plain) {
        if (!plain) return new NotificationOptions({
            sound: true,
            vibration: true
        });
        return new NotificationOptions({
            sound: plain.sound,
            vibration: plain.vibration
        });
    }
    static newFrom(profile) {
        return new_from(profile, NotificationOptions);
    }
    constructor({ sound, vibration } = {
        sound: true,
        vibration: true
    }){
        this.sound = sound;
        this.vibration = vibration;
    }
    setSound(sound) {
        this.sound = sound;
        return this;
    }
    setVibration(vibration) {
        this.vibration = vibration;
        return this;
    }
    enable() {
        this.vibration = true;
        this.sound = true;
        return this;
    }
    disable() {
        this.vibration = false;
        this.sound = false;
        return this;
    }
    isEnabled() {
        return this.sound || this.vibration;
    }
}
const ON_USER_AGENT = 'onUserAgent';
const ON_REGISTERED = 'onRegistered';
const ON_UNREGISTERED = 'onUnRegistered';
const WebRTCPhone_ON_PROGRESS = 'onProgress';
const ON_CALL_ACCEPTED = 'onCallAccepted';
const ON_CALL_ANSWERED = 'onCallAnswered';
const ON_CALL_INCOMING = 'onCallIncoming';
const ON_CALL_OUTGOING = 'onCallOutgoing';
const ON_CALL_MUTED = 'onCallMuted';
const ON_CALL_UNMUTED = 'onCallUnmuted';
const ON_CALL_RESUMED = 'onCallResumed';
const ON_CALL_HELD = 'onCallHeld';
const ON_CALL_UNHELD = 'onCallUnHeld';
const ON_CAMERA_DISABLED = 'onCameraDisabled';
const ON_CAMERA_RESUMED = 'onCameraResumed';
const ON_CALL_CANCELED = 'onCallCanceled';
const ON_CALL_FAILED = 'onCallFailed';
const ON_CALL_REJECTED = 'onCallRejected';
const ON_CALL_ENDED = 'onCallEnded';
const ON_CALL_ENDING = 'onCallEnding';
const ON_MESSAGE = 'onMessage';
const WebRTCPhone_ON_REINVITE = 'reinvite';
const WebRTCPhone_ON_TRACK = 'onTrack';
const ON_AUDIO_STREAM = 'onAudioStream';
const ON_VIDEO_STREAM = 'onVideoStream';
const ON_REMOVE_STREAM = 'onRemoveStream';
const ON_SHARE_SCREEN_STARTED = 'onScreenShareStarted';
const ON_SHARE_SCREEN_ENDING = 'onScreenShareEnding';
const ON_SHARE_SCREEN_ENDED = 'onScreenShareEnded';
const ON_TERMINATE_SOUND = 'terminateSound';
const ON_PLAY_RING_SOUND = 'playRingingSound';
const ON_PLAY_INBOUND_CALL_SIGNAL_SOUND = 'playInboundCallSignalSound';
const ON_PLAY_HANGUP_SOUND = 'playHangupSound';
const ON_PLAY_PROGRESS_SOUND = 'playProgressSound';
const ON_VIDEO_INPUT_CHANGE = 'videoInputChange';
const ON_CALL_ERROR = 'onCallError';
const ON_MESSAGE_TRACK_UPDATED = 'onTrackUpdated';
const WebRTCPhone_ON_NETWORK_STATS = 'onNetworkStats';
const ON_CHAT = 'phone/ON_CHAT';
const ON_SIGNAL = 'phone/ON_SIGNAL';
const WebRTCPhone_ON_ICE_DISCONNECTED = 'onIceDisconnected';
const WebRTCPhone_ON_ICE_RECONNECTING = 'onIceReconnecting';
const WebRTCPhone_ON_ICE_RECONNECTED = 'onIceReconnected';
const WebRTCPhone_ON_EARLY_MEDIA = 'onEarlyMedia';
const WebRTCPhone_ON_MEDIA_CONNECTED = 'onMediaConnected';
const MESSAGE_TYPE_CHAT = 'message/TYPE_CHAT';
const MESSAGE_TYPE_SIGNAL = 'message/TYPE_SIGNAL';
const WebRTCPhone_events = [
    ON_USER_AGENT,
    ON_REGISTERED,
    ON_UNREGISTERED,
    WebRTCPhone_ON_PROGRESS,
    ON_CALL_ACCEPTED,
    ON_CALL_ANSWERED,
    ON_CALL_INCOMING,
    ON_CALL_OUTGOING,
    ON_CALL_MUTED,
    ON_CALL_UNMUTED,
    ON_CALL_RESUMED,
    ON_CALL_HELD,
    ON_CALL_UNHELD,
    ON_CAMERA_DISABLED,
    ON_CALL_FAILED,
    ON_CALL_ENDED,
    ON_CALL_REJECTED,
    ON_MESSAGE,
    WebRTCPhone_ON_REINVITE,
    WebRTCPhone_ON_TRACK,
    ON_AUDIO_STREAM,
    ON_VIDEO_STREAM,
    ON_REMOVE_STREAM,
    ON_SHARE_SCREEN_ENDED,
    ON_TERMINATE_SOUND,
    ON_PLAY_RING_SOUND,
    ON_PLAY_INBOUND_CALL_SIGNAL_SOUND,
    ON_PLAY_HANGUP_SOUND,
    ON_PLAY_PROGRESS_SOUND,
    ON_VIDEO_INPUT_CHANGE,
    ON_SHARE_SCREEN_STARTED,
    ON_CALL_ERROR,
    ON_CHAT,
    ON_SIGNAL,
    WebRTCPhone_ON_NETWORK_STATS,
    WebRTCPhone_ON_ICE_DISCONNECTED,
    WebRTCPhone_ON_ICE_RECONNECTING,
    WebRTCPhone_ON_ICE_RECONNECTED,
    WebRTCPhone_ON_EARLY_MEDIA,
    WebRTCPhone_ON_MEDIA_CONNECTED
];
const WebRTCPhone_logger = IssueReporter.loggerFor('webrtc-phone');
class WebRTCPhone extends Emitter {
    client;
    allowVideo;
    callSessions;
    incomingSessions;
    currentSipSession;
    currentCallSession;
    audioOutputDeviceId;
    audioRingDeviceId;
    audioOutputVolume;
    audioRingVolume;
    ringingEnabled;
    acceptedSessions;
    rejectedSessions;
    ignoredSessions;
    currentScreenShare;
    lastScreenShare;
    shouldSendReinvite;
    fallbackToFirstSipSession;
    constructor(client, audioOutputDeviceId, allowVideo = false, audioRingDeviceId){
        super();
        this.client = client;
        this.allowVideo = allowVideo;
        this.callSessions = {};
        this.audioOutputDeviceId = audioOutputDeviceId;
        this.audioRingDeviceId = audioRingDeviceId || audioOutputDeviceId;
        this.audioOutputVolume = 1;
        this.audioRingVolume = 1;
        this.incomingSessions = [];
        this.ringingEnabled = true;
        this.shouldSendReinvite = false;
        this.fallbackToFirstSipSession = true;
        this.bindClientEvents();
        this.acceptedSessions = {};
        this.rejectedSessions = {};
        this.ignoredSessions = {};
    }
    register() {
        WebRTCPhone_logger.info('WebRTC register', {
            client: !!this.client
        });
        if (!this.client) return Promise.resolve();
        return this.client.register().then(()=>{
            WebRTCPhone_logger.info('WebRTC register, registered');
            return this.bindClientEvents();
        }).catch((error)=>{
            console.error('register error', error, error.message, error.stack);
            WebRTCPhone_logger.error('WebRTC register error', {
                message: error.message,
                stack: error.stack
            });
        });
    }
    unregister() {
        if (!this.client || !this.client.isRegistered()) return null;
        return this.client.unregister();
    }
    stop() {
        if (!this.client) return;
        WebRTCPhone_logger.info('WebRTC phone stop');
        this.client.stop();
    }
    removeIncomingSessions(id) {
        this.incomingSessions = this.incomingSessions.filter((sessionId)=>sessionId !== id);
    }
    isWebRTC() {
        return true;
    }
    async sendReinvite(callSession, constraints = null, conference = false, audioOnly = false, iceRestart = false) {
        const sipSession = this.findSipSession(callSession);
        WebRTCPhone_logger.info('WebRTC phone - send reinvite', {
            sessionId: this.getSipSessionId(sipSession),
            constraints,
            audioOnly,
            conference,
            iceRestart
        });
        if (!sipSession) return;
        const shouldScreenShare = constraints?.screen;
        const isUpgrade = shouldScreenShare || constraints?.video;
        if (constraints && !isUpgrade) {
            this._downgradeToAudio(callSession);
            return;
        }
        if (isUpgrade) {
            const shouldReinvite = await this._upgradeToVideo(callSession, constraints, conference);
            if (!shouldReinvite) return;
        }
        return this.client.reinvite(sipSession, constraints, conference, audioOnly, iceRestart);
    }
    getUserAgent() {
        return this.client?.config?.userAgentString || 'webrtc-phone';
    }
    startHeartbeat() {
        WebRTCPhone_logger.info('WebRTC phone - start heartbeat', {
            client: !!this.client,
            hasHeartbeat: this.client.hasHeartbeat()
        });
        if (!this.client || this.client.hasHeartbeat()) return;
        this.client.startHeartbeat();
    }
    stopHeartbeat() {
        WebRTCPhone_logger.info('WebRTC phone - stopHeartbeat', {
            client: !!this.client
        });
        if (!this.client) return;
        this.client.stopHeartbeat();
    }
    setOnHeartbeatTimeout(cb) {
        this.client.setOnHeartbeatTimeout(cb);
    }
    setOnHeartbeatCallback(cb) {
        this.client.setOnHeartbeatCallback(cb);
    }
    reconnect() {
        WebRTCPhone_logger.info('WebRTC phone - reconnect', {
            client: !!this.client
        });
        if (!this.client) return;
        this.client.attemptReconnection();
    }
    getOptions() {
        return {
            accept: true,
            decline: true,
            mute: true,
            hold: true,
            transfer: true,
            sendKey: true,
            addParticipant: false,
            record: true,
            merge: true
        };
    }
    onConnect() {
        if (!this.client) return Promise.reject(new Error('No webrtc client'));
        return this.client.onConnect();
    }
    onDisconnect() {
        if (!this.client) return Promise.reject(new Error('No webrtc client'));
        return this.client.onDisconnect();
    }
    _downgradeToAudio(callSession, withMessage = true) {
        const sipSession = this.findSipSession(callSession);
        if (!sipSession) return false;
        WebRTCPhone_logger.info('Downgrade to audio', {
            id: callSession ? callSession.getId() : null,
            withMessage
        });
        this.client.downgradeToAudio(sipSession);
        if (callSession) {
            callSession.cameraEnabled = false;
            this._updateCallSession(callSession);
        }
        if (withMessage) this._sendReinviteMessage(callSession, false);
        return true;
    }
    async _upgradeToVideo(callSession, constraints, isConference) {
        const sipSession = this.findSipSession(callSession);
        if (!sipSession) return Promise.resolve(false);
        WebRTCPhone_logger.info('Upgrade to video', {
            id: callSession ? callSession.getId() : null,
            constraints,
            isConference
        });
        const shouldScreenShare = constraints && !!constraints.screen;
        const desktop = constraints && constraints.desktop;
        const options = sipSession.sessionDescriptionHandlerOptionsReInvite;
        const wasAudioOnly = options?.audioOnly;
        const newStream = await this.client.upgradeToVideo(sipSession, constraints, isConference);
        if (callSession) {
            callSession.cameraEnabled = true;
            this._updateCallSession(callSession);
        }
        if (!newStream) return true;
        this._sendReinviteMessage(callSession, true);
        if (shouldScreenShare) this._onScreenSharing(newStream, sipSession, callSession, false, desktop);
        if (isConference && wasAudioOnly) return true;
        return false;
    }
    _sendReinviteMessage(callSession, isUpgrade) {
        const sipSession = this.findSipSession(callSession);
        WebRTCPhone_logger.info('Sending reinvite message', {
            id: callSession ? callSession.getId() : null,
            isUpgrade
        });
        setTimeout(()=>{
            this.sendMessage(sipSession, JSON.stringify({
                type: MESSAGE_TYPE_SIGNAL,
                content: {
                    type: ON_MESSAGE_TRACK_UPDATED,
                    update: isUpgrade ? 'upgrade' : 'downgrade',
                    sipCallId: sipSession && this.getSipSessionId(sipSession),
                    callId: callSession ? callSession.callId : null,
                    number: callSession ? callSession.number : null,
                    callerNumber: callSession ? callSession.callerNumber : null
                }
            }));
        }, 2500);
    }
    _bindEvents(sipSession) {
        const sipSessionId = this.getSipSessionId(sipSession);
        if (sipSession instanceof __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_f9f0ade8__.Invitation) {
            const onCancel = sipSession._onCancel.bind(sipSession);
            sipSession._onCancel = (message)=>{
                WebRTCPhone_logger.trace('on sip session canceled', {
                    callId: message.callId,
                    sipSessionId
                });
                onCancel(message);
                const elsewhere = -1 !== message.data.indexOf('cause=26') && -1 !== message.data.indexOf('completed elsewhere');
                const callSession = this._createCallSession(sipSession);
                if (sipSessionId) delete this.callSessions[sipSessionId];
                this.eventEmitter.emit(ON_CALL_CANCELED, callSession, elsewhere);
            };
        }
        sipSession.stateChange.addListener((newState)=>{
            switch(newState){
                case __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Terminating:
                    WebRTCPhone_logger.info('WebRTC phone - call terminating', {
                        sipId: this.getSipSessionId(sipSession)
                    });
                    this.eventEmitter.emit(ON_CALL_ENDING, this._createCallSession(sipSession));
                    break;
                case __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Terminated:
                    {
                        WebRTCPhone_logger.info('WebRTC phone - call terminated', {
                            sipId: this.getSipSessionId(sipSession)
                        });
                        const callSession = this._createCallSession(sipSession);
                        callSession.endTime = new Date();
                        const wasCurrentSession = this._onCallTerminated(sipSession);
                        return this.eventEmitter.emit(ON_CALL_ENDED, callSession, wasCurrentSession);
                    }
                default:
                    break;
            }
        });
        if (!sipSession.sessionDescriptionHandler) return;
        const sdh = sipSession.sessionDescriptionHandler;
        const peerConnection = sdh.peerConnection;
        if (!peerConnection) {
            WebRTCPhone_logger.info('null peer connection');
            return;
        }
        peerConnection.ontrack = (rawEvent)=>{
            const event = rawEvent;
            const [stream] = event.streams;
            const kind = event && event.track && event.track.kind;
            WebRTCPhone_logger.info('on track stream called on the peer connection', {
                callId: this.getSipSessionId(sipSession),
                streamId: stream ? stream.id : null,
                tracks: stream ? stream.getTracks() : null,
                kind
            });
            if ('audio' === kind) return this.eventEmitter.emit(ON_AUDIO_STREAM, stream);
            return this.eventEmitter.emit(ON_VIDEO_STREAM, stream, event.track.id, event, sipSession);
        };
        peerConnection.onremovestream = (event)=>{
            WebRTCPhone_logger.info('on remove stream called on the peer connection', {
                id: event.stream.id,
                tracks: event.stream.getTracks()
            });
            this.eventEmitter.emit(ON_REMOVE_STREAM, event.stream);
        };
    }
    async startScreenSharing(constraints, callSession) {
        WebRTCPhone_logger.info('WebRTC - start screen sharing', {
            constraints,
            id: callSession ? callSession.getId() : null
        });
        const screenShareStream = await this.client.getStreamFromConstraints(constraints);
        if (!screenShareStream) throw new Error(`Can't create media stream for screensharing with: ${JSON.stringify(constraints)}`);
        const screenTrack = screenShareStream.getVideoTracks()[0];
        const sipSession = this.currentSipSession;
        const pc = sipSession && this.client.getPeerConnection(this.getSipSessionId(sipSession));
        const sender = pc && pc.getSenders && pc.getSenders().find((s)=>s && s.track && 'video' === s.track.kind);
        const localStream = sipSession && this.client.getLocalStream(this.getSipSessionId(sipSession));
        const videoTrack = localStream ? localStream.getTracks().find((track)=>'video' === track.kind) : null;
        const hadVideo = !!videoTrack;
        if (videoTrack && localStream) {
            videoTrack.enabled = false;
            videoTrack.stop();
            localStream.removeTrack(videoTrack);
        }
        if (localStream) localStream.addTrack(screenTrack);
        if (sender) sender.replaceTrack(screenTrack);
        this._onScreenSharing(screenShareStream, sipSession, callSession, hadVideo, constraints.desktop);
        return screenShareStream;
    }
    async stopScreenSharing(restoreLocalStream = true, callSession) {
        if (!this.currentScreenShare) return;
        WebRTCPhone_logger.info('WebRTC phone - stop screen sharing', {
            restoreLocalStream
        });
        let reinvited = null;
        try {
            if (this.currentScreenShare.stream) this.currentScreenShare.stream.getTracks().filter((track)=>track.enabled && 'video' === track.kind).forEach((track)=>track.stop());
            if (restoreLocalStream) {
                const targetCallSession = callSession || this.currentCallSession;
                const conference = this.isConference(targetCallSession);
                const screenshareStopped = this.currentScreenShare.hadVideo;
                const constraints = {
                    audio: false,
                    video: screenshareStopped
                };
                this._downgradeToAudio(targetCallSession, false);
                await new Promise((resolve)=>setTimeout(resolve, 500));
                reinvited = await this.sendReinvite(targetCallSession, constraints, conference);
            }
        } catch (e) {
            console.warn(e);
        }
        const sipSession = this.currentSipSession;
        this.eventEmitter.emit(ON_SHARE_SCREEN_ENDED, callSession && sipSession ? this._createCallSession(sipSession, callSession, {
            screensharing: false
        }) : null);
        this.currentScreenShare = null;
        return reinvited;
    }
    _onScreenSharing(screenStream, sipSession, callSession, hadVideo, desktop) {
        const screenTrack = screenStream.getVideoTracks()[0];
        const sipSessionId = this.getSipSessionId(sipSession);
        const pc = this.client.getPeerConnection(sipSessionId);
        const sender = pc && pc.getSenders && pc.getSenders().find((s)=>s && s.track && 'video' === s.track.kind);
        WebRTCPhone_logger.info('WebRTC phone - on screensharing', {
            hadVideo,
            id: this.getSipSessionId(sipSession),
            screenTrack
        });
        if (screenTrack) screenTrack.onended = ()=>{
            WebRTCPhone_logger.info('WebRTC phone - on screenshare ended', {
                hadVideo,
                id: this.getSipSessionId(sipSession),
                screenTrack
            });
            this.eventEmitter.emit(ON_SHARE_SCREEN_ENDING, this._createCallSession(sipSession, callSession));
        };
        this.currentScreenShare = {
            stream: screenStream,
            hadVideo,
            sender,
            sipSessionId,
            desktop
        };
        this.client.setLocalMediaStream(this.getSipSessionId(sipSession), screenStream);
        this.eventEmitter.emit(ON_SHARE_SCREEN_STARTED, this._createCallSession(sipSession, callSession, {
            screensharing: true
        }), screenStream);
    }
    _onCallAccepted(sipSession, cameraEnabled) {
        WebRTCPhone_logger.info('WebRTC phone - on call accepted', {
            sipId: this.getSipSessionId(sipSession),
            cameraEnabled
        });
        const callSession = this._createAcceptedCallSession(sipSession, cameraEnabled);
        if (this.currentSipSession && !this.isCurrentCallSipSession(callSession)) {
            WebRTCPhone_logger.info('WebRTC phone - on call accepted with another ongoing call, holding it', {
                sipId: this.getSipSessionId(sipSession),
                cameraEnabled
            });
            this.holdSipSession(this.currentSipSession, this.currentCallSession, true);
        }
        this.currentSipSession = sipSession;
        this.currentCallSession = callSession;
        this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'call accepted');
        const sipSessionId = this.getSipSessionId(sipSession);
        if (sipSessionId) this.removeIncomingSessions(sipSessionId);
        callSession.answerTime = new Date();
        this._updateCallSession(callSession);
        this.eventEmitter.emit(ON_CALL_ACCEPTED, callSession, cameraEnabled);
        return callSession;
    }
    async changeAudioDevice(id) {
        WebRTCPhone_logger.info('WebRTC phone - change audio device', {
            deviceId: id
        });
        this.audioOutputDeviceId = id;
        return this.client.changeAudioOutputDevice(id);
    }
    createAudioElementFor(sessionId) {
        return this.client.createAudioElementFor(sessionId);
    }
    changeRingDevice(id) {
        WebRTCPhone_logger.info('WebRTC phone - changing ring device', {
            id
        });
        this.audioRingDeviceId = id;
    }
    changeAudioVolume(volume) {
        WebRTCPhone_logger.info('WebRTC phone - changing audio volume', {
            volume
        });
        this.audioOutputVolume = volume;
        this.client.changeAudioOutputVolume(volume);
    }
    changeRingVolume(volume) {
        WebRTCPhone_logger.info('WebRTC phone - changing ring volume', {
            volume
        });
        this.audioRingVolume = volume;
    }
    changeAudioInputDevice(id, force) {
        WebRTCPhone_logger.info('WebRTC phone - changeAudio input device', {
            deviceId: id
        });
        return this.client.changeAudioInputDevice(id, this.currentSipSession, force);
    }
    async changeVideoInputDevice(id) {
        WebRTCPhone_logger.info('WebRTC phone - change video input device', {
            deviceId: id
        });
        return this.client.changeVideoInputDevice(id, this.currentSipSession);
    }
    changeSessionVideoInputDevice(id) {
        WebRTCPhone_logger.info('WebRTC phone - change session video input device', {
            deviceId: id
        });
        return this.currentSipSession && this.client.changeSessionVideoInputDevice(id, this.currentSipSession);
    }
    _onCallTerminated(sipSession) {
        const sipSessionId = this.getSipSessionId(sipSession);
        WebRTCPhone_logger.info('WebRTC phone - on call terminated', {
            sipId: this.getSipSessionId(sipSession),
            sipSessionId,
            ids: Object.keys(this.callSessions)
        });
        const callSession = this._createCallSession(sipSession);
        const isCurrentSession = this.isCurrentCallSipSession(callSession);
        const isCurrentIncomingCall = callSession.is(this.getIncomingCallSession());
        const shouldRetrigger = isCurrentSession ? this.incomingSessions.length : isCurrentIncomingCall;
        if (isCurrentIncomingCall) setTimeout(()=>{
            this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'call terminated');
        }, 5);
        if (sipSessionId) {
            this.removeIncomingSessions(sipSessionId);
            delete this.callSessions[sipSessionId];
        }
        if (isCurrentSession) {
            this.currentSipSession = void 0;
            this.currentCallSession = void 0;
        }
        const hasIncomingCallSession = this.hasIncomingCallSession();
        WebRTCPhone_logger.info('WebRTC phone - check to re-trigger incoming call', {
            sipId: this.getSipSessionId(sipSession),
            shouldRetrigger,
            hasIncomingCallSession
        });
        this.client.onCallEnded(sipSession);
        if (hasIncomingCallSession && shouldRetrigger) {
            const nextCallSession = this.getIncomingCallSession();
            setTimeout(()=>{
                if (this.ringingEnabled) {
                    if (this.currentCallSession) this.eventEmitter.emit(ON_PLAY_INBOUND_CALL_SIGNAL_SOUND, this.audioOutputDeviceId, this.audioOutputVolume, nextCallSession);
                    else this.eventEmitter.emit(ON_PLAY_RING_SOUND, this.audioRingDeviceId, this.audioRingVolume, nextCallSession);
                }
                this.eventEmitter.emit(ON_CALL_INCOMING, nextCallSession, nextCallSession?.cameraEnabled);
            }, 100);
        }
        if (callSession.getId() in this.ignoredSessions) return false;
        if (!sipSession.isCanceled) setTimeout(()=>{
            this.eventEmitter.emit(ON_PLAY_HANGUP_SOUND, this.audioOutputDeviceId, this.audioOutputVolume, callSession);
        }, 10);
        return isCurrentSession;
    }
    setActiveSipSession(callSession) {
        const sipSessionId = this.findSipSession(callSession);
        if (!sipSessionId) return;
        this.currentSipSession = sipSessionId;
        this.currentCallSession = callSession;
    }
    hasAnActiveCall() {
        return !!this.currentSipSession;
    }
    hasActiveRemoteVideoStream() {
        const sipSession = this.currentSipSession;
        if (!sipSession) return false;
        const sdh = sipSession.sessionDescriptionHandler;
        const peerConnection = sdh.peerConnection;
        const remoteStream = peerConnection.getRemoteStreams().find((stream)=>!!stream.getVideoTracks().length);
        return remoteStream && remoteStream.getVideoTracks().some((track)=>!track.muted);
    }
    callCount() {
        return Object.keys(this.callSessions).length;
    }
    isCurrentCallSipSession(callSession) {
        if (!this.currentSipSession) return false;
        return this.currentSipSession && this.getSipSessionId(this.currentSipSession) === callSession.getId();
    }
    hasVideo(callSession) {
        return this.client.hasVideo(callSession.getId());
    }
    hasAVideoTrack(callSession) {
        return this.client.hasAVideoTrack(callSession.getId());
    }
    getLocalStreamForCall(callSession) {
        WebRTCPhone_logger.warn('WebRTCPhone.getLocalStreamForCall is deprecated, use WebRTCPhone.getLocalStream instead');
        return this.getLocalStream(callSession);
    }
    getRemoteStreamForCall(callSession) {
        WebRTCPhone_logger.warn('WebRTCPhone.getRemoteStreamForCall is deprecated, use WebRTCPhone.getRemoteStream instead');
        return this.getRemoteVideoStream(callSession);
    }
    getRemoteStreamsForCall(callSession) {
        WebRTCPhone_logger.warn('WebRTCPhone.getRemoteStreamsForCall is deprecated, use WebRTCPhone.getRemoteStreams instead');
        return this.getRemoteStream(callSession);
    }
    accept(callSession, cameraEnabled) {
        WebRTCPhone_logger.info('WebRTC phone - accept call', {
            id: callSession ? callSession.getId() : 'n/a',
            cameraEnabled
        });
        if (this.currentSipSession && !this.isCurrentCallSipSession(callSession)) this.holdSipSession(this.currentSipSession, this.currentCallSession, true);
        if (!callSession) {
            WebRTCPhone_logger.warn('no CallSession to accept.');
            return Promise.resolve(null);
        }
        const sipSessionId = this.getSipSessionIdFromCallSession(callSession);
        if (sipSessionId && !(sipSessionId in this.callSessions)) {
            WebRTCPhone_logger.warn('Call session already ended or not found, can\'t accept it.', {
                sipSessionId
            });
            return Promise.resolve(null);
        }
        if (callSession.getId() in this.acceptedSessions) {
            WebRTCPhone_logger.warn('CallSession already accepted.', {
                id: callSession ? callSession.getId() : 'n/a'
            });
            return Promise.resolve(callSession.sipCallId);
        }
        this.shouldSendReinvite = false;
        callSession.answerTime = new Date();
        this._updateCallSession(callSession);
        this.acceptedSessions[callSession.getId()] = true;
        this.eventEmitter.emit(ON_CALL_ANSWERED, callSession);
        const sipSession = this.client.getSipSession(callSession.getId());
        if (sipSession) {
            WebRTCPhone_logger.info('accept call, session found', {
                sipId: this.getSipSessionId(sipSession)
            });
            return this.client.answer(sipSession, !!this.allowVideo && cameraEnabled).then(()=>callSession.sipCallId).catch((e)=>{
                WebRTCPhone_logger.error(e);
                this.endCurrentCall(callSession);
                throw e;
            });
        }
        const error = 'No CallSession found to accept.';
        WebRTCPhone_logger.warn(error, {
            id: callSession ? callSession.getId() : 'n/a',
            ids: this.client.getSipSessionIds()
        });
        if (callSession) this.eventEmitter.emit(ON_CALL_ERROR, new Error(error), callSession);
        return Promise.resolve(null);
    }
    isAccepted(callSession) {
        return callSession && callSession.getId() in this.acceptedSessions;
    }
    async reject(callSession) {
        WebRTCPhone_logger.info('reject WebRTC called', {
            id: callSession.getId()
        });
        this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'call rejected locally');
        if (!callSession || callSession.getId() in this.rejectedSessions) return;
        this.shouldSendReinvite = false;
        this.rejectedSessions[callSession.getId()] = true;
        const sipSession = this.findSipSession(callSession);
        if (sipSession) {
            WebRTCPhone_logger.info('WebRTC rejecting', {
                sipId: this.getSipSessionId(sipSession)
            });
            this.client.reject(sipSession);
        }
    }
    async ignore(callSession) {
        WebRTCPhone_logger.info('WebRTC ignore', {
            id: callSession.getId()
        });
        this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'ignoring call');
        this.ignoredSessions[callSession.getId()] = true;
        callSession.ignore();
    }
    atxfer(callSession) {
        const sipSession = this.findSipSession(callSession);
        if (sipSession) {
            WebRTCPhone_logger.info('WebRTC atxfer', {
                sipId: this.getSipSessionId(sipSession)
            });
            return this.client.atxfer(sipSession);
        }
    }
    hold(callSession, withEvent = true) {
        WebRTCPhone_logger.info('WebRTC hold', {
            id: callSession.getId()
        });
        const sipSession = this.findSipSession(callSession);
        return sipSession ? this.holdSipSession(sipSession, callSession, withEvent) : null;
    }
    unhold(callSession, withEvent = true) {
        console.warn('Please note that `phone.unhold()` is being deprecated; `phone.resume()` is the preferred method');
        return this.resume(callSession, withEvent);
    }
    resume(callSession, withEvent = true) {
        WebRTCPhone_logger.info('WebRTC resume called', {
            id: callSession ? callSession.getId() : null
        });
        const sipSession = this.findSipSession(callSession);
        if (!sipSession) return new Promise((resolve, reject)=>reject(new Error('No session to resume')));
        WebRTCPhone_logger.info('WebRTC resuming', {
            sipId: this.getSipSessionId(sipSession)
        });
        if (this.currentSipSession && this.getSipSessionId(this.currentSipSession) !== this.getSipSessionId(sipSession)) {
            WebRTCPhone_logger.info('WebRTC hold call after resume', {
                id: this.getSipSessionId(this.currentSipSession)
            });
            this.holdSipSession(this.currentSipSession, this.currentCallSession, withEvent);
        }
        const promise = this.unholdSipSession(sipSession, callSession, withEvent);
        this.currentSipSession = sipSession;
        if (callSession) this.currentCallSession = callSession;
        return promise;
    }
    async holdSipSession(sipSession, callSession, withEvent = true) {
        if (!sipSession) return new Promise((resolve, reject)=>reject(new Error('No session to hold')));
        const sessionId = this.getSipSessionId(sipSession);
        const hasVideo = this.client.hasLocalVideo(sessionId);
        WebRTCPhone_logger.info('WebRTC hold sip session', {
            sipId: this.getSipSessionId(sipSession),
            hasVideo
        });
        if (this.currentScreenShare && this.currentScreenShare.sipSessionId === sessionId) {
            this.lastScreenShare = this.currentScreenShare;
            await this.stopScreenSharing(false, callSession);
        }
        if (hasVideo) await this.client.downgradeToAudio(sipSession);
        const isConference = !!callSession && callSession.isConference();
        const promise = this.client.hold(sipSession, isConference, hasVideo);
        if (withEvent) this.eventEmitter.emit(ON_CALL_HELD, this._createCallSession(sipSession, callSession));
        return promise;
    }
    async unholdSipSession(sipSession, callSession, withEvent = true) {
        if (!sipSession) return new Promise((resolve, reject)=>reject(new Error('No session to unhold')));
        const isConference = !!callSession && callSession.isConference();
        const sessionId = this.getSipSessionId(sipSession);
        WebRTCPhone_logger.info('WebRTC unhold sip session', {
            sessionId,
            isConference
        });
        const { hasVideo } = this.client.getHeldSession(sessionId) || {};
        const wasScreensharing = this.lastScreenShare && this.lastScreenShare.sipSessionId === sessionId;
        const wasDesktop = this.lastScreenShare && this.lastScreenShare.desktop;
        const promise = this.client.unhold(sipSession, isConference);
        if (hasVideo) {
            const constraints = {
                audio: false,
                video: true,
                screen: wasScreensharing,
                desktop: wasDesktop
            };
            await this.client.upgradeToVideo(sipSession, constraints, isConference);
        }
        const onScreenSharing = (stream)=>{
            const hadVideo = this.lastScreenShare && this.lastScreenShare.hadVideo;
            if (stream) this._onScreenSharing(stream, sipSession, callSession, hadVideo);
            this.lastScreenShare = null;
        };
        if (withEvent) {
            if (callSession) callSession.muted = false;
            const updatedCallSession = this._createCallSession(sipSession, callSession);
            this.eventEmitter.emit(ON_CALL_UNHELD, updatedCallSession);
            this.eventEmitter.emit(ON_CALL_RESUMED, updatedCallSession);
        }
        return promise.then(()=>{
            const stream = callSession ? this.getLocalVideoStream(callSession) : null;
            if (wasScreensharing) onScreenSharing(stream);
            return stream;
        });
    }
    mute(callSession, withEvent = true) {
        WebRTCPhone_logger.info('WebRTC mute called', {
            id: callSession ? callSession.getId() : null
        });
        const sipSession = this.findSipSession(callSession);
        if (!sipSession) return;
        WebRTCPhone_logger.info('WebRTC muting', {
            sipId: this.getSipSessionId(sipSession)
        });
        this.client.mute(sipSession);
        const newCallSession = this._createCallSession(sipSession, callSession, {
            muted: true
        });
        if (this.currentCallSession && newCallSession.is(this.currentCallSession)) this.currentCallSession = newCallSession;
        if (withEvent) this.eventEmitter.emit(ON_CALL_MUTED, newCallSession);
    }
    unmute(callSession, withEvent = true) {
        WebRTCPhone_logger.info('WebRTC unmute called', {
            id: callSession ? callSession.getId() : null
        });
        const sipSession = this.findSipSession(callSession);
        if (!sipSession) return;
        WebRTCPhone_logger.info('WebRTC unmuting', {
            sipId: this.getSipSessionId(sipSession)
        });
        this.client.unmute(sipSession);
        const newCallSession = this._createCallSession(sipSession, callSession, {
            muted: false
        });
        if (this.currentCallSession && newCallSession.is(this.currentCallSession)) this.currentCallSession = newCallSession;
        if (withEvent) this.eventEmitter.emit(ON_CALL_UNMUTED, newCallSession);
    }
    isAudioMuted(callSession) {
        const sipSession = this.findSipSession(callSession);
        if (!sipSession) return true;
        return this.client.isAudioMuted(sipSession);
    }
    turnCameraOn(callSession) {
        const sipSession = this.findSipSession(callSession);
        if (!sipSession) return;
        WebRTCPhone_logger.info('WebRTC turn camera on', {
            sipId: this.getSipSessionId(sipSession)
        });
        this.client.toggleCameraOn(sipSession);
        this.eventEmitter.emit(ON_CAMERA_RESUMED, this._createCameraResumedCallSession(sipSession, callSession));
    }
    turnCameraOff(callSession) {
        const sipSession = this.findSipSession(callSession);
        if (!sipSession) return;
        WebRTCPhone_logger.info('WebRTC turn camera off', {
            sipId: this.getSipSessionId(sipSession)
        });
        this.client.toggleCameraOff(sipSession);
        this.eventEmitter.emit(ON_CAMERA_DISABLED, this._createCameraDisabledCallSession(sipSession, callSession));
    }
    sendKey(callSession, tone) {
        const sipSession = this.findSipSession(callSession);
        if (!sipSession) return;
        WebRTCPhone_logger.info('WebRTC send key', {
            sipId: this.getSipSessionId(sipSession),
            tone
        });
        this.client.sendDTMF(sipSession, tone);
    }
    async makeCall(number, line, cameraEnabled, audioOnly = false, conference = false, options = {}) {
        WebRTCPhone_logger.info('make WebRTC call', {
            number,
            lineId: line ? line.id : null,
            cameraEnabled,
            audioOnly,
            conference,
            options
        });
        if (!number) return Promise.resolve(null);
        if (!this.client.isRegistered()) await this.client.register();
        if (this.currentSipSession) this.holdSipSession(this.currentSipSession, this.currentCallSession, true).catch((e)=>{
            WebRTCPhone_logger.warn('Unable to hold current session when making another call', e);
        });
        let sipSession;
        try {
            sipSession = this.client.call(number, !!this.allowVideo && cameraEnabled, audioOnly, conference, options);
            this._bindEvents(sipSession);
        } catch (error) {
            WebRTCPhone_logger.warn('make WebRTC call, error', {
                message: error.message,
                stack: error.stack
            });
            return Promise.resolve(null);
        }
        const callSession = this._createOutgoingCallSession(sipSession, cameraEnabled || false);
        callSession.setIsConference(conference);
        callSession.creationTime = new Date();
        this._updateCallSession(callSession);
        this.eventEmitter.emit(ON_PLAY_PROGRESS_SOUND, this.audioOutputDeviceId, this.audioOutputVolume);
        this.currentSipSession = sipSession;
        this.currentCallSession = callSession;
        this.eventEmitter.emit(ON_CALL_OUTGOING, callSession);
        if (sipSession.invitePromise) sipSession.invitePromise.catch((error)=>{
            this.eventEmitter.emit(ON_CALL_ERROR, error, callSession);
        });
        return Promise.resolve(callSession);
    }
    transfer(callSession, target) {
        const sipSession = this.findSipSession(callSession);
        if (!sipSession) return;
        WebRTCPhone_logger.info('WebRTC transfer', {
            sipId: this.getSipSessionId(sipSession),
            target
        });
        this.client.transfer(sipSession, target);
    }
    async indirectTransfer(source, destination) {
        const sipSession = this.client.getSipSession(source.sipCallId);
        const sipSessionTarget = this.client.getSipSession(destination.sipCallId);
        WebRTCPhone_logger.info('WebRTC indirect transfer', {
            sipId: sipSession ? this.getSipSessionId(sipSession) : null,
            target: sipSessionTarget ? this.getSipSessionId(sipSessionTarget) : null
        });
        if (!sipSessionTarget) return Promise.reject();
        return new Promise((resolve)=>{
            const options = {
                requestDelegate: {
                    onAccept: ()=>{
                        setTimeout(()=>{
                            this.hangup(destination).then(resolve);
                        }, 200);
                    }
                }
            };
            return sipSessionTarget.refer(sipSession, options);
        });
    }
    initiateCTIIndirectTransfer() {
        return Promise.resolve(null);
    }
    cancelCTIIndirectTransfer() {}
    confirmCTIIndirectTransfer() {}
    async hangup(callSession) {
        const sipSession = this.findSipSession(callSession);
        if (!sipSession) {
            console.error('Call is unknown to the WebRTC phone', callSession ? callSession.sipCallId : null, callSession ? callSession.callId : null);
            return false;
        }
        const sipSessionId = this.getSipSessionId(sipSession);
        WebRTCPhone_logger.info('WebRTC hangup', {
            sipId: this.getSipSessionId(sipSession),
            sipSessionId
        });
        await this.client.hangup(sipSession);
        if (callSession) this.endCurrentCall(callSession);
        else if (sipSessionId) delete this.callSessions[sipSessionId];
        this.shouldSendReinvite = false;
        return true;
    }
    async getStats(callSession) {
        const sipSession = this.findSipSession(callSession);
        return sipSession ? this.client.getStats(sipSession) : null;
    }
    startNetworkMonitoring(callSession, interval = 1000) {
        const sipSession = this.findSipSession(callSession);
        return sipSession ? this.client.startNetworkMonitoring(sipSession, interval) : null;
    }
    stopNetworkMonitoring(callSession) {
        const sipSession = this.findSipSession(callSession);
        return sipSession ? this.client.stopNetworkMonitoring(sipSession) : null;
    }
    forceCancel(sipSession) {
        if (!sipSession || !sipSession.outgoingInviteRequest) return;
        try {
            sipSession.outgoingInviteRequest.cancel();
        } catch (e) {
            WebRTCPhone_logger.info('force cancel, error', e);
        }
    }
    endCurrentCall(callSession) {
        const isCurrent = this.isCurrentCallSipSession(callSession);
        WebRTCPhone_logger.info('Ending current call', {
            id: callSession ? callSession.getId() : null,
            isCurrent
        });
        if (isCurrent) {
            this.currentSipSession = void 0;
            this.currentCallSession = void 0;
        }
        this.eventEmitter.emit(ON_TERMINATE_SOUND, callSession, 'locally ended');
    }
    onConnectionMade() {}
    isConference(callSession) {
        if (!callSession) return false;
        return this.client && this.client.isConference(callSession.sipCallId);
    }
    async close(force = false) {
        WebRTCPhone_logger.info('WebRTC close');
        try {
            await Promise.race([
                this.unregister(),
                new Promise((resolve, reject)=>setTimeout(()=>reject(new Error('Unregister, timed out')), 3000))
            ]);
        } catch (e) {
            WebRTCPhone_logger.error('WebRTC close, unregister error', e);
        }
        await this.client.close(force);
        this.unbind();
        this.incomingSessions = [];
        this.currentSipSession = void 0;
        this.currentCallSession = void 0;
        this.shouldSendReinvite = false;
        this.rejectedSessions = {};
    }
    isRegistered() {
        return this.client && this.client.isRegistered();
    }
    enableRinging() {
        WebRTCPhone_logger.info('WebRTC enable ringing');
        this.ringingEnabled = true;
    }
    disableRinging() {
        WebRTCPhone_logger.info('WebRTC disable ringing');
        this.ringingEnabled = false;
    }
    getCurrentCallSession() {
        if (!this.currentSipSession) return null;
        return this._createCallSession(this.currentSipSession, this.currentCallSession);
    }
    hasIncomingCallSession() {
        return this.incomingSessions.length > 0;
    }
    getIncomingCallSession() {
        if (!this.hasIncomingCallSession()) return null;
        const sessionId = this.incomingSessions[0];
        const sipSession = this.client.getSipSession(sessionId);
        if (!sipSession) return null;
        return this._createCallSession(sipSession);
    }
    sendMessage(sipSession = null, body, contentType = 'text/plain') {
        return this.client.sendMessage(sipSession, body, contentType);
    }
    getLocalStream(callSession) {
        return callSession ? this.client.getLocalStream(callSession.sipCallId) : null;
    }
    getLocalVideoStream(callSession) {
        return callSession ? this.client.getLocalVideoStream(callSession.sipCallId) : null;
    }
    getLocalMediaStream(callSession) {
        WebRTCPhone_logger.warn('WebRTCPhone.getLocalMediaStream is deprecated, use WebRTCPhone.getLocalStream instead');
        return this.getLocalStream(callSession);
    }
    hasLocalVideo(callSession) {
        return !!callSession && this.client.hasLocalVideo(callSession.sipCallId);
    }
    hasALocalVideoTrack(callSession) {
        return !!callSession && this.client.hasALocalVideoTrack(callSession.sipCallId);
    }
    getRemoteStream(callSession) {
        return callSession ? this.client.getRemoteStream(callSession.sipCallId) : null;
    }
    getRemoteVideoStream(callSession) {
        return callSession ? this.client.getRemoteVideoStream(callSession.sipCallId) : null;
    }
    getRemoteVideoStreamFromPc(callSession) {
        return callSession ? this.client.getRemoteVideoStreamFromPc(callSession.sipCallId) : null;
    }
    hasRemoteVideo(callSession) {
        return !!callSession && this.client.hasRemoteVideo(callSession.sipCallId);
    }
    setMediaConstraints(media) {
        this.client.setMediaConstraints(media);
    }
    async warmupAudioDevice() {
        return this.client.warmupAudioDevice();
    }
    releaseWarmupStream() {
        this.client.releaseWarmupStream();
    }
    isVideoRemotelyHeld(callSession) {
        return !!callSession && this.client.isVideoRemotelyHeld(callSession.sipCallId);
    }
    bindClientEvents() {
        this.client.unbind();
        this.client.on(this.client.INVITE, (sipSession, wantsToDoVideo)=>{
            const autoAnswer = 'Auto' === sipSession.request.getHeader('Answer-Mode');
            const withVideo = !!this.allowVideo && wantsToDoVideo;
            WebRTCPhone_logger.info('WebRTC invite received', {
                sipId: this.getSipSessionId(sipSession),
                withVideo,
                autoAnswer
            });
            const callSession = this._createIncomingCallSession(sipSession, withVideo, null, autoAnswer);
            this.incomingSessions.push(callSession.getId());
            this._bindEvents(sipSession);
            this.client.storeSipSession(sipSession);
            callSession.creationTime = new Date();
            this._updateCallSession(callSession);
            this.eventEmitter.emit(ON_CALL_INCOMING, callSession, wantsToDoVideo);
            if (this.currentSipSession) this.eventEmitter.emit(ON_PLAY_INBOUND_CALL_SIGNAL_SOUND, this.audioOutputDeviceId, this.audioOutputVolume, callSession);
            else if (this.ringingEnabled) this.eventEmitter.emit(ON_PLAY_RING_SOUND, this.audioRingDeviceId, this.audioRingVolume, callSession);
        });
        this.client.on(this.client.ON_REINVITE, (...args)=>{
            WebRTCPhone_logger.info('WebRTC on reinvite', {
                sessionId: args[0].id,
                inviteId: args[1].id,
                updatedCalleeName: args[2],
                updatedNumber: args[3]
            });
            const sipSession = args[0];
            setTimeout(()=>{
                this._createCallSession(sipSession, this.callSessions[this.getSipSessionId(sipSession)]);
                this.eventEmitter.emit.apply(this.eventEmitter, [
                    this.client.ON_REINVITE,
                    ...args
                ]);
            }, 2000);
        });
        this.client.on(this.client.ACCEPTED, async (sipSession)=>{
            const sessionId = this.getSipSessionId(sipSession);
            const hasSession = sessionId in this.callSessions;
            WebRTCPhone_logger.info('WebRTC call accepted', {
                sipId: sessionId,
                hasSession
            });
            if (!hasSession) {
                WebRTCPhone_logger.warn('Call accepted ignored, session is no longer present in the WebRtcPhone', {
                    sessionId
                });
                return;
            }
            this._onCallAccepted(sipSession, this.client.hasVideo(sessionId));
            if (this.audioOutputDeviceId) await this.client.changeAudioOutputDevice(this.audioOutputDeviceId);
        });
        this.client.on('ended', ()=>{});
        this.client.on(this.client.ON_ERROR, (e)=>{
            WebRTCPhone_logger.error('WebRTC error', e);
            this.eventEmitter.emit(ON_CALL_ERROR, e);
        });
        this.client.on(this.client.REJECTED, (session)=>{
            WebRTCPhone_logger.info('WebRTC call rejected', {
                id: this.getSipSessionId(session)
            });
            const callSession = this._createCallSession(session);
            delete this.callSessions[this.getSipSessionId(session)];
            callSession.endTime = new Date();
            this.eventEmitter.emit(ON_CALL_REJECTED, callSession);
        });
        this.client.on(this.client.UNREGISTERED, ()=>{
            WebRTCPhone_logger.info('WebRTC unregistered');
            this.eventEmitter.emit(ON_UNREGISTERED);
        });
        this.client.on(this.client.ON_ICE_DISCONNECTED, ()=>{
            WebRTCPhone_logger.info('ICE connection disconnected');
            this.eventEmitter.emit(WebRTCPhone_ON_ICE_DISCONNECTED);
        });
        this.client.on(this.client.ON_ICE_RECONNECTING, ()=>{
            WebRTCPhone_logger.info('ICE connection reconnecting');
            this.eventEmitter.emit(WebRTCPhone_ON_ICE_RECONNECTING);
        });
        this.client.on(this.client.ON_ICE_RECONNECTED, ()=>{
            WebRTCPhone_logger.info('ICE connection reconnected');
            this.eventEmitter.emit(WebRTCPhone_ON_ICE_RECONNECTED);
        });
        this.client.on(this.client.ON_MEDIA_CONNECTED, (sipSession)=>{
            const sessionId = this.getSipSessionId(sipSession);
            WebRTCPhone_logger.info('WebRTC media connected', {
                sipId: sessionId
            });
            const callSession = this.callSessions[sessionId];
            if (callSession) this.eventEmitter.emit(WebRTCPhone_ON_MEDIA_CONNECTED, callSession);
            else WebRTCPhone_logger.warn('ON_MEDIA_CONNECTED fired but no callSession found', {
                sipId: sessionId
            });
        });
        this.client.on(this.client.ON_PROGRESS, (session)=>{
            WebRTCPhone_logger.info('WebRTC progress (180)');
            const callSession = this._createCallSession(session, null, {
                incoming: false,
                ringing: true,
                callId: this.getSipSessionId(session)
            });
            this.eventEmitter.emit(WebRTCPhone_ON_PROGRESS, callSession, this.audioOutputDeviceId, this.audioOutputVolume);
        });
        this.client.on(this.client.ON_EARLY_MEDIA, (session)=>{
            WebRTCPhone_logger.info('WebRTC early media');
            const callSession = this._createCallSession(session, null, {
                incoming: false,
                ringing: true,
                callId: this.getSipSessionId(session)
            });
            this.eventEmitter.emit(WebRTCPhone_ON_EARLY_MEDIA, callSession, this.audioOutputDeviceId, this.audioOutputVolume);
        });
        this.client.on(this.client.REGISTERED, ()=>{
            WebRTCPhone_logger.info('WebRTC registered', {
                shouldSendReinvite: this.shouldSendReinvite,
                state: this.currentSipSession ? this.currentSipSession.state : null,
                currentSipSession: !!this.currentSipSession
            });
            this.stopHeartbeat();
            this.eventEmitter.emit(ON_REGISTERED);
            if (this.shouldSendReinvite && this.currentSipSession && this.currentSipSession.state === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Established) {
                this.shouldSendReinvite = false;
                const pc = this.currentSipSession?.sessionDescriptionHandler?.peerConnection;
                const isConference = !!pc && pc.sfu;
                const hasVideo = this.currentCallSession && this.currentCallSession.cameraEnabled;
                try {
                    this.sendReinvite(this.currentCallSession, null, isConference, !hasVideo, true);
                } catch (e) {
                    WebRTCPhone_logger.error('WebRTC reinvite after register, error', {
                        message: e.message,
                        stack: e.stack
                    });
                }
            }
        });
        this.client.on(this.client.CONNECTED, ()=>{
            WebRTCPhone_logger.info('WebRTC client connected');
            this.stopHeartbeat();
        });
        this.client.on(this.client.DISCONNECTED, ()=>{
            WebRTCPhone_logger.info('WebRTC client disconnected');
            this.eventEmitter.emit(ON_UNREGISTERED);
            if (!this.client.hasHeartbeat()) this.startHeartbeat();
            this.shouldSendReinvite = true;
        });
        this.client.on(this.client.ON_TRACK, (session, event)=>{
            this.eventEmitter.emit(WebRTCPhone_ON_TRACK, session, event);
        });
        this.client.on('onVideoInputChange', (stream)=>{
            this.eventEmitter.emit(ON_VIDEO_INPUT_CHANGE, stream);
        });
        this.client.on(this.client.MESSAGE, (message)=>{
            this._onMessage(message);
            this.eventEmitter.emit(ON_MESSAGE, message);
        });
        this.client.on(this.client.ON_NETWORK_STATS, (session, stats, previousStats)=>{
            const callSession = this.getCallSession(this.getSipSessionId(session));
            this.eventEmitter.emit(WebRTCPhone_ON_NETWORK_STATS, callSession, stats, previousStats);
        });
        this.client.on(this.client.ON_SCREEN_SHARING_REINVITE, (sipSession, response, desktop)=>{
            const sipSessionId = this.getSipSessionId(sipSession);
            const localStream = this.client.getLocalStream(sipSessionId);
            const callSession = this.callSessions[sipSessionId];
            WebRTCPhone_logger.info('Updrading directly in screensharing mode', {
                sipSessionId,
                tracks: localStream?.getTracks() || null
            });
            this._onScreenSharing(localStream, sipSession, callSession, false, desktop);
        });
    }
    findSipSession(callSession) {
        const keys = this.client.getSipSessionIds();
        const keyIndex = keys.findIndex((sessionId)=>callSession && callSession.isId(sessionId));
        if (-1 === keyIndex) {
            let currentSipSessionId = null;
            if (this.currentSipSession) currentSipSessionId = this.getSipSessionId(this.currentSipSession);
            else if (this.fallbackToFirstSipSession) [currentSipSessionId] = this.client.getSipSessionIds();
            return currentSipSessionId ? this.client.getSipSession(currentSipSessionId) : null;
        }
        return this.client.getSipSession(keys[keyIndex]);
    }
    getCallSession(sipSessionId) {
        return this.callSessions[sipSessionId];
    }
    getSipSessionId(sipSession) {
        if (!sipSession) return '';
        return this.client.getSipSessionId(sipSession);
    }
    getSipSessionIdFromCallSession(callSession) {
        const sipSession = this.findSipSession(callSession);
        return sipSession ? this.getSipSessionId(sipSession) : null;
    }
    _updateCallSession(callSession) {
        const sipSessionId = this.getSipSessionIdFromCallSession(callSession);
        if (sipSessionId) this.callSessions[sipSessionId] = callSession;
    }
    _onMessage(message) {
        if (!message || 'MESSAGE' !== message.method) return;
        let body;
        try {
            body = JSON.parse(message.body || '');
        } catch (e) {
            return;
        }
        const { type, content } = body;
        switch(type){
            case MESSAGE_TYPE_CHAT:
                this.eventEmitter.emit(ON_CHAT, content);
                break;
            case MESSAGE_TYPE_SIGNAL:
                this.eventEmitter.emit(ON_SIGNAL, content);
                break;
            default:
        }
    }
    _createIncomingCallSession(sipSession, cameraEnabled, fromSession, autoAnswer = false) {
        return this._createCallSession(sipSession, fromSession, {
            incoming: true,
            ringing: true,
            cameraEnabled,
            autoAnswer
        });
    }
    _createOutgoingCallSession(sipSession, cameraEnabled, fromSession) {
        return this._createCallSession(sipSession, fromSession, {
            incoming: false,
            ringing: true,
            cameraEnabled
        });
    }
    _createAcceptedCallSession(sipSession, cameraEnabled, fromSession) {
        return this._createCallSession(sipSession, fromSession, {
            cameraEnabled: void 0 !== cameraEnabled && cameraEnabled
        });
    }
    _createMutedCallSession(sipSession, fromSession) {
        return this._createCallSession(sipSession, fromSession, {
            muted: true
        });
    }
    _createUnmutedCallSession(sipSession, fromSession) {
        return this._createCallSession(sipSession, fromSession, {
            muted: false
        });
    }
    _createCameraResumedCallSession(sipSession, fromSession) {
        return this._createCallSession(sipSession, fromSession, {
            videoMuted: false
        });
    }
    _createCameraDisabledCallSession(sipSession, fromSession) {
        return this._createCallSession(sipSession, fromSession, {
            videoMuted: true
        });
    }
    _createCallSession(sipSession, fromSession, extra = {}) {
        const identity = sipSession ? sipSession.remoteIdentity || sipSession.assertedIdentity : null;
        const number = identity ? identity.uri._normal.user : null;
        const { state } = sipSession || {};
        const sessionId = this.getSipSessionId(sipSession);
        fromSession = fromSession || this.callSessions[sessionId];
        const callSession = new CallSession({
            callId: fromSession && fromSession.callId,
            sipCallId: sessionId,
            sipStatus: state,
            displayName: identity ? identity.displayName || number : number,
            startTime: fromSession ? fromSession.startTime : new Date(),
            creationTime: fromSession ? fromSession.creationTime : null,
            answerTime: fromSession ? fromSession.answerTime : null,
            endTime: fromSession ? fromSession.endTime : null,
            answered: state === __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState.Established,
            paused: this.client.isCallHeld(sipSession),
            isCaller: fromSession ? fromSession.isCaller : 'incoming' in extra && !extra.incoming,
            cameraEnabled: fromSession ? fromSession.isCameraEnabled() : this.client.hasVideo(sessionId),
            number,
            ringing: false,
            muted: fromSession ? fromSession.isMuted() : this.client.isAudioMuted(sipSession),
            videoMuted: !!fromSession && fromSession.isVideoMuted(),
            recording: !!fromSession && fromSession.isRecording(),
            recordingPaused: !!fromSession && fromSession.isRecordingPaused(),
            recordingState: fromSession ? fromSession.recordingState : RECORDING_STATE.INACTIVE,
            sipSession,
            conference: !!fromSession && fromSession.isConference(),
            ...extra
        });
        this.callSessions[sessionId] = callSession;
        return callSession;
    }
}
class Room {
    id;
    name;
    connectedCallSession;
    participants;
    constructor({ id, connectedCallSession, participants, name }){
        this.id = id;
        this.connectedCallSession = connectedCallSession;
        this.participants = participants;
        this.name = name;
    }
    getExtension() {
        return this.connectedCallSession ? this.connectedCallSession.number : null;
    }
    connect(callSession) {
        return new Room({
            ...this,
            connectedCallSession: callSession
        });
    }
    has(callSession) {
        return !!this.connectedCallSession && this.connectedCallSession.is(callSession);
    }
    addParticipant(uuid, extension, talking = null) {
        if (!this.participants.some((participant)=>participant.uuid === uuid || participant.extension === extension)) return new Room({
            ...this,
            participants: [
                ...this.participants,
                {
                    uuid,
                    extension,
                    talking
                }
            ]
        });
        return this;
    }
    updateParticipant(uuid, participant, shouldAdd = false) {
        const idx = this.participants.findIndex((someParticipant)=>someParticipant.uuid === uuid);
        if (-1 === idx && !shouldAdd) return this;
        const updatedParticipants = [
            ...this.participants
        ];
        if (-1 !== idx) updatedParticipants[idx] = {
            ...updatedParticipants[idx],
            ...participant
        };
        else updatedParticipants.push(participant);
        return new Room({
            ...this,
            participants: updatedParticipants
        });
    }
    updateParticipantByExtension(extension, participant, shouldAdd = false) {
        const idx = this.participants.findIndex((someParticipant)=>someParticipant.extension === extension);
        if (-1 === idx && !shouldAdd) return this;
        const updatedParticipants = [
            ...this.participants
        ];
        if (-1 !== idx) updatedParticipants[idx] = {
            ...updatedParticipants[idx],
            ...participant
        };
        else updatedParticipants.push(participant);
        return new Room({
            ...this,
            participants: updatedParticipants
        });
    }
    hasCallWithId(id) {
        return !!this.connectedCallSession && this.connectedCallSession.getId() === id;
    }
    disconnect() {
        return new Room({
            ...this,
            connectedCallSession: null
        });
    }
    removeParticipantWithUUID(uuid) {
        return new Room({
            ...this,
            participants: this.participants.filter((participant)=>participant.uuid !== uuid)
        });
    }
    removeParticipantWithExtension(extension) {
        return new Room({
            ...this,
            participants: this.participants.filter((participant)=>participant.extension !== extension)
        });
    }
    updateFrom(room) {
        update_from(this, room);
    }
    static newFrom(room) {
        return new_from(room, Room);
    }
}
class SFUNotAvailableError extends Error {
    constructor(message = 'Sorry your user is not configured to support video conference'){
        super(message);
        this.name = 'SFUNotAvailableError';
    }
}
class SwitchboardCall {
    static STATE;
    id;
    callSession;
    callerIdName;
    callerIdNumber;
    answerTime;
    participantId;
    state;
    switchboardName;
    switchboardUuid;
    type;
    static parse(plain) {
        return new SwitchboardCall({
            id: plain.id,
            callSession: plain.callSession || null,
            callerIdName: plain.caller_id_name || null,
            callerIdNumber: plain.caller_id_number || null,
            participantId: plain.participantId || null,
            answerTime: plain.startTime,
            state: plain.state,
            switchboardName: plain.switchboardName,
            switchboardUuid: plain.switchboardUuid
        });
    }
    constructor({ id, callSession, callerIdName, callerIdNumber, participantId, answerTime, state, switchboardName, switchboardUuid }){
        this.id = id;
        this.callSession = callSession;
        this.callerIdName = callerIdName;
        this.callerIdNumber = callerIdNumber;
        this.participantId = participantId;
        this.answerTime = answerTime;
        this.state = state;
        this.switchboardName = switchboardName;
        this.switchboardUuid = switchboardUuid;
        this.type = 'SwitchboardCall';
    }
    updateFrom(switchboardCall) {
        update_from(this, switchboardCall);
    }
    getId() {
        return this.id;
    }
    static newFrom(switchboardCall) {
        return new_from(switchboardCall, SwitchboardCall);
    }
}
SwitchboardCall.STATE = {
    INCOMING: 'incoming',
    ONGOING: 'ongoing',
    HELD: 'held'
};
const domain_SwitchboardCall = SwitchboardCall;
class InvalidSubscription extends Error {
}
class InvalidAuthorization extends Error {
}
class NoTenantIdError extends Error {
}
class NoDomainNameError extends Error {
}
class NoSamlRouteError extends Error {
}
class SamlConfigError extends Error {
}
const Auth_logger = IssueReporter.loggerFor('simple-auth');
class Auth_Auth {
    clientId;
    expiration;
    minSubscriptionType;
    authorizationName;
    host;
    session;
    onRefreshTokenCallback;
    onRefreshTokenCallbackError;
    onHostFromHeadersCallback;
    authenticated;
    mobile;
    BACKEND_WAZO;
    BACKEND_LDAP;
    usingEdgeServer;
    onSetUsingEdgeServer;
    constructor(){
        this.expiration = DETAULT_EXPIRATION;
        this.authenticated = false;
        this.minSubscriptionType = null;
        this.BACKEND_WAZO = DEFAULT_BACKEND_USER;
        this.BACKEND_LDAP = BACKEND_LDAP_USER;
    }
    init(clientId, expiration, minSubscriptionType, authorizationName, mobile) {
        this.clientId = clientId;
        this.expiration = expiration;
        this.minSubscriptionType = void 0 === minSubscriptionType ? null : minSubscriptionType;
        this.authorizationName = authorizationName;
        this.host = null;
        this.session = null;
        this.mobile = mobile || false;
        setApiClientId(this.clientId);
        setRefreshExpiration(this.expiration);
        setOnRefreshToken((token, session)=>{
            Auth_logger.info('on refresh token done', {
                token: obfuscateToken(token)
            });
            setApiToken(token);
            simple.Websocket.updateToken(token);
            if (this.onRefreshTokenCallback) this.onRefreshTokenCallback(token, session);
        });
        setOnRefreshTokenError((error)=>{
            Auth_logger.error('on refresh token error', error);
            if (this.onRefreshTokenCallbackError) this.onRefreshTokenCallbackError(error);
        });
    }
    setFetchOptions(options) {
        setFetchOptions(options);
    }
    async logIn(username, password, backend, extra) {
        let tenantId = null;
        let domainName = null;
        if ('string' == typeof extra) tenantId = extra;
        if (extra && 'object' == typeof extra) domainName = extra.domainName;
        if (backend && backend !== this.BACKEND_WAZO && !tenantId && !domainName) {
            if (!tenantId) throw new NoTenantIdError('No tenant id');
            if (!domainName) throw new NoDomainNameError('No domain name');
        }
        this.authenticated = false;
        this.session = null;
        const rawSession = await service_getApiClient().auth.logIn({
            username,
            password,
            backend: backend,
            tenantId: tenantId,
            domainName: domainName,
            expiration: this.expiration,
            mobile: this.mobile
        });
        if (rawSession) {
            const stackHostFromHeaders = rawSession.getHostFromHeader();
            if (stackHostFromHeaders) {
                this.setHost(stackHostFromHeaders);
                if (this.onHostFromHeadersCallback) this.onHostFromHeadersCallback(stackHostFromHeaders);
            }
        }
        if (backend) service_getApiClient().setRefreshBackend(backend);
        if (tenantId) service_getApiClient().setRefreshTenantId(tenantId);
        if (domainName) service_getApiClient().setRefreshDomainName(domainName);
        return this._onAuthenticated(rawSession);
    }
    async samlLogIn(samlSessionId) {
        const rawSession = await service_getApiClient().auth.samlLogIn(samlSessionId);
        return this._onAuthenticated(rawSession);
    }
    async samlLogOut() {
        return await this.logout(false, true);
    }
    async initiateIdpAuthentication(domain, redirectUrl) {
        try {
            return await service_getApiClient().auth.initiateIdpAuthentication(domain, redirectUrl);
        } catch (e) {
            Auth_logger.error('Error during IdP authentication initialization:', e.message);
            if (404 === e.status) throw new NoSamlRouteError('No route found for SAML SSO');
            if (500 === e.status) throw new SamlConfigError('SAML/server configuration error');
            throw e;
        }
    }
    async logInViaRefreshToken(refreshToken) {
        const rawSession = await service_getApiClient().auth.refreshToken(refreshToken, '', this.expiration, this.mobile);
        return this._onAuthenticated(rawSession);
    }
    async validateToken(token, refreshToken, headerUserUuid) {
        if (!token) return;
        if (this.usingEdgeServer && 'string' == typeof headerUserUuid) {
            Auth_logger.info('using edge server, setting user UUID header', {
                headerUserUuid
            });
            this.setHttpUserUuidHeader(headerUserUuid);
        }
        if (refreshToken) setRefreshToken(refreshToken);
        try {
            const rawSession = await service_getApiClient().auth.authenticate(token);
            return this._onAuthenticated(rawSession);
        } catch (e) {
            Auth_logger.error('on validate token error', e);
            console.warn(e);
        }
    }
    async generateNewToken(refreshToken) {
        return service_getApiClient().auth.refreshToken(refreshToken, '', this.expiration);
    }
    async logout(deleteRefreshToken = true, saml = false) {
        try {
            simple.Websocket.close(true);
            if (!saml && this.clientId && deleteRefreshToken) await service_getApiClient().auth.deleteRefreshToken(this.clientId);
        } catch (e) {}
        let response;
        try {
            if (this.session?.token) {
                if (saml) response = await service_getApiClient().auth.samlLogOut();
                else await service_getApiClient().auth.logOut(this.session.token);
            }
        } catch (e) {}
        setApiToken(null);
        setRefreshToken(null);
        this.session = null;
        this.authenticated = false;
        this.usingEdgeServer = void 0;
        setFetchOptions({});
        return response;
    }
    setOnHostFromHeaders(callback) {
        this.onHostFromHeadersCallback = callback;
    }
    setOnSetUsingEdgeServer(callback) {
        Auth_logger.info('setting onSetUsingEdgeServer callback', {
            callback: 'function' == typeof callback
        });
        this.onSetUsingEdgeServer = callback;
    }
    setOnRefreshToken(callback) {
        this.onRefreshTokenCallback = callback;
    }
    setOnRefreshTokenError(callback) {
        this.onRefreshTokenCallbackError = callback;
    }
    checkAuthorizations(session, authorizationName) {
        if (!authorizationName) return;
        const { authorizations } = session;
        if (!authorizations.find((authorization)=>authorization.rules.find((rule)=>rule.name === authorizationName))) throw new InvalidAuthorization(`No authorization '${authorizationName || ''}' found for your account.`);
    }
    checkSubscription(session, minSubscriptionType) {
        const userSubscriptionType = session.profile?.subscriptionType || null;
        if (null === userSubscriptionType || userSubscriptionType <= minSubscriptionType) {
            const message = `Invalid subscription ${userSubscriptionType || 'n/a'}, required at least ${minSubscriptionType}`;
            throw new InvalidSubscription(message);
        }
    }
    setHost(host) {
        this.host = host;
        setCurrentServer(host);
    }
    setApiToken(token) {
        setApiToken(token);
    }
    setRefreshToken(refreshToken) {
        setRefreshToken(refreshToken);
    }
    setRefreshTenantId(refreshTenantId) {
        console.warn('Use of `setRefreshTenantId` is deprecated, use `setRefreshDomainName` instead.');
        setRefreshTenantId(refreshTenantId);
        service_getApiClient().setRefreshTenantId(refreshTenantId);
    }
    setRefreshDomainName(domainName) {
        setRefreshDomainName(domainName);
        service_getApiClient().setRefreshDomainName(domainName);
    }
    setRequestTimeout(requestTimeout) {
        setRequestTimeout(requestTimeout);
        service_getApiClient().setRequestTimeout(requestTimeout);
    }
    forceRefreshToken() {
        return service_getApiClient().forceRefreshToken();
    }
    setIsMobile(mobile) {
        this.mobile = mobile;
    }
    getHost() {
        return this.host || void 0;
    }
    getSession() {
        return this.session || void 0;
    }
    getFirstName() {
        if (!this.session || !this.session.profile) return '';
        return this.session.profile.firstName;
    }
    getLastName() {
        if (!this.session || !this.session.profile) return '';
        return this.session.profile.lastName;
    }
    setClientId(clientId) {
        this.clientId = clientId;
        setApiClientId(this.clientId);
    }
    getName() {
        return `${this.getFirstName()} ${this.getLastName()}`;
    }
    _getHttpUserUuidHeaders(uuid) {
        return {
            ...getFetchOptions()?.headers || {},
            'X-User-UUID': uuid
        };
    }
    setHttpUserUuidHeader(uuid) {
        Auth_logger.info('Setting http header user uuid', {
            uuid
        });
        if (!uuid) {
            Auth_logger.warn('attempting to set a null value to user uuid header');
            return;
        }
        const headers = this._getHttpUserUuidHeaders(uuid);
        setFetchOptions({
            ...getFetchOptions(),
            headers
        });
    }
    async checkHttpUserUuidHeader(uuid) {
        Auth_logger.info('Checking user uuid http header', {
            uuid
        });
        if (!uuid) return;
        const headers = this._getHttpUserUuidHeaders(uuid);
        try {
            const response = await service_getApiClient().client.head('auth/0.1/status', null, headers, (r)=>r);
            const allowsUserUuidHeader = response.headers.get('access-control-allow-headers')?.includes('X-User-UUID');
            if (this.mobile && !allowsUserUuidHeader) throw new Error('Server does not allow user UUID header on mobile');
            this.setHttpUserUuidHeader(uuid);
            this.usingEdgeServer = true;
            Auth_logger.info('Setting usingEdgeServer value to TRUE', {
                requestHeaders: headers,
                responseHeaders: response.headers,
                allowsUserUuidHeader
            });
        } catch (e) {
            this.usingEdgeServer = false;
            Auth_logger.info('Setting usingEdgeServer to FALSE', {
                justification: e
            });
        }
        if ('function' == typeof this.onSetUsingEdgeServer) {
            Auth_logger.info('calling onSetUsingEdgeServer', {
                usingEdgeServer: this.usingEdgeServer
            });
            this.onSetUsingEdgeServer(this.usingEdgeServer);
        }
    }
    async _onAuthenticated(rawSession) {
        if (this.authenticated && this.session) return this.session;
        const session = rawSession;
        if (!session) return null;
        if (this.usingEdgeServer) this.setHttpUserUuidHeader(session.uuid);
        else if (void 0 === this.usingEdgeServer) await this.checkHttpUserUuidHeader(session.uuid);
        setApiToken(session.token);
        if (session.refreshToken) setRefreshToken(session.refreshToken);
        try {
            const [profile, { wazo_version: engineVersion }] = await Promise.all([
                service_getApiClient().confd.getUser(session.uuid),
                service_getApiClient().confd.getInfos()
            ]);
            session.engineVersion = engineVersion;
            session.profile = profile;
            this.checkAuthorizations(session, this.authorizationName);
            if (null !== this.minSubscriptionType) this.checkSubscription(session, +this.minSubscriptionType);
        } catch (e) {
            Auth_logger.error('on authenticated error', e);
            if (this.clientId) await service_getApiClient().auth.deleteRefreshToken(this.clientId);
            if (session) await service_getApiClient().auth.logOut(session.token);
            throw e;
        }
        try {
            const lineIds = session.profile?.lines.filter((line)=>!line.endpointSccp).map((line)=>String(line.id));
            const sipLines = await service_getApiClient().confd.getUserLinesSip(session.uuid, lineIds);
            session.profile.sipLines = sipLines.filter((line)=>line instanceof SipLine);
        } catch (e) {}
        this.authenticated = true;
        simple.Websocket.open(this.host, session);
        this.session = session;
        return session;
    }
}
if (!__webpack_require__.g.wazoAuthInstance) __webpack_require__.g.wazoAuthInstance = new Auth_Auth();
const Auth = __webpack_require__.g.wazoAuthInstance;
class Configuration {
    async getCurrentUser() {
        const session = simple.Auth.getSession();
        return service_getApiClient().confd.getUser(`${session ? session.uuid : ''}`);
    }
}
if (!__webpack_require__.g.wazoConfigurationInstance) __webpack_require__.g.wazoConfigurationInstance = new Configuration();
const simple_Configuration = __webpack_require__.g.wazoConfigurationInstance;
class Directory_Directory {
    async findMultipleContactsByNumber(numbers, fields) {
        return service_getApiClient().dird.findMultipleContactsByNumber(numbers, fields);
    }
}
if (!__webpack_require__.g.wazoDirectoryInstance) __webpack_require__.g.wazoDirectoryInstance = new Directory_Directory();
const Directory = __webpack_require__.g.wazoDirectoryInstance;
class AdHocAPIConference {
    phone;
    host;
    participants;
    started;
    finished;
    conferenceId;
    answerTime;
    muted;
    paused;
    constructor({ phone, host, participants, started, finished, answerTime, conferenceId, muted, paused }){
        this.phone = phone;
        this.host = host;
        this.participants = participants || {};
        this.started = started || false;
        this.finished = finished || false;
        this.answerTime = answerTime;
        this.conferenceId = conferenceId || '';
        this.muted = muted || false;
        this.paused = paused || false;
        if (this.host) this.host.setIsConference(true);
    }
    async start() {
        this.started = true;
        this.answerTime = Object.values(this.participants).length ? Object.values(this.participants)[0].answerTime : null;
        const participantIds = Object.keys(this.participants);
        const conference = await service_getApiClient().calld.createAdHocConference(this.host.callId, participantIds);
        this.conferenceId = conference.conference_id;
        return this;
    }
    getParticipants() {
        return Object.values(this.participants);
    }
    async addParticipant(newParticipant) {
        const participantCallId = newParticipant.getTalkingToIds()[0];
        const participants = {
            ...this.participants,
            [participantCallId]: newParticipant
        };
        await service_getApiClient().calld.addAdHocConferenceParticipant(this.conferenceId, participantCallId);
        return new AdHocAPIConference({
            ...this,
            participants
        });
    }
    participantHasLeft(leaver) {
        delete this.participants[leaver.getId()];
        return new AdHocAPIConference({
            ...this,
            participants: this.participants
        });
    }
    hasParticipants() {
        return Object.keys(this.participants).length > 0;
    }
    mute() {
        this.muted = true;
        this.phone.mute(this.host);
        return new AdHocAPIConference({
            ...this
        });
    }
    unmute() {
        this.muted = false;
        this.phone.unmute(this.host);
        return new AdHocAPIConference({
            ...this
        });
    }
    hold() {
        this.paused = true;
        this.phone.hold(this.host);
        return new AdHocAPIConference({
            ...this
        });
    }
    resume() {
        this.paused = false;
        this.phone.resume(this.host);
        return new AdHocAPIConference({
            ...this
        });
    }
    isOnHold() {
        return this.paused;
    }
    isMuted() {
        return this.muted;
    }
    async hangup() {
        await service_getApiClient().calld.deleteAdHocConference(this.conferenceId);
        return new AdHocAPIConference({
            ...this,
            finished: true,
            participant: []
        });
    }
    async removeParticipant(participantToRemove) {
        const callId = participantToRemove.getTalkingToIds()[0];
        delete this.participants[callId];
        await service_getApiClient().calld.removeAdHocConferenceParticipant(this.conferenceId, callId);
        return new AdHocAPIConference({
            ...this,
            participants: this.participants
        });
    }
}
const Phone_logger = IssueReporter.loggerFor('simple-phone');
const sipLogger = IssueReporter.loggerFor('sip.js');
const protocolLogger = IssueReporter.loggerFor('sip');
const protocolDebugMessages = [
    'Received WebSocket text message:',
    'Sending WebSocket message:'
];
class Phone_Phone extends Emitter {
    client;
    phone;
    session;
    sipLine;
    SessionState;
    ON_USER_AGENT;
    ON_REGISTERED;
    ON_UNREGISTERED;
    ON_PROGRESS;
    ON_CALL_ACCEPTED;
    ON_CALL_ANSWERED;
    ON_CALL_INCOMING;
    ON_CALL_OUTGOING;
    ON_CALL_MUTED;
    ON_CALL_UNMUTED;
    ON_CALL_RESUMED;
    ON_CALL_HELD;
    ON_CALL_UNHELD;
    ON_CAMERA_DISABLED;
    ON_CAMERA_RESUMED;
    ON_CALL_CANCELED;
    ON_CALL_FAILED;
    ON_CALL_REJECTED;
    ON_CALL_ENDED;
    ON_CALL_ENDING;
    ON_MESSAGE;
    ON_REINVITE;
    ON_TRACK;
    ON_AUDIO_STREAM;
    ON_VIDEO_STREAM;
    ON_REMOVE_STREAM;
    ON_SHARE_SCREEN_STARTED;
    ON_SHARE_SCREEN_ENDING;
    ON_SHARE_SCREEN_ENDED;
    ON_TERMINATE_SOUND;
    ON_PLAY_RING_SOUND;
    ON_PLAY_INBOUND_CALL_SIGNAL_SOUND;
    ON_PLAY_HANGUP_SOUND;
    ON_PLAY_PROGRESS_SOUND;
    ON_VIDEO_INPUT_CHANGE;
    ON_CALL_ERROR;
    ON_MESSAGE_TRACK_UPDATED;
    ON_NETWORK_STATS;
    ON_CHAT;
    ON_SIGNAL;
    ON_ICE_DISCONNECTED;
    ON_ICE_RECONNECTING;
    ON_ICE_RECONNECTED;
    ON_EARLY_MEDIA;
    MESSAGE_TYPE_CHAT;
    MESSAGE_TYPE_SIGNAL;
    constructor(){
        super();
        Object.keys(WebRTCPhone_namespaceObject).forEach((key)=>{
            this[key] = WebRTCPhone_namespaceObject[key];
        });
        this.SessionState = __WEBPACK_EXTERNAL_MODULE_sip_js_lib_api_session_state_3832d665__.SessionState;
    }
    async connect(rawOptions = {}, sipLine = null) {
        const options = rawOptions;
        if (this.phone) {
            if (options.media) this.phone.setMediaConstraints(options.media);
            return;
        }
        const server = simple.Auth.getHost();
        const session = simple.Auth.getSession();
        if (!server || !session) throw new Error('Please connect to the server using `Wazo.Auth.logIn` or `Wazo.Auth.authenticate` before using Room.connect().');
        this.session = session;
        this.sipLine = sipLine || this.getPrimaryWebRtcLine();
        if (!this.sipLine) throw new Error('Sorry, no sip lines found for this user');
        options.userUuid = session.uuid || '';
        this.connectWithCredentials(server, this.sipLine, session.displayName(), options);
    }
    connectWithCredentials(server, sipLine, displayName, rawOptions = {}) {
        if (this.phone) return;
        const [host, port = 443] = server.split(':');
        const options = rawOptions;
        options.media = options.media || {
            audio: true,
            video: false
        };
        options.uaConfigOverrides = options.uaConfigOverrides || {};
        if (IssueReporter.enabled) {
            options.uaConfigOverrides.traceSip = true;
            options.log = options.log || {};
            options.log.builtinEnabled = false;
            options.log.logLevel = 'debug';
            options.log.connector = this._logConnector;
        }
        this.client = new WebRTCClient({
            host,
            port: 'string' == typeof port ? parseInt(port, 10) : port,
            displayName,
            authorizationUser: sipLine.username,
            password: sipLine.secret,
            uri: `${sipLine.username}@${server}`,
            ...options
        }, void 0, options.uaConfigOverrides);
        this.phone = new WebRTCPhone(this.client, options.audioDeviceOutput, true, options.audioDeviceRing);
        this._transferEvents();
    }
    async disconnect() {
        if (this.phone) {
            if (this.phone.hasAnActiveCall()) {
                Phone_logger.info('hangup call on disconnect');
                await this.phone.hangup();
            }
            await this.phone.close();
        }
        this.phone = null;
    }
    async call(extension, withCamera = false, rawSipLine = null, audioOnly = false, conference = false) {
        if (!this.phone) return;
        const sipLine = rawSipLine || this.getPrimaryWebRtcLine();
        return this.phone.makeCall(extension, sipLine, withCamera, audioOnly, conference);
    }
    async hangup(callSession) {
        Phone_logger.info('hangup via simple phone', {
            callId: callSession.getId()
        });
        return !!this.phone && this.phone.hangup(callSession);
    }
    async accept(callSession, cameraEnabled) {
        Phone_logger.info('accept via simple phone', {
            callId: callSession.getId(),
            cameraEnabled
        });
        return this.phone ? this.phone.accept(callSession, cameraEnabled) : null;
    }
    async startConference(host, otherCalls) {
        const participants = [
            host,
            ...otherCalls
        ].reduce((acc, participant)=>{
            acc[participant.getTalkingToIds()[0]] = participant;
            return acc;
        }, {});
        if (!this.phone) return Promise.reject();
        const adHocConference = new AdHocAPIConference({
            phone: this.phone,
            host,
            participants
        });
        return adHocConference.start();
    }
    mute(callSession, withApi = true) {
        if (withApi) this.muteViaAPI(callSession);
        this.phone?.mute(callSession);
    }
    unmute(callSession, withApi = true) {
        if (withApi) this.unmuteViaAPI(callSession);
        this.phone?.unmute(callSession);
    }
    muteViaAPI(callSession) {
        if (callSession && callSession.callId) simple.getApiClient().calld.mute(callSession.callId).catch((e)=>{
            Phone_logger.error('Mute via API, error', e);
        });
    }
    unmuteViaAPI(callSession) {
        if (callSession && callSession.callId) simple.getApiClient().calld.unmute(callSession.callId).catch((e)=>{
            Phone_logger.error('Unmute via API, error', e);
        });
    }
    hold(callSession) {
        return this.phone?.hold(callSession, true);
    }
    async unhold(callSession) {
        return this.phone?.unhold(callSession, true);
    }
    async resume(callSession) {
        return this.phone?.resume(callSession) || null;
    }
    reject(callSession) {
        return this.phone?.reject(callSession);
    }
    transfer(callSession, target) {
        this.phone?.transfer(callSession, target);
    }
    atxfer(callSession) {
        return this.phone?.atxfer(callSession) || null;
    }
    async reinvite(callSession, constraints = null, conference = false) {
        return this.phone ? this.phone.sendReinvite(callSession, constraints, conference) : null;
    }
    async getStats(callSession) {
        return this.phone ? this.phone.getStats(callSession) : null;
    }
    startNetworkMonitoring(callSession, interval = 1000) {
        return this.phone ? this.phone.startNetworkMonitoring(callSession, interval) : null;
    }
    stopNetworkMonitoring(callSession) {
        return this.phone ? this.phone.stopNetworkMonitoring(callSession) : null;
    }
    getSipSessionId(sipSession) {
        if (!sipSession || !this.phone) return null;
        return this.phone.getSipSessionId(sipSession);
    }
    sendMessage(body, sipSession, contentType = 'text/plain') {
        const toSipSession = sipSession || this.getCurrentSipSession();
        if (!toSipSession || !this.phone) return;
        this.phone.sendMessage(toSipSession, body, contentType);
    }
    sendChat(content, sipSession) {
        this.sendMessage(JSON.stringify({
            type: MESSAGE_TYPE_CHAT,
            content
        }), sipSession, 'application/json');
    }
    sendSignal(content, sipSession) {
        this.sendMessage(JSON.stringify({
            type: MESSAGE_TYPE_SIGNAL,
            content
        }), sipSession, 'application/json');
    }
    turnCameraOff(callSession) {
        this.phone?.turnCameraOff(callSession);
    }
    turnCameraOn(callSession) {
        this.phone?.turnCameraOn(callSession);
    }
    async startScreenSharing(constraints, callSession) {
        return this.phone?.startScreenSharing(constraints, callSession) || null;
    }
    stopScreenSharing(callSession, restoreLocalStream = true) {
        return this.phone ? this.phone.stopScreenSharing(restoreLocalStream, callSession) : Promise.resolve();
    }
    sendDTMF(tone, callSession) {
        this.phone?.sendKey(callSession, tone);
    }
    getLocalStream(callSession) {
        return this.phone?.getLocalStream(callSession);
    }
    hasLocalVideo(callSession) {
        return this.phone?.hasLocalVideo(callSession) || false;
    }
    hasALocalVideoTrack(callSession) {
        return this.phone?.hasALocalVideoTrack(callSession) || false;
    }
    getLocalMediaStream(callSession) {
        Phone_logger.warn('Phone.getLocalMediaStream is deprecated, use Phone.getLocalStream instead');
        return this.phone?.getLocalStream(callSession);
    }
    getLocalVideoStream(callSession) {
        return this.phone?.getLocalVideoStream(callSession) || null;
    }
    getRemoteStream(callSession) {
        return this.phone?.getRemoteStream(callSession) || null;
    }
    getRemoteVideoStream(callSession) {
        return this.phone?.getRemoteVideoStream(callSession) || null;
    }
    isVideoRemotelyHeld(callSession) {
        return this.phone?.isVideoRemotelyHeld(callSession) || false;
    }
    getRemoteStreamForCall(callSession) {
        Phone_logger.warn('Phone.getRemoteStreamForCall is deprecated, use Phone.getRemoteStream instead');
        return this.getRemoteStream(callSession) || null;
    }
    getRemoteStreamsForCall(callSession) {
        Phone_logger.warn('Phone.getRemoteStreamsForCall is deprecated, use Phone.getLocalStream instead');
        return this.getLocalStream(callSession) || null;
    }
    getRemoteVideoStreamForCall(callSession) {
        Phone_logger.warn('Phone.getRemoteVideoStreamForCall is deprecated, use Phone.getRemoteVideoStream instead');
        return this.getRemoteVideoStream(callSession);
    }
    getRemoteVideoStreamFromPc(callSession) {
        return this.phone?.getRemoteVideoStreamFromPc(callSession) || null;
    }
    hasVideo(callSession) {
        return !!this.phone && this.phone.hasVideo(callSession);
    }
    hasAVideoTrack(callSession) {
        return !!this.phone && this.phone.hasAVideoTrack(callSession);
    }
    getCurrentSipSession() {
        return this.phone?.currentSipSession || null;
    }
    getPrimaryWebRtcLine() {
        const session = simple.Auth.getSession();
        return session?.primaryWebRtcLine() || null;
    }
    getOutputDevice() {
        return this.phone?.audioOutputDeviceId || null;
    }
    getPrimaryLine() {
        const session = simple.Auth.getSession();
        return session?.primarySipLine() || null;
    }
    getLineById(lineId) {
        return this.getSipLines().find((line)=>line && line.id === lineId) || null;
    }
    getSipLines() {
        const session = simple.Auth.getSession();
        if (!session) return [];
        return session.profile?.sipLines || [];
    }
    hasSfu() {
        return this.sipLine?.hasVideoConference() || false;
    }
    checkSfu() {
        if (!this.hasSfu()) throw new SFUNotAvailableError();
    }
    enableLogger() {
        this.client.enableLogger(this._logConnector);
    }
    _transferEvents() {
        this.unbind();
        [
            ...web_rtc_client_events,
            ...transportEvents
        ].forEach((event)=>{
            this.client.on(event, (...args)=>this.eventEmitter.emit.apply(this.eventEmitter.emit, [
                    `client-${event}`,
                    ...args
                ]));
        });
        Object.values(WebRTCPhone_namespaceObject).forEach((event)=>{
            if ('string' != typeof event || !this.phone) return;
            this.phone.on(event, (...args)=>this.eventEmitter.emit.apply(this.eventEmitter, [
                    event,
                    ...args
                ]));
        });
    }
    _logConnector(level, className, label, content) {
        const protocolIndex = content && content.indexOf ? protocolDebugMessages.findIndex((prefix)=>-1 !== content.indexOf(prefix)) : -1;
        if ('sip.Transport' === className && -1 !== protocolIndex) {
            const direction = 0 === protocolIndex ? 'receiving' : 'sending';
            const message = content.replace(`${protocolDebugMessages[protocolIndex]}\n\n`, '').replace('\r\n', '\n');
            protocolLogger.trace(message, {
                className,
                direction
            });
        } else sipLogger.trace(content, {
            className
        });
    }
}
if (!__webpack_require__.g.wazoTelephonyInstance) __webpack_require__.g.wazoTelephonyInstance = new Phone_Phone();
const Phone = __webpack_require__.g.wazoTelephonyInstance;
const SIGNAL_TYPE_PARTICIPANT_UPDATE = 'signal/PARTICIPANT_UPDATE';
const SIGNAL_TYPE_PARTICIPANT_REQUEST = 'signal/PARTICIPANT_REQUEST';
const Participant_logger = IssueReporter.loggerFor('room');
class Participant_Participant extends Emitter {
    room;
    uuid;
    name;
    number;
    callId;
    isTalking;
    streams;
    videoStreams;
    audioMuted;
    videoMuted;
    screensharing;
    isOnHold;
    banned;
    extra;
    ON_UPDATED;
    ON_START_TALKING;
    ON_STOP_TALKING;
    ON_DISCONNECT;
    ON_STREAM_SUBSCRIBED;
    ON_STREAM_UNSUBSCRIBED;
    ON_AUDIO_MUTED;
    ON_AUDIO_UNMUTED;
    ON_VIDEO_MUTED;
    ON_VIDEO_UNMUTED;
    ON_SCREENSHARING;
    ON_STOP_SCREENSHARING;
    ON_EXTRA_CHANGE;
    ON_HOLD;
    ON_RESUME;
    ON_BAN;
    constructor(room, rawParticipant, extra = {}){
        super();
        this.room = room;
        this.uuid = rawParticipant.user_uuid;
        this.name = (rawParticipant.caller_id_name || '').replace("\\'", "'");
        this.number = rawParticipant.caller_id_number;
        this.callId = rawParticipant.call_id;
        this.isTalking = false;
        this.streams = [];
        this.videoStreams = [];
        this.audioMuted = false;
        this.videoMuted = false;
        this.screensharing = false;
        this.isOnHold = false;
        this.extra = extra;
        this.banned = false;
        this.ON_UPDATED = 'participant/ON_UPDATED';
        this.ON_START_TALKING = 'participant/ON_START_TALKING';
        this.ON_STOP_TALKING = 'participant/ON_STOP_TALKING';
        this.ON_DISCONNECT = 'participant/ON_DISCONNECT';
        this.ON_STREAM_SUBSCRIBED = 'participant/ON_STREAM_SUBSCRIBED';
        this.ON_STREAM_UNSUBSCRIBED = 'participant/ON_STREAM_UNSUBSCRIBED';
        this.ON_AUDIO_MUTED = 'participant/ON_AUDIO_MUTED';
        this.ON_AUDIO_UNMUTED = 'participant/ON_AUDIO_UNMUTED';
        this.ON_VIDEO_MUTED = 'participant/ON_VIDEO_MUTED';
        this.ON_VIDEO_UNMUTED = 'participant/ON_VIDEO_UNMUTED';
        this.ON_SCREENSHARING = 'participant/ON_SCREENSHARING';
        this.ON_STOP_SCREENSHARING = 'participant/ON_STOP_SCREENSHARING';
        this.ON_EXTRA_CHANGE = 'participant/ON_EXTRA_CHANGE';
        this.ON_HOLD = 'participant/ON_HOLD';
        this.ON_RESUME = 'participant/ON_RESUME';
        this.ON_BAN = 'participant/ON_BAN';
    }
    triggerEvent(name, ...args) {
        this.eventEmitter.emit.apply(this.eventEmitter, [
            name,
            ...args
        ]);
        this.eventEmitter.emit.apply(this.eventEmitter, [
            this.ON_UPDATED,
            ...args
        ]);
    }
    triggerUpdate(eventType, broadcast = true) {
        const status = {
            callId: this.callId
        };
        switch(eventType){
            case this.ON_START_TALKING:
            case this.ON_STOP_TALKING:
                status.isTalking = this.isTalking;
                break;
            case this.ON_AUDIO_MUTED:
            case this.ON_AUDIO_UNMUTED:
                status.audioMuted = this.audioMuted;
                break;
            case this.ON_VIDEO_MUTED:
            case this.ON_VIDEO_UNMUTED:
                status.videoMuted = this.videoMuted;
                break;
            case this.ON_SCREENSHARING:
            case this.ON_STOP_SCREENSHARING:
                status.screensharing = this.screensharing;
                break;
            case this.ON_HOLD:
            case this.ON_RESUME:
                status.isOnHold = this.isOnHold;
                break;
            case this.ON_EXTRA_CHANGE:
                status.extra = this.extra;
                break;
            case this.ON_BAN:
                status.banned = true;
                break;
            default:
                break;
        }
        if (broadcast) this.broadcastStatus(status);
        this.eventEmitter.emit(eventType, status);
        this.eventEmitter.emit(this.ON_UPDATED, eventType, status);
    }
    onTalking(isTalking) {
        Participant_logger.info('on participant talking', {
            name: this.name,
            isTalking,
            callId: this.callId
        });
        this.isTalking = isTalking;
        this.triggerUpdate(this.isTalking ? this.ON_START_TALKING : this.ON_STOP_TALKING, false);
    }
    onDisconnect() {
        return this.triggerEvent(this.ON_DISCONNECT);
    }
    onStreamSubscribed(stream) {
        return this.triggerEvent(this.ON_STREAM_SUBSCRIBED, stream);
    }
    onStreamUnSubscribed(stream) {
        return this.triggerEvent(this.ON_STREAM_UNSUBSCRIBED, stream);
    }
    onAudioMuted(broadcast = true) {
        if (this.audioMuted) return;
        this.audioMuted = true;
        this.triggerUpdate(this.ON_AUDIO_MUTED, broadcast);
    }
    onAudioUnMuted(broadcast = true) {
        if (!this.audioMuted) return;
        this.audioMuted = false;
        this.triggerUpdate(this.ON_AUDIO_UNMUTED, broadcast);
    }
    onVideoMuted(broadcast = true) {
        if (this.videoMuted) return;
        this.videoMuted = true;
        this.triggerUpdate(this.ON_VIDEO_MUTED, broadcast);
    }
    onVideoUnMuted(broadcast = true) {
        if (!this.videoMuted) return;
        this.videoMuted = false;
        this.triggerUpdate(this.ON_VIDEO_UNMUTED, broadcast);
    }
    onScreensharing(broadcast = true) {
        if (this.screensharing) return;
        this.screensharing = true;
        this.triggerUpdate(this.ON_SCREENSHARING, broadcast);
    }
    onStopScreensharing(broadcast = true) {
        if (!this.screensharing) return;
        this.screensharing = false;
        this.triggerUpdate(this.ON_STOP_SCREENSHARING, broadcast);
    }
    onHold(broadcast = true) {
        if (this.isOnHold) return;
        this.isOnHold = true;
        this.triggerUpdate(this.ON_HOLD, broadcast);
    }
    onResume(broadcast = true) {
        if (!this.isOnHold) return;
        this.isOnHold = false;
        this.triggerUpdate(this.ON_RESUME, broadcast);
    }
    onBan(broadcast = true) {
        this.banned = true;
        this.triggerUpdate(this.ON_BAN, broadcast);
    }
    getStatus() {
        return {
            callId: this.callId,
            audioMuted: this.audioMuted,
            videoMuted: this.videoMuted,
            screensharing: this.screensharing,
            isTalking: this.isTalking,
            extra: this.extra
        };
    }
    updateStatus(status, broadcast = true) {
        Participant_logger.info('updating participant status', {
            name: this.name,
            status
        });
        if (void 0 !== status.audioMuted && status.audioMuted !== this.audioMuted) {
            if (status.audioMuted) this.onAudioMuted(broadcast);
            else this.onAudioUnMuted(broadcast);
        }
        if (void 0 !== status.videoMuted && status.videoMuted !== this.videoMuted) {
            if (status.videoMuted) this.onVideoMuted(broadcast);
            else this.onVideoUnMuted(broadcast);
        }
        if (void 0 !== status.screensharing && status.screensharing !== this.screensharing) {
            if (status.screensharing) this.onScreensharing(broadcast);
            else this.onStopScreensharing(broadcast);
        }
        if (void 0 !== status.isOnHold && status.isOnHold !== this.isOnHold) {
            if (status.isOnHold) this.onHold(broadcast);
            else this.onResume(broadcast);
        }
        if (status.banned) this.onBan(false);
        if (void 0 !== status.extra && JSON.stringify(this.extra) !== JSON.stringify(status.extra)) {
            this.extra = {
                ...this.extra,
                ...status.extra
            };
            if (this.extra.contact && !(this.extra.contact instanceof Contact)) this.extra.contact = new Contact(this.extra.contact);
            this.triggerUpdate(this.ON_EXTRA_CHANGE, broadcast);
        }
    }
    broadcastStatus(inboundStatus = null, sendReinvite = null) {
        const status = inboundStatus || this.getStatus();
        Participant_logger.info('broadcasting participant status', {
            callId: this.callId,
            status
        });
        if (sendReinvite && !this.streams.length && Phone.phone) Phone.phone._sendReinviteMessage(this.room?.callSession, false);
        this.room?.sendSignal({
            type: SIGNAL_TYPE_PARTICIPANT_UPDATE,
            origin: this.callId,
            status
        });
    }
    resetStreams(streams) {
        this.streams = streams;
        this.videoStreams = streams;
    }
    async ban(apiRequestDelay = null) {
        const { meetingUuid } = this.room || {};
        if (!meetingUuid) throw new Error('Attempting to ban a participant without a `meetingUuid`');
        this.onBan(true);
        if (apiRequestDelay) await this.delay(apiRequestDelay);
        return service_getApiClient().calld.banMeetingParticipant(meetingUuid, this.callId);
    }
    async delay(ms) {
        return new Promise((resolve)=>setTimeout(resolve, ms));
    }
}
const Participant = Participant_Participant;
class LocalParticipant_LocalParticipant extends Participant {
}
const LocalParticipant = LocalParticipant_LocalParticipant;
class RemoteParticipant extends Participant {
    constructor(room, rawParticipant, extra = {}){
        super(room, rawParticipant, extra);
        if ('<unknown>' === this.name) this.name = String(this.number);
    }
}
const room_RemoteParticipant = RemoteParticipant;
const Room_logger = IssueReporter.loggerFor('sdk-room');
class Room_Room extends Emitter {
    callSession;
    name;
    extension;
    sourceId;
    meetingUuid;
    participants;
    callId;
    connected;
    localParticipant;
    _callIdStreamIdMap;
    _unassociatedVideoStreams;
    _unassociatedParticipants;
    _boundOnParticipantJoined;
    _boundOnParticipantLeft;
    _boundOnMessage;
    _boundOnChat;
    _boundOnSignal;
    _boundSaveLocalVideoStream;
    _boundOnReinvite;
    audioStream;
    extra;
    roomAudioElement;
    CONFERENCE_USER_PARTICIPANT_JOINED;
    CONFERENCE_USER_PARTICIPANT_LEFT;
    MEETING_USER_PARTICIPANT_JOINED;
    MEETING_USER_PARTICIPANT_LEFT;
    ON_SHARE_SCREEN_ENDED;
    ON_MESSAGE;
    ON_CHAT;
    ON_SIGNAL;
    ON_AUDIO_STREAM;
    ON_VIDEO_STREAM;
    ON_REMOVE_STREAM;
    ON_DISCONNECTED;
    ON_JOINED;
    ON_VIDEO_INPUT_CHANGE;
    constructor(callSession, extension, sourceId, callId, meetingUuid, extra = {}){
        super();
        Room_logger.info('room initialized', {
            callId,
            extension,
            sourceId,
            meetingUuid
        });
        this.callSession = callSession;
        this.extension = extension;
        this.sourceId = sourceId;
        this.meetingUuid = meetingUuid;
        this.callId = callId;
        this.participants = [];
        this.connected = false;
        this.localParticipant = null;
        this._callIdStreamIdMap = {};
        this._unassociatedVideoStreams = {};
        this._unassociatedParticipants = {};
        this.audioStream = null;
        this.extra = extra;
        this.CONFERENCE_USER_PARTICIPANT_JOINED = simple.Websocket.CONFERENCE_USER_PARTICIPANT_JOINED;
        this.CONFERENCE_USER_PARTICIPANT_LEFT = simple.Websocket.CONFERENCE_USER_PARTICIPANT_LEFT;
        this.MEETING_USER_PARTICIPANT_JOINED = simple.Websocket.MEETING_USER_PARTICIPANT_JOINED;
        this.MEETING_USER_PARTICIPANT_LEFT = simple.Websocket.MEETING_USER_PARTICIPANT_LEFT;
        this.ON_SHARE_SCREEN_ENDED = simple.Phone.ON_SHARE_SCREEN_ENDED;
        this.ON_MESSAGE = simple.Phone.ON_MESSAGE;
        this.ON_CHAT = simple.Phone.ON_CHAT;
        this.ON_SIGNAL = simple.Phone.ON_SIGNAL;
        this.ON_AUDIO_STREAM = simple.Phone.ON_AUDIO_STREAM;
        this.ON_VIDEO_STREAM = simple.Phone.ON_VIDEO_STREAM;
        this.ON_REMOVE_STREAM = simple.Phone.ON_REMOVE_STREAM;
        this.ON_VIDEO_INPUT_CHANGE = simple.Phone.ON_VIDEO_INPUT_CHANGE;
        this.ON_DISCONNECTED = 'room/ON_DISCONNECTED';
        this.ON_JOINED = 'room/ON_JOINED';
        this._boundOnParticipantJoined = this._onParticipantJoined.bind(this);
        this._boundOnParticipantLeft = this._onParticipantLeft.bind(this);
        this._boundOnMessage = this._onMessage.bind(this);
        this._boundOnChat = this._onChat.bind(this);
        this._boundOnSignal = this._onSignal.bind(this);
        this._boundSaveLocalVideoStream = this._saveLocalVideoStream.bind(this);
        this._boundOnReinvite = this._onReinvite.bind(this);
        this.unbind();
        this._bindEvents();
        this._transferEvents();
    }
    static async connect({ extension, constraints, audioOnly = false, extra, room, meeting }) {
        Room_logger.info('connecting to room', {
            extension,
            audioOnly,
            room: !!room
        });
        if (!room) {
            await simple.Phone.connect({
                media: constraints
            });
            const withCamera = constraints && !!constraints.video;
            if (withCamera) simple.Phone.checkSfu();
            simple.Websocket.once(simple.Websocket.CALL_CREATED, ({ data })=>{
                Room_logger.info('room call received via WS', {
                    callId: data.call_id
                });
                if (room) room.setCallId(data.call_id);
            });
            const callSession = await simple.Phone.call(extension, withCamera, null, audioOnly, true);
            room = new Room_Room(callSession, extension, null, null, null, extra);
            await new Promise((resolve, reject)=>{
                simple.Phone.once(simple.Phone.ON_CALL_ACCEPTED, resolve);
                simple.Phone.once(simple.Phone.ON_CALL_FAILED, reject);
            });
        }
        if (room && room.callSession && room.callSession.call) room.setCallId(room.callSession.call.id);
        if (meeting) {
            if (meeting) {
                Room_logger.info('Already connected to meeting', {
                    uuid: meeting.uuid,
                    name: meeting.name
                });
                room.setMeetingUuid(meeting.uuid);
                room.setName(meeting.name);
            }
        } else {
            const sources = await service_getApiClient().dird.fetchConferenceSource('default');
            const contacts = await service_getApiClient().dird.fetchConferenceContacts(sources.items[0]);
            const conference = contacts?.find((contact)=>contact.numbers?.find((number)=>String(number.number) === String(extension)));
            Room_logger.info('connected to room', {
                sourceId: conference ? conference.sourceId : null,
                name: conference ? conference.name : null
            });
            if (conference) {
                room.setSourceId(parseInt(`${conference.sourceId}`, 10));
                room.setName(`${conference.name}`);
            }
        }
        return room;
    }
    static disconnect() {
        Room_logger.info('static disconnection to room');
        simple.Phone.disconnect();
    }
    async disconnect() {
        Room_logger.info('disconnection to room called');
        await simple.Phone.hangup(this.callSession);
        this.callSession = void 0;
        this.eventEmitter.emit(this.ON_DISCONNECTED, this);
        this.connected = false;
        this.unbind();
        simple.Phone.off(this.ON_MESSAGE, this._boundOnMessage);
        simple.Phone.off(this.ON_CHAT, this._boundOnChat);
        simple.Phone.off(this.ON_SIGNAL, this._boundOnSignal);
        simple.Phone.off(this.ON_VIDEO_INPUT_CHANGE, this._boundSaveLocalVideoStream);
        simple.Phone.phone?.off(simple.Phone.phone.client.ON_REINVITE, this._boundOnReinvite);
        simple.Websocket.off(this.CONFERENCE_USER_PARTICIPANT_JOINED, this._boundOnParticipantJoined);
        simple.Websocket.off(this.CONFERENCE_USER_PARTICIPANT_LEFT, this._boundOnParticipantLeft);
        simple.Websocket.off(this.MEETING_USER_PARTICIPANT_JOINED, this._boundOnParticipantJoined);
        simple.Websocket.off(this.MEETING_USER_PARTICIPANT_LEFT, this._boundOnParticipantLeft);
    }
    setSourceId(sourceId) {
        Room_logger.info('set room source id', {
            sourceId
        });
        this.sourceId = sourceId;
    }
    setMeetingUuid(meetingUuid) {
        Room_logger.info('set meeting uuid', {
            meetingUuid
        });
        this.meetingUuid = meetingUuid;
    }
    setCallId(callId) {
        Room_logger.info('set room call id', {
            callId
        });
        if (callId) this.callId = callId;
    }
    setName(name) {
        Room_logger.info('set room name', {
            name
        });
        this.name = name;
    }
    sendMessage(body, sipSession = null) {
        return simple.Phone.sendMessage(body, sipSession);
    }
    sendChat(content) {
        return simple.Phone.sendChat(content);
    }
    sendSignal(content) {
        return simple.Phone.sendSignal(content);
    }
    async startScreenSharing(constraints) {
        Room_logger.info('start room screen sharing', {
            constraints
        });
        const screensharingStream = await simple.Phone.startScreenSharing(constraints, this.callSession);
        if (!screensharingStream) {
            console.warn('screensharing stream is null (likely due to user cancellation)');
            return null;
        }
        this._onScreenSharing();
        return screensharingStream;
    }
    async stopScreenSharing(restoreLocalStream = true) {
        Room_logger.info('stop room screen sharing');
        await simple.Phone.stopScreenSharing(this.callSession, restoreLocalStream);
        if (this.localParticipant) {
            this._updateLocalParticipantStream();
            this.localParticipant.onStopScreensharing();
        }
    }
    turnCameraOff() {
        Room_logger.info('turn room camera off');
        simple.Phone.turnCameraOff(this.callSession);
        if (this.localParticipant) this.localParticipant.onVideoMuted();
    }
    turnCameraOn() {
        Room_logger.info('turn room camera on');
        simple.Phone.turnCameraOn(this.callSession);
        if (this.localParticipant) this.localParticipant.onVideoUnMuted();
    }
    mute() {
        Room_logger.info('mute room');
        simple.Phone.mute(this.callSession);
        this.sendMuteStatus();
    }
    unmute() {
        Room_logger.info('unmute room');
        simple.Phone.unmute(this.callSession);
        this.sendUnMuteStatus();
    }
    sendMuteStatus() {
        if (this.localParticipant) this.localParticipant.onAudioMuted();
    }
    sendUnMuteStatus() {
        if (this.localParticipant) this.localParticipant.onAudioUnMuted();
    }
    hold() {
        Room_logger.info('hold room');
        simple.Phone.hold(this.callSession);
        if (this.localParticipant) this.localParticipant.onHold();
    }
    async resume() {
        Room_logger.info('resume room');
        const newStream = await simple.Phone.resume(this.callSession);
        if (this.localParticipant) {
            this._updateLocalParticipantStream();
            this.localParticipant.onResume();
            if (!newStream && this.localParticipant.screensharing) this.localParticipant.onStopScreensharing();
        }
    }
    _updateLocalParticipantStream() {
        const localStream = simple.Phone.getLocalStream(this.callSession);
        if (this.localParticipant && localStream) {
            const localWazoStream = new simple.Stream(localStream);
            this.localParticipant.resetStreams([
                localWazoStream
            ]);
        }
    }
    sendDTMF(tone) {
        Room_logger.info('send room DTMF', {
            tone
        });
        simple.Phone.sendDTMF(tone, this.callSession);
    }
    async sendReinvite(newConstraints = null) {
        Room_logger.info('send room reinvite', {
            callId: this.callSession ? this.callSession.getId() : null,
            newConstraints
        });
        const wasScreensharing = this.localParticipant && this.localParticipant.screensharing;
        simple.Phone.on(simple.Phone.ON_SHARE_SCREEN_STARTED, ()=>{
            if (simple.Phone.phone && simple.Phone.phone.currentScreenShare) this._onScreenSharing();
        });
        const response = await simple.Phone.phone?.sendReinvite(this.callSession, newConstraints, true);
        if (this.localParticipant && newConstraints && newConstraints.video) {
            const localVideoStream = simple.Phone.phone?.getLocalVideoStream(this.callSession);
            if (localVideoStream) this._associateStreamTo(localVideoStream, this.localParticipant);
        } else if (this.localParticipant && wasScreensharing && newConstraints && !newConstraints.video) this.localParticipant.onStopScreensharing();
        return response;
    }
    hasALocalVideoTrack() {
        return simple.Phone.hasALocalVideoTrack(this.callSession);
    }
    getLocalStream() {
        return simple.Phone.getLocalStream(this.callSession);
    }
    getRemoteStream() {
        return simple.Phone.getRemoteStream(this.callSession);
    }
    getRemoteVideoStream() {
        return simple.Phone.getRemoteVideoStream(this.callSession);
    }
    _bindEvents() {
        if (!simple.Phone.phone || !simple.Phone.phone.currentSipSession) return;
        simple.Phone.phone.currentSipSession.sessionDescriptionHandler?.on("setDescription", ({ type, sdp: rawSdp })=>{
            if ('offer' !== type) return;
            this._mapMsid(rawSdp);
        });
        simple.Phone.phone.on(simple.Phone.phone.client.ON_REINVITE, this._boundOnReinvite);
        this.on(this.ON_AUDIO_STREAM, async (stream)=>{
            Room_logger.info('on room audio stream');
            this.audioStream = stream;
            if (this.roomAudioElement) this.roomAudioElement.srcObject = stream;
            else {
                const sessionId = simple.Phone.phone?.getSipSessionId(simple.Phone.phone?.currentSipSession);
                this.roomAudioElement = await simple.Phone.phone?.createAudioElementFor(sessionId);
                this.roomAudioElement.srcObject = stream;
            }
        });
        this.on(this.ON_VIDEO_STREAM, (stream, streamId, event, sipSession)=>{
            Room_logger.info('on room video stream', {
                streamId
            });
            this._mapMsid(sipSession.body.body);
            this._unassociatedVideoStreams[streamId] = stream;
            const callId = this._getCallIdFromTrackId(streamId);
            const participant = callId ? this._getParticipantFromCallId(callId) : null;
            if (participant) this.__associateStreams(participant);
        });
        this.on(this.ON_REMOVE_STREAM, (stream)=>{
            Room_logger.info('on room remove stream');
            const participant = this.participants.find((someParticipant)=>someParticipant.streams.find((someStream)=>someStream && someStream.id === stream.id));
            if (!participant) return;
            participant.videoStreams = participant.videoStreams.filter((someStream)=>someStream.id !== stream.id);
            participant.streams = participant.streams.filter((someStream)=>someStream.id !== stream.id);
            participant.onStreamUnSubscribed(stream);
        });
    }
    _onScreenSharing() {
        if (this.localParticipant) this.localParticipant.onScreensharing();
    }
    _onReinvite(session, inviteRequest) {
        const body = inviteRequest.body || inviteRequest.message.body;
        if (body) {
            this._mapMsid(body);
            this.participants.forEach((participant)=>{
                this.__associateStreams(participant);
            });
        }
    }
    _mapMsid(rawSdp) {
        const sdp = __WEBPACK_EXTERNAL_MODULE_sdp_transform_45b84e5d__["default"].parse(rawSdp);
        const labelMsidArray = sdp.media.filter((media)=>!!media.label).map(({ label, msid })=>({
                label: String(label),
                streamId: msid?.split(' ')[0],
                trackId: msid?.split(' ')[1]
            }));
        labelMsidArray.forEach(({ label, streamId, trackId })=>{
            this._callIdStreamIdMap[String(label)] = {
                streamId,
                trackId
            };
            const callId = String(label);
            const participant = this._unassociatedParticipants[callId] || this._getParticipantFromCallId(callId);
            if (participant) this.__associateStreams(participant);
        });
    }
    _transferEvents() {
        simple.Websocket.on(this.CONFERENCE_USER_PARTICIPANT_JOINED, this._boundOnParticipantJoined);
        simple.Websocket.on(this.CONFERENCE_USER_PARTICIPANT_LEFT, this._boundOnParticipantLeft);
        simple.Websocket.on(this.MEETING_USER_PARTICIPANT_JOINED, this._boundOnParticipantJoined);
        simple.Websocket.on(this.MEETING_USER_PARTICIPANT_LEFT, this._boundOnParticipantLeft);
        simple.Phone.on(this.ON_MESSAGE, this._boundOnMessage);
        simple.Phone.on(this.ON_CHAT, this._boundOnChat);
        simple.Phone.on(this.ON_SIGNAL, this._boundOnSignal);
        simple.Phone.on(this.ON_VIDEO_INPUT_CHANGE, this._boundSaveLocalVideoStream);
        [
            this.ON_AUDIO_STREAM,
            this.ON_VIDEO_STREAM,
            this.ON_REMOVE_STREAM
        ].forEach((event)=>simple.Phone.on(event, (...args)=>this.eventEmitter.emit.apply(this.eventEmitter, [
                    event,
                    ...args
                ])));
    }
    _onMessage(message) {
        if ('MESSAGE' !== message.method) return null;
        let body;
        try {
            body = JSON.parse(message.body);
        } catch (e) {
            return null;
        }
        switch(body.type){
            case 'ConfbridgeTalking':
                {
                    const channel = body.channels[0];
                    const { id: callId, talking_status: talkingStatus } = channel;
                    const isTalking = 'on' === talkingStatus;
                    const participantIdx = this.participants.findIndex((participant)=>participant.callId === callId);
                    if (-1 === participantIdx) return;
                    this.participants[participantIdx].onTalking(isTalking);
                    break;
                }
            default:
        }
        this.eventEmitter.emit(this.ON_MESSAGE, body);
        return body;
    }
    _onChat(content) {
        this.eventEmitter.emit(this.ON_CHAT, content);
    }
    _onSignal(content) {
        const { type } = content;
        switch(type){
            case SIGNAL_TYPE_PARTICIPANT_UPDATE:
                {
                    const { status } = content;
                    const participant = this._getParticipantFromCallId(status.callId);
                    if (participant) participant.updateStatus(status, false);
                    break;
                }
            case SIGNAL_TYPE_PARTICIPANT_REQUEST:
                {
                    const { callId, origin } = content;
                    if (this.localParticipant && (!callId || callId === this.localParticipant.callId)) this.localParticipant.broadcastStatus(null, true);
                    const requester = this._getParticipantFromCallId(origin.callId);
                    if (requester) {
                        Room_logger.info('trigger room requester status', {
                            origin
                        });
                        requester.triggerUpdate('REQUESTER_UPDATE');
                    }
                    break;
                }
            case simple.Phone.ON_MESSAGE_TRACK_UPDATED:
                {
                    const { callId, update } = content;
                    const participantIdx = this.participants.findIndex((p)=>p.callId === callId);
                    if (-1 !== participantIdx) this.participants[participantIdx] = this._onParticipantTrackUpdate(this.participants[participantIdx], update);
                    break;
                }
            default:
                console.warn('uncaught signal', content);
        }
        this.eventEmitter.emit(simple.Phone.ON_SIGNAL, content);
    }
    async _onParticipantJoined(payload) {
        const participant = payload.data;
        const session = simple.Auth.getSession();
        let participants = [];
        if (participant.user_uuid === session?.uuid) {
            Room_logger.info('room current user joined');
            const conferenceId = this.sourceId || payload.data.conference_id;
            let response;
            try {
                if (this.meetingUuid) {
                    Room_logger.info('fetching meeting participants', {
                        meetingUuid: this.meetingUuid
                    });
                    response = await service_getApiClient().calld.getMeetingParticipantsAsUser(this.meetingUuid);
                } else {
                    Room_logger.info('fetching conference participants', {
                        conferenceId
                    });
                    response = await service_getApiClient().calld.getConferenceParticipantsAsUser(conferenceId);
                }
            } catch (e) {
                Room_logger.error('room participants fetching, error', e);
            }
            if (response) {
                Room_logger.info('conference participants fetched', {
                    nb: response.items.length
                });
                participants = response.items.map((item)=>{
                    const isMe = item.call_id === this.callId;
                    return isMe && item.call_id ? new simple.LocalParticipant(this, item, this.extra) : new simple.RemoteParticipant(this, item);
                });
                this.participants = participants;
                const localParticipant = participants.find((someParticipant)=>someParticipant instanceof simple.LocalParticipant);
                if (!this.localParticipant && localParticipant) this._onLocalParticipantJoined(localParticipant);
                participants.forEach((someParticipant)=>this._isParticipantJoining(someParticipant));
                this.eventEmitter.emit(this.ON_JOINED, localParticipant, participants);
            }
            return this.participants;
        }
        const remoteParticipant = this.participants.some((p)=>p.callId === participant.call_id) ? null : new simple.RemoteParticipant(this, participant);
        Room_logger.info('other room user joined', {
            callId: participant.call_id,
            remoteParticipant: !!remoteParticipant
        });
        if (remoteParticipant) {
            this.participants.push(remoteParticipant);
            this._isParticipantJoining(remoteParticipant);
        }
        return remoteParticipant;
    }
    _onLocalParticipantJoined(localParticipant) {
        this.localParticipant = localParticipant;
        const localVideoStream = this._getLocalVideoStream();
        if (localVideoStream) this._saveLocalVideoStream(localVideoStream);
        this.connected = true;
        localParticipant.broadcastStatus(null, true);
        if (this.localParticipant) this.sendSignal({
            type: SIGNAL_TYPE_PARTICIPANT_REQUEST,
            origin: this.localParticipant.getStatus()
        });
    }
    _isParticipantJoining(participant) {
        this.__associateStreams(participant);
        if (participant instanceof room_RemoteParticipant) this.eventEmitter.emit(this.CONFERENCE_USER_PARTICIPANT_JOINED, participant);
    }
    _saveLocalVideoStream(stream) {
        const { localParticipant } = this;
        if (!localParticipant) return;
        const videoStream = new simple.Stream(stream, localParticipant);
        if (videoStream) {
            localParticipant.resetStreams([
                videoStream
            ]);
            localParticipant.onStreamSubscribed(videoStream);
        }
        return videoStream;
    }
    _onParticipantLeft(payload) {
        const leftParticipant = this.participants.find((participant)=>participant && participant.callId === payload.data.call_id);
        if (leftParticipant) leftParticipant.onDisconnect();
        this.participants = this.participants.filter((participant)=>participant && participant.callId !== payload.data.call_id);
        this.eventEmitter.emit(this.CONFERENCE_USER_PARTICIPANT_LEFT, leftParticipant);
    }
    _onParticipantTrackUpdate(oldParticipant, update) {
        const newParticipant = oldParticipant;
        const { trackId, streamId } = this._callIdStreamIdMap[newParticipant.callId] || {};
        const pc = simple.Phone.phone?.currentSipSession?.sessionDescriptionHandler?.peerConnection;
        const stream = pc.getRemoteStreams().find((someStream)=>someStream.id === streamId || someStream.getTracks().some((track)=>track.id === trackId));
        if ('downgrade' === update) {
            newParticipant.resetStreams([]);
            newParticipant.onStreamUnSubscribed(stream);
            return newParticipant;
        }
        if (stream) this._associateStreamTo(stream, newParticipant);
        return newParticipant;
    }
    __associateStreams(participant) {
        const { trackId } = this._callIdStreamIdMap[participant.callId] || {};
        if (!trackId) {
            this._unassociatedParticipants[participant.callId] = participant;
            return;
        }
        if (!trackId || !participant || !this.localParticipant || participant.callId === this.localParticipant.callId) return;
        const streamId = this._getStreamIdFrTrackId(trackId);
        const key = this._getUnassociatedMapIdFromTrackIdOrStreamId(trackId, streamId);
        const stream = key ? this._unassociatedVideoStreams[key] : null;
        if (stream) {
            this._associateStreamTo(stream, participant);
            if (key) delete this._unassociatedVideoStreams[key];
            delete this._unassociatedParticipants[participant.callId];
        }
    }
    _getUnassociatedMapIdFromTrackIdOrStreamId(trackId, streamId) {
        if (trackId in this._unassociatedVideoStreams) return trackId;
        if (streamId && streamId in this._unassociatedVideoStreams) return streamId;
        const idx = Object.values(this._unassociatedVideoStreams).findIndex((stream)=>stream && stream.id === streamId);
        return -1 === idx ? null : Object.keys(this._unassociatedVideoStreams)[idx];
    }
    _getStreamIdFrTrackId(trackId) {
        const mapping = Object.values(this._callIdStreamIdMap).find((map)=>map.trackId === trackId);
        return mapping ? mapping.streamId : null;
    }
    _associateStreamTo(rawStream, participant) {
        const stream = new simple.Stream(rawStream, participant);
        participant.streams.push(stream);
        participant.videoStreams.push(stream);
        participant.onStreamSubscribed(stream);
    }
    _getCallIdFromTrackId(trackId) {
        return Object.keys(this._callIdStreamIdMap).find((key)=>this._callIdStreamIdMap[key].trackId === trackId);
    }
    _getParticipantFromCallId(callId) {
        return this.participants.find((participant)=>participant.callId === callId);
    }
    _getLocalVideoStream() {
        return simple.Phone.getLocalVideoStream(this.callSession);
    }
}
const room_Room = Room_Room;
const SipRoom_logger = IssueReporter.loggerFor('sdk-sip-room');
class SipRoom extends room_Room {
    static async connect({ extension, constraints, audioOnly = false, extra, room }) {
        SipRoom_logger.info('connecting to sip room', {
            extension,
            audioOnly,
            room: !!room
        });
        if (!room) {
            await simple.Phone.connect({
                media: constraints
            });
            const withCamera = constraints && !!constraints.video;
            const callSession = await simple.Phone.call(extension, withCamera, null, audioOnly, true);
            room = new SipRoom(callSession, extension, null, null, extra);
        }
        if (room && room.callSession && room.callSession.call) room.setCallId(room.callSession.call.id);
        SipRoom_logger.info('connected to room', {
            extension: room.extension
        });
        return room;
    }
    mute() {
        SipRoom_logger.info('mute sip room');
        simple.Phone.mute(this.callSession, false);
        this.sendMuteStatus();
    }
    unmute() {
        SipRoom_logger.info('unmute sip room');
        simple.Phone.unmute(this.callSession, false);
        this.sendUnMuteStatus();
    }
    getLocalGuestName() {
        return simple.Phone.phone?.client.userAgent?.options.displayName || null;
    }
    _transferEvents() {
        simple.Phone.on(this.ON_MESSAGE, this._boundOnMessage);
        simple.Phone.on(this.ON_CHAT, this._boundOnChat);
        simple.Phone.on(this.ON_SIGNAL, this._boundOnSignal);
        simple.Phone.on(this.ON_VIDEO_INPUT_CHANGE, this._boundSaveLocalVideoStream);
        [
            this.ON_AUDIO_STREAM,
            this.ON_VIDEO_STREAM,
            this.ON_REMOVE_STREAM
        ].forEach((event)=>simple.Phone.on(event, (...args)=>this.eventEmitter.emit.apply(this.eventEmitter, [
                    event,
                    ...args
                ])));
    }
    _onMessage(message) {
        const body = super._onMessage(message);
        if (!body) return;
        const getChannel = ()=>body.channels[0];
        switch(body.type){
            case 'ConfbridgeWelcome':
                body.channels.forEach((channel)=>{
                    this._onParticipantJoined(channel);
                });
                break;
            case 'ConfbridgeJoin':
                {
                    const channel = getChannel();
                    this._onParticipantJoined(channel);
                    break;
                }
            case 'ConfbridgeLeave':
                {
                    const channel = getChannel();
                    this._onParticipantLeft({
                        data: {
                            call_id: channel.id
                        }
                    });
                    break;
                }
            default:
                break;
        }
    }
    async _onParticipantJoined(channel) {
        const isLocal = channel.channelvars.WAZO_SIP_CALL_ID === this._getCurrentSipCallIs();
        const callId = channel.id;
        const ParticipantClass = isLocal ? simple.LocalParticipant : simple.RemoteParticipant;
        const name = channel.caller ? channel.caller.name : null;
        const extra = isLocal ? {
            guestName: this.getLocalGuestName()
        } : {};
        const participant = new ParticipantClass(this, {
            caller_id_name: name,
            call_id: callId
        }, extra);
        const participantIdx = this.participants.findIndex((other)=>other.callId === participant.callId);
        if (-1 !== participantIdx && name) {
            this.participants[participantIdx].name = name;
            return;
        }
        if (isLocal) {
            if (this.callSession) this.callSession.ringing = false;
            this._onLocalParticipantJoined(participant);
            setTimeout(()=>{
                this.eventEmitter.emit(this.ON_JOINED, participant, this.participants);
            }, 1000);
        }
        this.participants.push(participant);
        this._isParticipantJoining(participant);
        return participant;
    }
    _getCurrentSipCallIs() {
        return simple.Phone.getSipSessionId(simple.Phone.phone?.currentSipSession);
    }
}
const room_SipRoom = SipRoom;
class Stream_Stream {
    htmlStream;
    participant;
    static detachStream(stream) {
        stream.getTracks().filter((track)=>track.enabled).forEach((track)=>track.stop());
    }
    constructor(htmlStream, participant){
        this.htmlStream = htmlStream;
        this.participant = participant;
    }
    attach(rawElement) {
        const element = rawElement || document.createElement('video');
        const isLocal = this.participant instanceof simple.LocalParticipant;
        element.autoplay = true;
        element.srcObject = this.htmlStream;
        element.muted = isLocal;
        if (isLocal) element.style.transform = 'scale(-1, 1)';
        element.onloadedmetadata = ()=>{
            const tracks = this.htmlStream ? this.htmlStream.getVideoTracks() : [];
            tracks.forEach((track)=>{
                track.enabled = true;
                track.loaded = true;
            });
        };
        return element;
    }
    detach() {
        Stream_Stream.detachStream(this.htmlStream);
    }
    hasVideo() {
        if (!this.htmlStream) return false;
        return this.htmlStream.getTracks().some((track)=>'video' === track.kind && 'ended' !== track.readyState);
    }
    get id() {
        return this.htmlStream ? this.htmlStream.id : null;
    }
}
const Stream = Stream_Stream;
const createLocalStream = async (kind, options = {})=>{
    const createOptions = {};
    createOptions[kind] = !(Object.keys(options).length > 0) || options;
    const mediaStream = await navigator.mediaDevices.getUserMedia(createOptions);
    return new simple.Stream(mediaStream, new simple.LocalParticipant(null, {
        call_id: 'some-call-id',
        caller_id_name: 'some-call-id-name'
    }));
};
const createLocalVideoStream = async (options)=>createLocalStream('video', options);
const createLocalAudioStream = async (options)=>createLocalStream('audio', options);
const { SOCKET_EVENTS: Websocket_SOCKET_EVENTS, ...OTHER_EVENTS } = websocket_client_namespaceObject;
const ALL_EVENTS = [
    ...Object.values(Websocket_SOCKET_EVENTS),
    ...Object.values(OTHER_EVENTS)
];
const Websocket_logger = IssueReporter.loggerFor('simple-ws-client');
class Websocket extends Emitter {
    ws;
    eventLists;
    CONFERENCE_USER_PARTICIPANT_JOINED;
    CONFERENCE_USER_PARTICIPANT_LEFT;
    MEETING_USER_PARTICIPANT_JOINED;
    MEETING_USER_PARTICIPANT_LEFT;
    CALL_CREATED;
    constructor(){
        super();
        Object.keys(OTHER_EVENTS).forEach((key)=>{
            this[key] = OTHER_EVENTS[key];
        });
        Object.keys(Websocket_SOCKET_EVENTS).forEach((key)=>{
            this[key] = Websocket_SOCKET_EVENTS[key];
        });
        this.eventLists = websocket_client.eventLists;
        this.ws = null;
    }
    open(host, session) {
        Websocket_logger.info('open simple WebSocket', {
            host,
            token: obfuscateToken(session.token)
        });
        this.ws = new websocket_client({
            host,
            token: session.token,
            events: [
                '*'
            ],
            version: 2,
            session
        }, {
            rejectUnauthorized: false,
            binaryType: 'arraybuffer'
        });
        this.ws.connect();
        ALL_EVENTS.forEach((event)=>{
            if (!this.ws) return;
            this.ws.on(event, (payload)=>{
                this.eventEmitter.emit(event, payload);
            });
        });
    }
    updateToken(token) {
        Websocket_logger.info('update token via simple Websocket', {
            token,
            ws: !!this.ws
        });
        if (!this.ws) return;
        this.ws.updateToken(token);
    }
    isOpen() {
        return this.ws?.isConnected() || false;
    }
    close(force = false) {
        Websocket_logger.info('Closing event transport websocket', {
            force,
            ws: !!this.ws
        });
        if (this.ws) this.ws.close(force);
        this.unbind();
    }
}
if (!__webpack_require__.g.wazoWebsocketInstance) __webpack_require__.g.wazoWebsocketInstance = new Websocket();
const simple_Websocket = __webpack_require__.g.wazoWebsocketInstance;
const simple_Wazo = {
    Auth: Auth,
    Phone: Phone,
    Websocket: simple_Websocket,
    Room: room_Room,
    SipRoom: room_SipRoom,
    RemoteParticipant: room_RemoteParticipant,
    LocalParticipant: LocalParticipant,
    Participant: Participant,
    Stream: Stream,
    createLocalVideoStream: createLocalVideoStream,
    createLocalAudioStream: createLocalAudioStream,
    Configuration: simple_Configuration,
    Directory: Directory,
    getApiClient: service_getApiClient,
    IssueReporter: IssueReporter,
    loggerFor: IssueReporter.loggerFor.bind(IssueReporter),
    Features: domain_Features,
    Checker: checker_Checker,
    domain: {
        BadResponse: BadResponse,
        ServerError: ServerError,
        Call: Call,
        CallLog: CallLog,
        CTIPhone: CTIPhone,
        Recording: Recording,
        ChatMessage: ChatMessage,
        ChatRoom: ChatRoom,
        Contact: Contact,
        ForwardOption: ForwardOption,
        Line: Line,
        NotificationOptions: NotificationOptions,
        Profile: Profile,
        Session: Session,
        Voicemail: Voicemail,
        Relocation: domain_Relocation,
        ConferenceRoom: Room,
        CallSession: CallSession,
        IndirectTransfer: IndirectTransfer,
        SwitchboardCall: domain_SwitchboardCall,
        WebRTCPhone: WebRTCPhone,
        Meeting: Meeting
    },
    get api () {
        return service_getApiClient();
    },
    get agentd () {
        return service_getApiClient().agentd;
    },
    get amid () {
        return service_getApiClient().amid;
    },
    get application () {
        return service_getApiClient().application;
    },
    get auth () {
        return service_getApiClient().auth;
    },
    get callLogd () {
        return service_getApiClient().callLogd;
    },
    get calld () {
        return service_getApiClient().calld;
    },
    get chatd () {
        return service_getApiClient().chatd;
    },
    get confd () {
        return service_getApiClient().confd;
    },
    get dird () {
        return service_getApiClient().dird;
    },
    get webhookd () {
        return service_getApiClient().webhookd;
    },
    InvalidSubscription: InvalidSubscription,
    InvalidAuthorization: InvalidAuthorization,
    CanceledCallError: CanceledCallError,
    SFUNotAvailableError: SFUNotAvailableError,
    NoTenantIdError: NoTenantIdError,
    NoDomainNameError: NoDomainNameError,
    NoSamlRouteError: NoSamlRouteError,
    SamlConfigError: SamlConfigError
};
if ('undefined' != typeof window) window.Wazo = simple_Wazo;
if (void 0 !== __webpack_require__.g) __webpack_require__.g.Wazo = simple_Wazo;
const simple = simple_Wazo;
const Country = {
    AUSTRALIA: 'AU',
    BELGIUM: 'BE',
    CANADA: 'CA',
    FRANCE: 'FR',
    GERMANY: 'DE',
    ISRAEL: 'IL',
    ITALY: 'IT',
    LUXEMBOURG: 'LU',
    MALAYSIA: 'MY',
    MONACO: 'MC',
    NETHERLANDS: 'NL',
    POLAND: 'PL',
    PORTUGAL: 'PT',
    UNITED_KINGDOM: 'GB',
    UNITED_STATES: 'US',
    SPAIN: 'ES',
    SWITZERLAND: 'CH'
};
class DebugDevice {
    connectToCall() {
        console.info('DebugDevice - Connected to call');
    }
    disconnectFromCall() {
        console.info('DebugDevice - Disconnected from call');
    }
    ringback() {
        console.info('DebugDevice - Ringback');
    }
    stopRingback() {
        console.info('DebugDevice - Stop ringback');
    }
    playRingtone() {
        console.info('DebugDevice - Play ringtone');
    }
    stopRingtone() {
        console.info('DebugDevice - Stop ringtone');
    }
    mute() {
        console.info('DebugDevice - Mute');
    }
    unmute() {
        console.info('DebugDevice - Unmute');
    }
    putOnSpeaker() {
        console.info('DebugDevice - Put on speaker');
    }
    putOffSpeaker() {
        console.info('DebugDevice - Put off speaker');
    }
}
const EXTRA_CHAR_REGEXP = /[^+*\d]/g;
const DEFAULT_GUESSING_COUNTRIES = [
    'US',
    'FR',
    'GB',
    'AU'
];
const shouldBeFormatted = (number)=>{
    if (!number || number.length <= 5) return false;
    return !number.includes('#') && !number.includes('*') && !number.match(/[aA-zZ]/);
};
const isSameCountry = (country1, country2)=>{
    if ('US' === country1 && 'CA' === country2 || 'US' === country2 && 'CA' === country1) return true;
    return country1 === country2;
};
const guessParsePhoneNumber = (number, defaultCountry, guessingCountries = DEFAULT_GUESSING_COUNTRIES)=>{
    const mergedCountries = [
        ...new Set([
            defaultCountry,
            ...guessingCountries
        ])
    ].filter(Boolean);
    let parsedNumber;
    for(let i = 0; i < mergedCountries.length; i++){
        const country = mergedCountries[i];
        parsedNumber = (0, __WEBPACK_EXTERNAL_MODULE_libphonenumber_js_7e4a9e9f__.parsePhoneNumber)(number, country);
        if (parsedNumber.isValid()) break;
    }
    return parsedNumber;
};
const getDisplayableNumber = (rawNumber, country, asYouType = false, guessingCountries = DEFAULT_GUESSING_COUNTRIES)=>{
    if (!rawNumber) return rawNumber;
    const number = String(rawNumber);
    if (!shouldBeFormatted(number)) return number;
    let displayValue = '';
    if (asYouType) displayValue = new __WEBPACK_EXTERNAL_MODULE_libphonenumber_js_7e4a9e9f__.AsYouType(country).input(number);
    else try {
        const parsedNumber = guessParsePhoneNumber(number, country, guessingCountries);
        displayValue = parsedNumber?.isValid() ? isSameCountry(String(parsedNumber.country), country) ? parsedNumber.formatNational() : parsedNumber.formatInternational() : rawNumber;
    } catch (error) {
        displayValue = rawNumber;
    }
    return displayValue;
};
const parsePhoneNumber = (phoneNumber)=>phoneNumber.replace(EXTRA_CHAR_REGEXP, '');
const getCallableNumber = (number, country)=>{
    try {
        const callableNumber = country ? getDisplayableNumber(number, country) : number;
        return parsePhoneNumber(callableNumber);
    } catch (_) {
        return number;
    }
};
const { SOCKET_EVENTS: types_SOCKET_EVENTS, ...types_OTHER_EVENTS } = websocket_client_namespaceObject;
const src_0 = simple;
export { AdHocAPIConference, domain_Agent as Agent, ApiRequester, BadResponse, BaseApiClient, Country as COUNTRIES, CTIPhone, Call, CallApi, CallLog, CallSession, CallerID, ChatMessage, ChatRoom, checker_Checker as Checker, Contact, DebugDevice, Emitter, ExternalApp, FORWARD_KEYS, domain_Features as Features, ForwardOption, Incall, IndirectTransfer, IssueReporter, LINE_STATE, Line, Meeting, MeetingAuthorization, MeetingStatus, NotificationOptions, STATE as PROFILE_STATE, Profile, RECORDING_STATE, Recording, domain_Relocation as Relocation, Room, SFUNotAvailableError, SOCKET_EVENTS, ServerError, Session, lib_WazoSessionDescriptionHandler as SessionDescriptionHandler, SipLine, domain_SwitchboardCall as SwitchboardCall, Voicemail, VoicemailFolder, ApiClient as WazoApiClient, WebRTCClient, WebRTCPhone, websocket_client as WebSocketClient, camelToUnderscore, src_0 as default, service_getApiClient as getApiClient, getCallableNumber, getDisplayableNumber, guessParsePhoneNumber, obfuscateToken, parsePhoneNumber, setApiToken, setCurrentServer, setIsMobile, setOnRefreshToken, setOnRefreshTokenError };
