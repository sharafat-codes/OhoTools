// Gamified single-purpose "test / benchmark" tools (CPS test, reaction time,
// keyboard tester). Kept in their own registry module — like conversions.ts and
// image-formats.ts — so registry.ts stays lean and this viral, low-competition
// cluster can grow (spacebar counter, aim trainer, typing test) in one place.
import { MousePointerClickIcon, ZapIcon, KeyboardIcon } from "lucide-react";

import type { DevTool } from "./registry";

export const gameTools: DevTool[] = [
  {
    slug: "cps-test",
    name: "CPS Test (Click Speed Test)",
    tagline: "Measure your clicks per second — how fast can you click?",
    description:
      "Free CPS test — measure your click speed in clicks per second. Choose 1, 5, or 10 seconds, beat your high score, and see your click-per-second rating.",
    keywords: [
      "cps test",
      "click speed test",
      "clicks per second",
      "click test",
      "cps",
      "click counter",
      "how fast can you click",
    ],
    icon: MousePointerClickIcon,
    intro:
      "Find out how fast you can click. Start clicking inside the box and the timer begins automatically — when it runs out you get your CPS (clicks per second), total clicks, and a speed rating. Pick a 1, 5, or 10-second challenge, then try to beat your high score. Everything runs in your browser.",
    steps: [
      "Pick a duration (5 seconds is the classic click speed test).",
      "Click as fast as you can inside the box — the timer starts on your first click.",
      "When time's up, read your CPS and total clicks, then click Try again to beat your best.",
    ],
    faqs: [
      {
        q: "What is a good CPS score?",
        a: "Most people click around 5–7 CPS in a 5-second test. Above 8 CPS is fast, and consistent scores over 10–12 CPS usually mean a special clicking technique (like jitter or butterfly clicking).",
      },
      {
        q: "What is CPS?",
        a: "CPS stands for clicks per second — the number of times you click your mouse in one second. It's calculated by dividing your total clicks by the length of the test.",
      },
      {
        q: "Does this count auto-clicker clicks?",
        a: "It counts every click your browser receives, so an auto-clicker will register — but scores far above human range (roughly 15+ CPS) are a giveaway. This test is meant for measuring your own natural clicking speed.",
      },
      {
        q: "How can I click faster?",
        a: "Common techniques are jitter clicking (tensing your arm to vibrate your finger) and butterfly clicking (alternating two fingers on one button). Warm up first, and use a mouse with light, responsive switches.",
      },
    ],
    related: ["reaction-time-test", "keyboard-tester", "stopwatch"],
  },
  {
    slug: "reaction-time-test",
    name: "Reaction Time Test",
    tagline: "Test your reflexes — how fast can you react to the green?",
    description:
      "Free online reaction time test — wait for green, then click as fast as you can. Measure your reflexes in milliseconds and beat your best score.",
    keywords: [
      "reaction time test",
      "reaction test",
      "reflex test",
      "reaction speed test",
      "click reaction time",
      "how fast are your reflexes",
    ],
    icon: ZapIcon,
    intro:
      "Test your reflexes: when the box turns red, wait — and the instant it turns green, click as fast as you can. You'll see your reaction time in milliseconds, your average over your last few tries, and your all-time best. Click too early and you'll have to start again. Runs entirely in your browser.",
    steps: [
      "Click the box to start, then wait — it will turn red.",
      "The moment it turns green, click as fast as you can.",
      "Read your reaction time in milliseconds and try again to lower your average.",
    ],
    faqs: [
      {
        q: "What is a good reaction time?",
        a: "The average human reaction time to a visual cue is about 250 milliseconds. Anything under 200 ms is excellent, and top gamers and athletes often land in the 150–200 ms range.",
      },
      {
        q: "Why did it say I clicked too soon?",
        a: "If you click while the box is still red — before it turns green — the test counts it as a false start and resets. This stops you from guessing the timing instead of actually reacting.",
      },
      {
        q: "What affects my reaction time?",
        a: "Sleep, caffeine, focus, age, and even your screen's refresh rate and input lag all play a part. Testing several times and taking your average gives the most reliable result.",
      },
      {
        q: "Is this the same test used in benchmarks?",
        a: "It uses the same wait-for-green method as popular reaction benchmarks, measured with your browser's high-resolution timer for accuracy.",
      },
    ],
    related: ["cps-test", "keyboard-tester", "stopwatch"],
  },
  {
    slug: "keyboard-tester",
    name: "Keyboard Tester",
    tagline: "Check every key on your keyboard — find dead or stuck keys.",
    description:
      "Free online keyboard tester — press any key to check it works. Instantly find dead, stuck, or ghosting keys on a visual keyboard. Nothing is recorded.",
    keywords: [
      "keyboard tester",
      "keyboard test",
      "key test",
      "test keyboard keys",
      "check keyboard online",
      "dead key test",
    ],
    icon: KeyboardIcon,
    intro:
      "Check whether every key on your keyboard works. Press any key and it lights up on the on-screen keyboard — keys you've tested stay highlighted, so it's easy to spot ones that don't respond. Perfect for finding dead, stuck, or unregistered keys on a new or second-hand keyboard. Keys are detected only in your browser and nothing you type is recorded or sent anywhere.",
    steps: [
      "Click the keyboard below to activate it, then press any key.",
      "Watch each key light up — tested keys stay highlighted so you can track your progress.",
      "Press every key in turn; any that never light up are likely dead or not registering.",
    ],
    faqs: [
      {
        q: "How do I test if a key is broken?",
        a: "Press it and watch the on-screen keyboard. If the matching key doesn't light up, that key isn't registering — it may be dead, dirty, or disconnected. Left and right Shift, Ctrl, and Alt are shown separately so you can test each one.",
      },
      {
        q: "Is what I type recorded?",
        a: "No. Key detection happens entirely in your browser — nothing you press is stored, logged, or sent to any server. It's completely private.",
      },
      {
        q: "Why don't F5, F11, or F12 register?",
        a: "Some keys are reserved by your browser or operating system (for refresh, full screen, or developer tools) and can't be captured by a web page. That's expected and doesn't mean the key is faulty.",
      },
      {
        q: "Can I test key ghosting or rollover?",
        a: "Yes — hold several keys at once. Keys currently held down are shown with a brighter highlight, so if you press three keys and only two respond, your keyboard may have a rollover (ghosting) limit.",
      },
    ],
    related: ["cps-test", "reaction-time-test", "online-notepad"],
  },
];

export const gameSlugs: string[] = gameTools.map((t) => t.slug);
