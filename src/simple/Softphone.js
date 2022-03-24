// @flow
/* eslint-disable no-unused-vars */
/* global window, document */
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

  onCallMade(call: Object) {}
  onCallIncoming(call: Object) {}
  onCallEnded(call: Object, card: Object, direction: string, fromExtension: string) {}
  onAuthenticated(session: Object) {}
  onLoggedOut() {}

  init(url: string, width: number, height: number) {
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

    this._createIframe();
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

    if (this.iframe) {
      this.iframe.contentWindow.postMessage({ type: SDK_CLICK_TO_CALL, number }, '*');
    }
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

  _createIframe() {
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
    this.iframe.src = this.url;
    this.iframe.style.display = 'none';
    this.iframe.id = 'wazo-softphone';

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
      default:
        break;
    }
  }
}

export default new Softphone();
