/* eslint-disable no-unused-vars */

/* global window, document */
const BRIDGE_CONFIG_RETRIEVED = 'bridge/CONFIG_RETRIEVED';
const BRIDGE_CREATE_OR_UPDATE_CARD = 'bridge/BRIDGE_CREATE_OR_UPDATE_CARD';
const BRIDGE_OPTIONS_FETCHED = 'bridge/BRIDGE_OPTIONS_FETCHED';
const BRIDGE_OPTIONS_FOUND = 'bridge/BRIDGE_OPTIONS_FOUND';
const BRIDGE_SEARCH_OPTIONS = 'bridge/BRIDGE_SEARCH_OPTIONS';
const BRIDGE_DISPLAY_LINKED_OPTION = 'bridge/DISPLAY_LINKED_OPTION';
const BRIDGE_UPDATE_FORM_SCHEMA = 'bridge/BRIDGE_UPDATE_FORM_SCHEMA';
const BRIDGE_WAZO_CONTACT_SEARCH = 'bridge/BRIDGE_WAZO_CONTACT_SEARCH';
const BRIDGE_ON_AGENT_LOGGED_IN = 'bridge/BRIDGE_ON_AGENT_LOGGED_IN';
const BRIDGE_ON_AGENT_LOGGED_OUT = 'bridge/BRIDGE_ON_AGENT_LOGGED_OUT';
const BRIDGE_ON_AGENT_PAUSED = 'bridge/BRIDGE_ON_AGENT_PAUSED';
const BRIDGE_ON_AGENT_RESUMED = 'bridge/BRIDGE_ON_AGENT_RESUMED';
const BRIDGE_ON_LANGUAGE_CHANGED = 'bridge/BRIDGE_ON_LANGUAGE_CHANGED';
const BRIDGE_ON_CALL_LOCALLY_ACCEPTED = 'bridge/BRIDGE_ON_CALL_LOCALLY_ACCEPTED';
const BRIDGE_ON_CALL_REJECTED = 'bridge/BRIDGE_ON_CALL_REJECTED';
const BRIDGE_ON_CALL_ESTABLISHED = 'bridge/BRIDGE_ON_CALL_ESTABLISHED';
const BRIDGE_ON_CALL_HELD = 'bridge/BRIDGE_ON_CALL_HELD';
const BRIDGE_ON_CALL_RESUMED = 'bridge/BRIDGE_ON_CALL_RESUMED';
const BRIDGE_ON_CALL_MUTED = 'bridge/BRIDGE_ON_CALL_MUTED';
const BRIDGE_ON_CALL_UN_MUTED = 'bridge/BRIDGE_ON_CALL_UN_MUTED';
const BRIDGE_ON_DTMF = 'bridge/BRIDGE_ON_DTMF';
const BRIDGE_ON_DIRECT_TRANSFER = 'bridge/BRIDGE_ON_DIRECT_TRANSFER';
const BRIDGE_ON_CREATE_INDIRECT_TRANSFER = 'bridge/BRIDGE_ON_CREATE_INDIRECT_TRANSFER';
const BRIDGE_ON_CANCEL_INDIRECT_TRANSFER = 'bridge/BRIDGE_ON_CANCEL_INDIRECT_TRANSFER';
const BRIDGE_ON_CONFIRM_INDIRECT_TRANSFER = 'bridge/BRIDGE_ON_CONFIRM_INDIRECT_TRANSFER';
const BRIDGE_ON_INDIRECT_TRANSFER_CALL_MADE = 'bridge/BRIDGE_ON_INDIRECT_TRANSFER_CALL_MADE';
const BRIDGE_ON_INDIRECT_TRANSFER_DONE = 'bridge/BRIDGE_ON_INDIRECT_TRANSFER_DONE';
const BRIDGE_ON_START_RECORDING = 'bridge/BRIDGE_ON_START_RECORDING';
const BRIDGE_ON_STOP_RECORDING = 'bridge/BRIDGE_ON_STOP_RECORDING';
const BRIDGE_ON_CARD_CANCELED = 'bridge/BRIDGE_ON_CARD_CANCELED';
const BRIDGE_ENABLE_AGENT = 'bridge/BRIDGE_ENABLE_AGENT';
const BRIDGE_SET_CARD_CONTENT = 'bridge/BRIDGE_SET_CARD_CONTENT';
const BRIDGE_ENABLE_DEBUG = 'bridge/BRIDGE_ENABLE_DEBUG';
const BRIDGE_INJECT_CSS = 'bridge/BRIDGE_INJECT_CSS';
const BRIDGE_CUSTOMIZE_APPEARANCE = 'bridge/BRIDGE_CUSTOMIZE_APPEARANCE';
const SDK_CLICK_TO_CALL = 'sdk/CLICK_TO_CALL';
const SDK_ON_OUTGOING_CALL_MADE = 'sdk/SDK_ON_OUTGOING_CALL_MADE';
const SDK_CALL_ENDED = 'sdk/ON_CALL_ENDED';
const SDK_CALL_INCOMING = 'sdk/SDK_CALL_INCOMING';
const SDK_AUTHENTICATED = 'sdk/SDK_AUTHENTICATED';
const SDK_LOGGED_OUT = 'sdk/SDK_LOGGED_OUT';

class Softphone {
  url: string;

  width: number;

  height: number;

  displayed: boolean;

  iframe: Record<string, any> | null | undefined;

  iframeLoaded: boolean;

  // Message waiting for the iframe to be loaded
  _pendingMessages: Record<string, any>[];

  onLinkEnabled(link: Record<string, any>) {}

  onIFrameLoaded() {}

  onCallLocallyAnswered(call: Record<string, any>) {}

  onCallEstablished(call: Record<string, any>) {}

  onOutgoingCallMade(call: Record<string, any>) {}

  onCallIncoming(call: Record<string, any>) {}

  onCallRejected(call: Record<string, any>) {}

  onCallEnded(call: Record<string, any>, card: Record<string, any>, direction: string, fromExtension: string) {}

  onCardSaved(card: Record<string, any>) {}

  onCardCanceled() {}

  onAuthenticated(session: Record<string, any>) {}

  onLoggedOut() {}

  onSearchOptions(fieldId: string, query: string) {
    this.onOptionsResults(fieldId, []);
  }

  onDisplayLinkedOption(optionId: string) {}

  onWazoContactSearch(query: string) {}

  onAgentLoggedIn() {}

  onAgentLoggedOut() {}

  onAgentPaused() {}

  onAgentResumed() {}

  onLanguageChanged(language: string) {}

  onCallHeld() {}

  onCallResumed() {}

  onCallMuted() {}

  onCallUnMuted() {}

  onDtmfSent(tone: string) {}

  onDirectTransfer(number: string) {}

  onCreateIndirectTransfer(number: string) {}

  onCancelIndirectTransfer() {}

  onConfirmIndirectTransfer() {}

  onIndirectCallMade(call: Record<string, any>) {}

  onIndirectTransferDone(call: Record<string, any>) {}

  onStartRecording() {}

  onStopRecording() {}

  onUnHandledEvent(event: Record<string, any>) {}

  init({
    url,
    width,
    height,
    server,
    port,
    language,
    wrapUpDuration,
    enableAgent = true,
    tenantId,
    domainName,
    debug = false,
  }: Record<string, any> = {}) {
    this.url = url || 'https://softphone.wazo.io';
    this.width = width || 500;
    this.height = height || 600;
    this.displayed = false;
    this.iframeLoaded = false;
    this.iframeLoaded = false;
    this._pendingMessages = [];
    window.addEventListener('message', this._onMessage.bind(this), false);

    if (!server) {
      throw new Error('`server` is not set');
    }

    const config: Record<string, any> = {
      server,
    };

    if (language) {
      config.language = language;
    }

    if (port) {
      config.port = port;
    }

    if (tenantId) {
      console.warn('Use of `tenantId` is deprecated when calling `Softphone.init()`, use `domainName` instead');
      config.tenantId = tenantId;
    }

    if (domainName) {
      config.domainName = domainName;
    }

    if (wrapUpDuration) {
      config.wrapUpDuration = wrapUpDuration;
    }

    this._sendMessage(BRIDGE_CONFIG_RETRIEVED, {
      config,
    });

    if (enableAgent) {
      this._sendMessage(BRIDGE_ENABLE_AGENT);
    }

    if (debug) {
      this._sendMessage(BRIDGE_ENABLE_DEBUG);
    }

    this._createIframe(() => {
      this.iframeLoaded = true;

      this._pendingMessages.forEach(([type, payload]) => this._sendMessage(type, payload));

      this.onIFrameLoaded();
    });
  }

  parseLinks() {
    const links = this._getLinks();

    links.forEach(link => {
      link.setAttribute('data-wazo-parsed', true);
      link.addEventListener('click', this._onLinkClick.bind(this));
      this.onLinkEnabled(link);
    });
  }

  makeCall(number: string) {
    this.displaySoftphone();

    this._sendMessage(SDK_CLICK_TO_CALL, {
      number,
    });
  }

  toggleSoftphoneDisplay() {
    if (this.displayed) {
      this.hideSoftphone();
    } else {
      this.displaySoftphone();
    }
  }

  displaySoftphone() {
    if (!this.iframe) {
      this._createIframe();
    }

    if (this.iframe) {
      this.iframe.style.display = 'block';
    }

    this.displayed = true;
  }

  hideSoftphone() {
    if (this.iframe) {
      this.iframe.style.display = 'none';
    }

    this.displayed = false;
  }

  optionsFetched(fieldId: string, options: any[]) {
    this._sendMessage(BRIDGE_OPTIONS_FETCHED, {
      fieldId,
      options,
    });
  }

  onOptionsResults(fieldId: string, options: any[]) {
    this._sendMessage(BRIDGE_OPTIONS_FOUND, {
      fieldId,
      options,
    });
  }

  setFormSchema(schema: Record<string, any>, uiSchema: Record<string, any>) {
    this._sendMessage(BRIDGE_UPDATE_FORM_SCHEMA, {
      schema,
      uiSchema,
    });
  }

  setCardValue(field: string, value: any) {
    this._sendMessage(BRIDGE_SET_CARD_CONTENT, {
      field,
      value,
    });
  }

  injectCss(css: string) {
    this._sendMessage(BRIDGE_INJECT_CSS, {
      css,
    });
  }

  customizeAppearance(themes: Record<string, any>, translations: Record<string, any>, assets: Record<string, any>) {
    this._sendMessage(BRIDGE_CUSTOMIZE_APPEARANCE, {
      themes,
      translations,
      assets,
    });
  }

  _createIframe(cb: (...args: Array<any>) => any = () => {}) {
    this.iframe = document.createElement('iframe');
    // $FlowFixMe
    this.iframe.width = this.width;
    // $FlowFixMe
    this.iframe.height = this.height;
    // $FlowFixMe
    this.iframe.allow = 'camera *; microphone *; autoplay *; display-capture *';
    this.iframe.style.position = 'absolute';
    this.iframe.style.left = '0';
    this.iframe.style.bottom = '0';
    this.iframe.style.border = '1px solid #aaa';
    this.iframe.style.backgroundColor = 'white';
    this.iframe.src = this.url;
    this.iframe.style.display = 'none';
    this.iframe.id = 'wazo-softphone';
    this.iframe.onload = cb;
    // $FlowFixMe
    document.body.appendChild(this.iframe);
  }

  _getLinks() {
    return [].slice.call(document.querySelectorAll('a:not([data-wazo-parsed])'), 0).filter(link => link.href.indexOf('tel:') === 0 || link.href.indexOf('callto:') === 0);
  }

  _onLinkClick(e: Record<string, any>) {
    e.preventDefault();
    const number = e.target.href.split(':')[1];
    this.makeCall(number);
  }

  _onAuthenticated() {
    this.parseLinks();
  }

  _onMessage(event: Record<string, any>) {
    if (!event.data) {
      return;
    }

    switch (event.data.type) {
      case SDK_ON_OUTGOING_CALL_MADE:
        this.onOutgoingCallMade(event.data.callSession);
        break;

      case SDK_CALL_ENDED:
      {
        const {
          callSession,
          content,
          direction,
          userExtension,
        } = event.data;
        this.onCallEnded(callSession, content, direction, userExtension);
        break;
      }

      case SDK_CALL_INCOMING:
        this.onCallIncoming(event.data.callSession);
        break;

      case SDK_AUTHENTICATED:
        // $FlowFixMe
        this._onAuthenticated(event.data.session);

        this.onAuthenticated(event.data.session);
        break;

      case SDK_LOGGED_OUT:
        this.onLoggedOut();
        break;

      case BRIDGE_CREATE_OR_UPDATE_CARD:
      {
        const {
          content,
        } = event.data;
        this.onCardSaved(content);
        break;
      }

      case BRIDGE_SEARCH_OPTIONS:
      {
        const {
          fieldId,
          query,
        } = event.data;
        this.onSearchOptions(fieldId, query);
        break;
      }

      case BRIDGE_DISPLAY_LINKED_OPTION:
        this.onDisplayLinkedOption(event.data.linkedOptionId);
        break;

      case BRIDGE_WAZO_CONTACT_SEARCH:
        this.onWazoContactSearch(event.data.query);
        break;

      case BRIDGE_ON_AGENT_LOGGED_IN:
        this.onAgentLoggedIn();
        break;

      case BRIDGE_ON_AGENT_LOGGED_OUT:
        this.onAgentLoggedOut();
        break;

      case BRIDGE_ON_AGENT_PAUSED:
        this.onAgentPaused();
        break;

      case BRIDGE_ON_AGENT_RESUMED:
        this.onAgentResumed();
        break;

      case BRIDGE_ON_LANGUAGE_CHANGED:
        this.onLanguageChanged(event.data.language);
        break;

      case BRIDGE_ON_CALL_HELD:
        this.onCallHeld();
        break;

      case BRIDGE_ON_CALL_RESUMED:
        this.onCallResumed();
        break;

      case BRIDGE_ON_CALL_MUTED:
        this.onCallMuted();
        break;

      case BRIDGE_ON_CALL_UN_MUTED:
        this.onCallUnMuted();
        break;

      case BRIDGE_ON_DTMF:
        this.onDtmfSent(event.data.tone);
        break;

      case BRIDGE_ON_DIRECT_TRANSFER:
        this.onDirectTransfer(event.data.number);
        break;

      case BRIDGE_ON_CREATE_INDIRECT_TRANSFER:
        this.onCreateIndirectTransfer(event.data.number);
        break;

      case BRIDGE_ON_CANCEL_INDIRECT_TRANSFER:
        this.onCancelIndirectTransfer();
        break;

      case BRIDGE_ON_CONFIRM_INDIRECT_TRANSFER:
        this.onConfirmIndirectTransfer();
        break;

      case BRIDGE_ON_INDIRECT_TRANSFER_CALL_MADE:
        this.onIndirectCallMade(event.data.call);
        break;

      case BRIDGE_ON_INDIRECT_TRANSFER_DONE:
        this.onIndirectTransferDone(event.data.call);
        break;

      case BRIDGE_ON_START_RECORDING:
        this.onStartRecording();
        break;

      case BRIDGE_ON_STOP_RECORDING:
        this.onStopRecording();
        break;

      case BRIDGE_ON_CARD_CANCELED:
        this.onCardCanceled();
        break;

      case BRIDGE_ON_CALL_LOCALLY_ACCEPTED:
        this.onCallLocallyAnswered(event.data.call);
        break;

      case BRIDGE_ON_CALL_REJECTED:
        this.onCallRejected(event.data.call);
        break;

      case BRIDGE_ON_CALL_ESTABLISHED:
        this.onCallEstablished(event.data.call);
        break;

      default:
        this.onUnHandledEvent(event);
        break;
    }
  }

  _sendMessage(type: string, payload: Record<string, any> = {}) {
    if (!this.iframe || !this.iframeLoaded) {
      this._pendingMessages.push([type, payload]);

      return;
    }

    this.iframe.contentWindow.postMessage({
      type,
      ...payload,
    }, '*');
  }

}

export default new Softphone();
