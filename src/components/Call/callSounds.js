let audioCtx = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

export const playRing = (repeat = true) => {
  const ctx = getCtx();
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.value = 0.3;

  let interval = null;
  const playOnce = () => {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g1 = ctx.createGain();
    const g2 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.value = 440;
    osc2.type = "sine";
    osc2.frequency.value = 480;
    g1.gain.value = 0.15;
    g2.gain.value = 0.15;
    osc1.connect(g1).connect(gain);
    osc2.connect(g2).connect(gain);
    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.5);
    osc2.stop(ctx.currentTime + 0.5);
  };
  playOnce();
  if (repeat) {
    interval = setInterval(playOnce, 2000);
  }
  return () => {
    if (interval) clearInterval(interval);
  };
};

export const playAccept = () => {
  const ctx = getCtx();
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.value = 0.3;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(523, ctx.currentTime);
  osc.frequency.setValueAtTime(659, ctx.currentTime + 0.15);
  osc.frequency.setValueAtTime(784, ctx.currentTime + 0.3);
  osc.connect(gain);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
};

export const playHangup = () => {
  const ctx = getCtx();
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.value = 0.3;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.setValueAtTime(400, ctx.currentTime + 0.15);
  osc.frequency.setValueAtTime(200, ctx.currentTime + 0.3);
  osc.connect(gain);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);
};
