// @flow

// Handle available features on the engine.
class Features {
  _hasChat: boolean;
  _hasVideo: boolean;
  _hasCallRecording: boolean;
  _hasFax: boolean;
  _hasMobileDoubleCall: boolean;
  _hasMobileGsm: boolean;

  constructor() {
    this._hasChat = false;
    this._hasVideo = false;
    this._hasCallRecording = false;
    this._hasFax = false;
    this._hasMobileDoubleCall = false;
    this._hasMobileGsm = false;
  }

  fetchAccess() {
    // @TODO: call apis
    this._hasChat = true;
    this._hasVideo = true;
    this._hasCallRecording = true;
    this._hasFax = true;
    this._hasMobileDoubleCall = true;
    this._hasMobileGsm = true;
  }

  hasChat() { return this._hasChat; }
  hasVideo() { return this._hasVideo; }
  hasCallRecording() { return this._hasCallRecording; }
  hasFax() { return this._hasFax; }
  hasMobileDoubleCall() { return this._hasMobileDoubleCall; }
  hasMobileGsm() { return this._hasMobileGsm; }

}

export default new Features();
