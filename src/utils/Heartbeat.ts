const DEFAULT_HEARTBEAT_DELAY = 2000;
const DEFAULT_HEARTBEAT_TIMEOUT = 5000;
const DEFAULT_MAX_HEARTBEATS = 3;

class Heartbeat {
  heartbeatDelay: number;

  heartbeatTimeout: number;

  maxHeartbeats: number;

  hasHeartbeat: boolean;

  _heartbeatDelayTimeout: ReturnType<typeof setTimeout> | undefined;

  _heartbeatNotReceivedTimeout: ReturnType<typeof setTimeout> | undefined;

  _heartbeatTries: number;

  _sendHeartbeatCallback: ((...args: Array<any>) => any) | null | undefined;

  _onTimeoutCallback: ((...args: Array<any>) => any) | null | undefined;

  constructor(heartbeatDelay: number = DEFAULT_HEARTBEAT_DELAY, heartbeatTimeout: number = DEFAULT_HEARTBEAT_TIMEOUT, maxHeartbeats: number = DEFAULT_MAX_HEARTBEATS) {
    this.heartbeatDelay = heartbeatDelay;
    this.heartbeatTimeout = heartbeatTimeout;
    this.maxHeartbeats = maxHeartbeats;
    this.hasHeartbeat = false;
    this._heartbeatTries = 0;
  }

  setSendHeartbeat(cb: (...args: Array<any>) => any) {
    this._sendHeartbeatCallback = cb;
  }

  setOnHeartbeatTimeout(cb: (...args: Array<any>) => any) {
    this._onTimeoutCallback = cb;
  }

  stop() {
    this.hasHeartbeat = false;

    if (this._heartbeatNotReceivedTimeout) {
      clearTimeout(this._heartbeatNotReceivedTimeout);
    }

    if (this._heartbeatDelayTimeout) {
      clearTimeout(this._heartbeatDelayTimeout);
    }
  }

  start() {
    this.stop();
    this.hasHeartbeat = true;
    this._heartbeatTries = 0;

    this._sendHeartbeat();
  }

  onHeartbeat() {
    this._clearTimeouts();

    if (!this.hasHeartbeat) {
      return;
    }

    this._sendHeartbeat();
  }

  _sendHeartbeat() {
    if (this._heartbeatTries >= this.maxHeartbeats) {
      return;
    }

    this._clearTimeouts();

    this._heartbeatDelayTimeout = setTimeout(() => {
      this._heartbeatTries++;

      if (this._sendHeartbeatCallback) {
        this._sendHeartbeatCallback();
      }
    }, this.heartbeatDelay);

    if (this._onTimeoutCallback) {
      this._heartbeatNotReceivedTimeout = setTimeout(this._onTimeoutCallback, this.heartbeatTimeout);
    }
  }

  _clearTimeouts() {
    if (this._heartbeatNotReceivedTimeout) {
      clearTimeout(this._heartbeatNotReceivedTimeout);
    }

    if (this._heartbeatDelayTimeout) {
      clearTimeout(this._heartbeatDelayTimeout);
    }
  }

}

export default Heartbeat;
