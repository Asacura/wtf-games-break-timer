# wtf-games-break-timer

A small, framework-free JavaScript timer core for browser games, focus sessions, and screen breaks.

It powers the free [Game Break Timer on WTF Games](https://wtfgames.io/game-break-timer/), where you can try the browser version without an account or download.

## Install

```bash
npm install wtf-games-break-timer
```

## Usage

```js
const { GameBreakTimer, formatTime } = require("wtf-games-break-timer");

const timer = new GameBreakTimer({
  minutes: 20,
  onTick: (seconds) => {
    document.querySelector("#countdown").textContent = formatTime(seconds);
  },
  onComplete: () => {
    document.querySelector("#message").textContent = "Time for a break";
  }
});

timer.start();
// timer.pause();
// timer.reset();
```

The timer uses a wall-clock deadline, so it stays accurate when a browser throttles an inactive tab. No data is collected or sent by this package.

## API

- `new GameBreakTimer(options)` — create a timer. `minutes` defaults to `20`.
- `timer.start()` — start or resume the countdown.
- `timer.pause()` — pause the countdown.
- `timer.reset()` — return to the initial duration.
- `timer.setMinutes(minutes)` — change the duration while paused.
- `timer.remainingSeconds` — current remaining time.
- `timer.isRunning` — whether the timer is active.
- `formatTime(seconds)` — format seconds as `mm:ss`.

## Development

```bash
npm test
```

## License

MIT

