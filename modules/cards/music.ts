// Synthesized card melodies, rendered with Web Audio oscillators — no audio
// assets, no network fetch, no licensing concerns. Every tune below is public
// domain: "Happy Birthday to You" (since 2016), Wagner's Bridal Chorus (1850),
// Pachelbel's Canon in D (c. 1680), "Auld Lang Syne", "Deck the Halls",
// Elgar's Pomp and Circumstance (1901) and "Twinkle, Twinkle, Little Star".
//
// Eid and Diwali deliberately get a neutral celebratory arpeggio rather than
// borrowed religious music.

import type { Occasion } from "@/modules/cards/types";

const F: Record<string, number> = {
  E4: 329.63, F4: 349.23, FS4: 369.99, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, CS5: 554.37, D5: 587.33, E5: 659.25, F5: 698.46, FS5: 739.99,
  G5: 783.99, A5: 880.0, B5: 987.77, C6: 1046.5,
};

type Note = [keyof typeof F | "rest", number]; // [note, beats]

const HAPPY_BIRTHDAY: Note[] = [
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
  ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 1],
  ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 2],
];

// Wagner, Bridal Chorus — "Here comes the bride".
const BRIDAL_CHORUS: Note[] = [
  ["C5", 0.5], ["F5", 0.75], ["F5", 0.25], ["F5", 1.5],
  ["C5", 0.5], ["G5", 0.75], ["F5", 0.25], ["E5", 1.5],
  ["F5", 0.5], ["A5", 0.75], ["A5", 0.25], ["A5", 1.5],
  ["F5", 0.5], ["G5", 0.75], ["F5", 0.25], ["E5", 2],
];

// Pachelbel, Canon in D — the descending upper line.
const CANON_IN_D: Note[] = [
  ["FS5", 1], ["E5", 1], ["D5", 1], ["CS5", 1],
  ["B4", 1], ["A4", 1], ["B4", 1], ["CS5", 1],
  ["D5", 1], ["CS5", 1], ["B4", 1], ["A4", 1],
  ["G4", 1], ["FS4", 1], ["G4", 1], ["E4", 2],
];

const AULD_LANG_SYNE: Note[] = [
  ["G4", 0.5], ["C5", 1], ["C5", 0.5], ["C5", 1], ["E5", 1], ["D5", 0.5], ["C5", 1], ["D5", 1.5],
  ["E5", 0.5], ["D5", 1], ["C5", 0.5], ["C5", 1], ["E5", 1], ["G5", 2],
];

const DECK_THE_HALLS: Note[] = [
  ["G5", 1], ["F5", 0.5], ["E5", 0.5], ["D5", 1], ["C5", 0.5], ["D5", 0.5], ["E5", 1], ["C5", 1],
  ["D5", 0.5], ["E5", 0.5], ["F5", 0.5], ["D5", 0.5], ["E5", 0.5], ["D5", 0.5], ["C5", 0.5], ["B4", 0.5],
  ["C5", 2],
];

// Elgar, Pomp and Circumstance — the graduation-processional phrase.
const POMP: Note[] = [
  ["G4", 1], ["C5", 2], ["B4", 0.5], ["C5", 0.5],
  ["D5", 1], ["E5", 1], ["C5", 2],
  ["E5", 1], ["D5", 0.5], ["C5", 0.5], ["D5", 1], ["E5", 1], ["G5", 2],
];

const TWINKLE: Note[] = [
  ["C5", 1], ["C5", 1], ["G5", 1], ["G5", 1], ["A5", 1], ["A5", 1], ["G5", 2],
  ["F5", 1], ["F5", 1], ["E5", 1], ["E5", 1], ["D5", 1], ["D5", 1], ["C5", 2],
];

// Neutral, non-denominational celebratory arpeggio.
const CELEBRATION: Note[] = [
  ["C5", 0.5], ["E5", 0.5], ["G5", 0.5], ["C6", 1.5],
  ["B5", 0.5], ["G5", 0.5], ["C6", 2],
];

const BY_OCCASION: Record<Occasion, Note[]> = {
  birthday: HAPPY_BIRTHDAY,
  wedding: BRIDAL_CHORUS,
  engagement: BRIDAL_CHORUS,
  "save-the-date": BRIDAL_CHORUS,
  anniversary: CANON_IN_D,
  valentine: CANON_IN_D,
  christmas: DECK_THE_HALLS,
  newyear: AULD_LANG_SYNE,
  graduation: POMP,
  "baby-shower": TWINKLE,
  eid: CELEBRATION,
  diwali: CELEBRATION,
};

/** Human label for the tune an occasion plays, for UI hints. */
export const MUSIC_LABEL: Record<Occasion, string> = {
  birthday: "Happy Birthday",
  wedding: "the Bridal Chorus",
  engagement: "the Bridal Chorus",
  "save-the-date": "the Bridal Chorus",
  anniversary: "Canon in D",
  valentine: "Canon in D",
  christmas: "Deck the Halls",
  newyear: "Auld Lang Syne",
  graduation: "Pomp and Circumstance",
  "baby-shower": "Twinkle, Twinkle, Little Star",
  eid: "a celebration chime",
  diwali: "a celebration chime",
};

const BEAT = 0.42; // seconds per beat

/**
 * Plays the melody matching the occasion. Returns a stop() function.
 * Unknown occasions fall back to the neutral celebration arpeggio rather than
 * to Happy Birthday, which used to play on every card regardless.
 */
export function playCardMusic(ctx: AudioContext, occasion?: Occasion): () => void {
  const melody = (occasion && BY_OCCASION[occasion]) || CELEBRATION;

  const master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);

  const oscs: OscillatorNode[] = [];
  let t = ctx.currentTime + 0.06;

  for (const [note, beats] of melody) {
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
