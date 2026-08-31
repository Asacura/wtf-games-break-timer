const test = require("node:test");
const assert = require("node:assert/strict");
const { GameBreakTimer, formatTime } = require("../src");

test("formatTime renders a stable mm:ss value", () => {
  assert.equal(formatTime(0), "00:00");
  assert.equal(formatTime(125), "02:05");
  assert.equal(formatTime(3661), "61:01");
});

test("timer uses a wall-clock deadline and can pause/resume", () => {
  let now = 0;
  let tick;
  const timer = new GameBreakTimer({
    minutes: 1,
    now: () => now,
    setIntervalFn: (callback) => {
      tick = callback;
      return "interval";
    },
    clearIntervalFn: () => {}
  });

  timer.start();
  now = 5000;
  tick();
  assert.equal(timer.remainingSeconds, 55);

  timer.pause();
  now = 30000;
  timer.start();
  now = 55000;
  tick();
  assert.equal(timer.remainingSeconds, 30);
});

test("timer completes once when the deadline is reached", () => {
  let now = 0;
  let tick;
  let completions = 0;
  const timer = new GameBreakTimer({
    minutes: 0.01,
    now: () => now,
    onComplete: () => {
      completions += 1;
    },
    setIntervalFn: (callback) => {
      tick = callback;
      return "interval";
    },
    clearIntervalFn: () => {}
  });

  timer.start();
  now = 1000;
  tick();
  tick();

  assert.equal(timer.remainingSeconds, 0);
  assert.equal(timer.isRunning, false);
  assert.equal(completions, 1);
});
