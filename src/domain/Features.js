// @flow

import getApiClient from '../service/getApiClient';

export const FEATURES = ['chat', 'video', 'call_recording', 'fax', 'mobile_double_call', 'mobile_gsm', 'meeting'];

export const getScopeName = (featureName: string) => `enterprise.app.${featureName}`;

const scopesToCheck = FEATURES.map(getScopeName);

// Handle available features on the engine.
class Features {
  _hasChat: boolean;
  _hasVideo: boolean;
  _hasCallRecording: boolean;
  _hasFax: boolean;
  _hasMobileDoubleCall: boolean;
  _hasMobileGsm: boolean;
  _hasMeeting: boolean;

  constructor() {
    this._hasChat = true;
    this._hasVideo = true;
    this._hasCallRecording = true;
    this._hasFax = true;
    this._hasMobileDoubleCall = true;
    this._hasMobileGsm = true;
    this._hasMeeting = true;
  }

  async fetchAccess() {
    let response;
    try {
      response = await getApiClient().auth.getRestrictionPolicies(scopesToCheck);
    } catch (_) {
      // Noting to do because everything should be available even if the API is not available
    }
    if (!response) {
      return;
    }
    const { scopes } = response;

    this._hasChat = this._hasFeatures(scopes, 'chat');
    this._hasVideo = this._hasFeatures(scopes, 'video');
    this._hasCallRecording = this._hasFeatures(scopes, 'call_recording');
    this._hasFax = this._hasFeatures(scopes, 'fax');
    this._hasMobileDoubleCall = this._hasFeatures(scopes, 'mobile_double_call');
    this._hasMobileGsm = this._hasFeatures(scopes, 'mobile_gsm');
    this._hasMeeting = this._hasFeatures(scopes, 'meeting');
  }

  hasChat() { return this._hasChat; }
  hasVideo() { return this._hasVideo; }
  hasCallRecording() { return this._hasCallRecording; }
  hasFax() { return this._hasFax; }
  hasMobileDoubleCall() { return this._hasMobileDoubleCall; }
  hasMobileGsm() { return this._hasMobileGsm; }
  hasMeeting() { return this._hasMeeting; }

  _hasFeatures(scopes: Object, featureName: string) {
    const scopeName = getScopeName(featureName);
    if (!scopes || !(scopeName in scopes)) {
      // Assume that the feature is available if not present (available by default)
      return true;
    }
    return scopes[scopeName] === true;
  }

}

export default new Features();
