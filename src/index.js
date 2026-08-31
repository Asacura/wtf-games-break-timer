class GameBreakTimer {
  constructor({
    minutes = 20,
    onTick = () => {},
    onComplete = () => {},
    tickIntervalMs = 250,
    now = () => Date.now(),
    setIntervalFn = setInterval,
    clearIntervalFn = clearInterval
  } = {}) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.tickIntervalMs = tickIntervalMs;
    this._now = now;
    this._setInterval = setIntervalFn;
    this._clearInterval = clearIntervalFn;
    this._intervalId = null;
    this._endAt = null;

    this.setMinutes(minutes);
  }

  get isRunning() {
    return this._intervalId !== null;
  }

  get remainingSeconds() {
    return this._remainingSeconds;
  }

  setMinutes(minutes) {
    if (this.isRunning) {
      throw new Error("Pause the timer before changing its duration");
    }

    if (!Number.isFinite(minutes) || minutes <= 0) {
      throw new TypeError("minutes must be a positive number");
    }

    this._initialSeconds = Math.max(1, Math.round(minutes * 60));
    this._remainingSeconds = this._initialSeconds;
    this._emitTick();
    return this;
  }

  start() {
    if (this.isRunning) {
      return this;
    }

    this._endAt = this._now() + this._remainingSeconds * 1000;
    this._intervalId = this._setInterval(() => this._sync(), this.tickIntervalMs);
    this._sync();
    return this;
  }

  pause() {
    if (!this.isRunning) {
      return this;
    }

    this._sync();
    this._stop();
    return this;
  }

  reset() {
    this._stop();
    this._remainingSeconds = this._initialSeconds;
    this._emitTick();
    return this;
  }

  _sync() {
    if (!this.isRunning) {
      return;
    }

    const nextSeconds = Math.max(0, Math.ceil((this._endAt - this._now()) / 1000));
    if (nextSeconds !== this._remainingSeconds) {
      this._remainingSeconds = nextSeconds;
      this._emitTick();
    }

    if (nextSeconds === 0) {
      this._stop();
      this.onComplete(this);
    }
  }

  _stop() {
    if (this._intervalId !== null) {
      this._clearInterval(this._intervalId);
      this._intervalId = null;
    }
    this._endAt = null;
  }

  _emitTick() {
    this.onTick(this._remainingSeconds, this);
  }
}

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

module.exports = {
  GameBreakTimer,
  formatTime
};
