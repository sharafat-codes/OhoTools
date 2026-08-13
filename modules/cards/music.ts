// Synthesized "Happy Birthday to You" — the melody is public domain (since 2016)
// and rendered with Web Audio oscillators, so there are no audio assets or
// licensing concerns. Returns a stop() function.

const F: Record<string, number> = {
  G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
};

// [note, beats]
const MELODY: [keyof typeof F | "rest", number][] = [
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
  ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 1],
  ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2],
];

const BEAT = 0.42; // seconds per beat

export function playHappyBirthday(ctx: AudioContext): () => void {
  const master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);

  const oscs: OscillatorNode[] = [];
  let t = ctx.currentTime + 0.06;

  for (const [note, beats] of MELODY) {
    const dur = beats * BEAT;
    if (note !== "rest") {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = F[note];
      const end = t + dur * 0.92;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(1, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(end + 0.02);
      oscs.push(osc);
    }
    t += dur;
  }

  return () => {
    for (const o of oscs) {
      try { o.stop(); } catch { /* already stopped */ }
    }
    try { master.disconnect(); } catch { /* ignore */ }
  };
}
