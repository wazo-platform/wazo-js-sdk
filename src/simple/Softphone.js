// @flow
/* eslint-disable no-unused-vars */
/* global window, document */
const BRIDGE_CONFIG_RETRIEVED = 'bridge/CONFIG_RETRIEVED';
const BRIDGE_ENABLE_CARD = 'bridge/ENABLE_CARD';
const BRIDGE_CHANGE_REQUIRED_SUBSCRIPTION_TYPE = 'bridge/CHANGE_REQUIRED_SUBSCRIPTION_TYPE';
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

const SDK_CLICK_TO_CALL = 'sdk/CLICK_TO_CALL';
const SDK_ON_CALL_MADE = 'sdk/SDK_ON_CALL_MADE';
const SDK_CALL_ENDED = 'sdk/ON_CALL_ENDED';
const SDK_CALL_INCOMING = 'sdk/SDK_CALL_INCOMING';
const SDK_AUTHENTICATED = 'sdk/SDK_AUTHENTICATED';
const SDK_LOGGED_OUT = 'sdk/SDK_LOGGED_OUT';

class Softphone {
  url: string = 'https://softphone.wazo.io';
  width: number = 500;
  height: number = 600;
  displayed: boolean = false;
  iframe: ?Object = null;

  onLinkEnabled(link: Object) {}
  onIFrameLoaded() {}

  onCallMade(call: Object) {}
  onCallIncoming(call: Object) {}
  onCallEnded(call: Object, card: Object, direction: string, fromExtension: string) {}
  onCardSaved(card: Object) {}
  onAuthenticated(session: Object) {}
  onLoggedOut() {}
  onSearchOptions(fieldId: string, query: string) {}
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
  onIndirectCallMade(call: Object) {}
  onIndirectTransferDone(call: Object) {}
  onStartRecording() {}
  onStopRecording() {}
  onUnHandledEvent(event: Object) {}

  init({ url, width, height, server, port, language, wrapUpDuration, shouldDisplayLinkedEntities,
    allowContactCreation, withCard, subscriptionType, enableAgent }: Object = {}) {
    if (url) {
      this.url = url;
    }
    if (width) {
      this.width = width;
    }
    if (height) {
      this.height = height;
    }

    window.addEventListener('message', this._onMessage.bind(this), false);

    if (!server) {
      // eslint-disable-next-line no-param-reassign
      server = 'stack.dev.wazo.io';
    }

    this._createIframe(() => {
      this._sendMessage(BRIDGE_CONFIG_RETRIEVED, {
        config: {
          server,
          port,
          language,
          wrapUpDuration,
          shouldDisplayLinkedEntities,
          allowContactCreation,
        },
      });

      if (withCard) {
        this._sendMessage(BRIDGE_ENABLE_CARD);
      }

      if (subscriptionType) {
        this._sendMessage(BRIDGE_CHANGE_REQUIRED_SUBSCRIPTION_TYPE, { subscriptionType });
      }

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

    this._sendMessage(SDK_CLICK_TO_CALL, { number });
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
    this._sendMessage(BRIDGE_OPTIONS_FETCHED, { fieldId, options });
  }

  onOptionsResults(fieldId: string, options: any[]) {
    this._sendMessage(BRIDGE_OPTIONS_FOUND, { fieldId, options });
  }

  setFormSchema(schema: Object, uiSchema: Object) {
    this._sendMessage(BRIDGE_UPDATE_FORM_SCHEMA, { schema, uiSchema });
  }

  _createIframe(cb: Function = () => {}) {
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
    return [].slice.call(document.querySelectorAll('a:not([data-wazo-parsed])'), 0)
      .filter(link => link.href.indexOf('tel:') === 0 || link.href.indexOf('callto:') === 0);
  }

  _onLinkClick(e: Object) {
    e.preventDefault();
    const number = e.target.href.split(':')[1];

    this.makeCall(number);
  }

  _onAuthenticated() {
    this.parseLinks();
  }

  _onMessage(event: Object) {
    if (!event.data) {
      return;
    }

    switch (event.data.type) {
      case SDK_ON_CALL_MADE:
        this.onCallMade(event.data.callSession);
        break;
      case SDK_CALL_ENDED: {
        const { callSession, content, direction, userExtension } = event.data;
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
      case BRIDGE_CREATE_OR_UPDATE_CARD: {
        const { content } = event.data;
        this.onCardSaved(content);
        break;
      }
      case BRIDGE_SEARCH_OPTIONS: {
        const { fieldId, query } = event.data;
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
      default:
        this.onUnHandledEvent(event);
        break;
    }
  }

  _sendMessage(type: string, payload: Object = {}) {
    if (!this.iframe) {
      console.warn(`Could not send message of type ${type} to the Wazo Softphone, iframe not created yet`);
      return;
    }

    this.iframe.contentWindow.postMessage({ type, ...payload }, '*');
  }
}

export default new Softphone();
