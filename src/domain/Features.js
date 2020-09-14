// @flow

// Handle available features on the engine.
import getApiClient from '../service/getApiClient';

export const FEATURES = ['chat', 'video', 'call_recording', 'fax', 'mobile_double_call', 'mobile_gsm'];

export const getScopeName = (featureName: string) => `enterprise.app.${featureName}`;

const scopesToCheck = FEATURES.map(getScopeName);

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

  async fetchAccess() {
    const response = await getApiClient().auth.getRestrictionPolicies(scopesToCheck);
    if (!response) {
      return;
    }
    const { scopes } = response;
    console.log('response', response);

    this._hasChat = this._hasFeatures(scopes, 'chat');
    this._hasVideo = this._hasFeatures(scopes, 'video');
    this._hasCallRecording = this._hasFeatures(scopes, 'call_recording');
    this._hasFax = this._hasFeatures(scopes, 'fax');
    this._hasMobileDoubleCall = this._hasFeatures(scopes, 'mobile_double_call');
    this._hasMobileGsm = this._hasFeatures(scopes, 'mobile_gsm');
  }

  hasChat() { return this._hasChat; }
  hasVideo() { return this._hasVideo; }
  hasCallRecording() { return this._hasCallRecording; }
  hasFax() { return this._hasFax; }
  hasMobileDoubleCall() { return this._hasMobileDoubleCall; }
  hasMobileGsm() { return this._hasMobileGsm; }

  _hasFeatures = (scopes: Object, featureName: string) => scopes[getScopeName(featureName)] === true;

}

export default new Features();
