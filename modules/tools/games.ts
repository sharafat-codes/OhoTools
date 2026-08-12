// Gamified single-purpose "test / benchmark" tools (CPS test, reaction time,
// keyboard tester). Kept in their own registry module — like conversions.ts and
// image-formats.ts — so registry.ts stays lean and this viral, low-competition
// cluster can grow (spacebar counter, aim trainer, typing test) in one place.
import { MousePointerClickIcon, ZapIcon, KeyboardIcon, SpaceIcon, GaugeIcon } from "lucide-react";

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
  {
    slug: "spacebar-counter",
    name: "Spacebar Counter",
    tagline: "Count your spacebar presses — how many can you hit?",
    description:
      "Free spacebar counter — count how many times you press the spacebar, or take the timed spacebar speed test. Beat your high score, right in your browser.",
    keywords: [
      "spacebar counter",
      "spacebar clicker",
      "spacebar speed test",
      "space bar counter",
      "how many times can you press spacebar",
      "spacebar test",
    ],
    icon: SpaceIcon,
    intro:
      "Count how many times you can press the spacebar. Just start tapping space and the counter climbs — or pick a timed challenge to measure your spacebar speed in presses per second and beat your high score. Use your spacebar on a keyboard, or tap the pad on mobile. Everything runs in your browser.",
    steps: [
      "Choose 'Just count', or a timed challenge from 5 to 60 seconds.",
      "Click the pad to activate it, then press your spacebar as fast as you can (or tap the pad on mobile).",
      "Watch the counter climb — in timed mode you'll get your presses per second when time's up.",
    ],
    faqs: [
      {
        q: "How does the spacebar counter work?",
        a: "Every press of the spacebar adds one to the count. In a timed test the clock starts on your first press and stops automatically, then shows your total presses and your presses per second.",
      },
      {
        q: "What is a good spacebar speed?",
        a: "Most people manage around 5–8 spacebar presses per second in a short burst. You can go faster with techniques like alternating thumbs or drumming your fingers on the bar.",
      },
      {
        q: "Why would I count spacebar presses?",
        a: "It's a fun speed challenge and a quick way to warm up before gaming — and it's a simple way to confirm your spacebar registers every press without sticking or double-firing.",
      },
      {
        q: "Does it work on a phone?",
        a: "Yes. Phones don't have a spacebar, so just tap the pad instead — each tap counts the same as a spacebar press.",
      },
    ],
    related: ["cps-test", "typing-speed-test", "keyboard-tester"],
  },
  {
    slug: "typing-speed-test",
    name: "Typing Speed Test (WPM)",
    tagline: "Measure your typing speed in words per minute.",
    description:
      "Free typing speed test — measure your typing speed in words per minute (WPM) and accuracy. Take a 15, 30, or 60-second test and beat your best score.",
    keywords: [
      "typing test",
      "typing speed test",
      "wpm test",
      "words per minute test",
      "typing speed",
      "how fast can i type",
    ],
    icon: GaugeIcon,
    intro:
      "Find out how fast you type. Start typing the words shown and the timer begins — you'll get your speed in words per minute (WPM), your accuracy, and your raw speed. Choose a 15, 30, or 60-second test and try to beat your best. Everything runs in your browser, and nothing you type is saved or sent anywhere.",
    steps: [
      "Pick a test length (30 seconds is the classic).",
      "Click the box and start typing the words shown — the timer starts on your first keystroke.",
      "When time's up, read your WPM and accuracy, then try again to beat your best.",
    ],
    faqs: [
      {
        q: "What is a good typing speed?",
        a: "The average typing speed is around 40 WPM. 60–80 WPM is fast, and professional typists often exceed 100 WPM. Accuracy matters just as much as raw speed.",
      },
      {
        q: "How is WPM calculated?",
        a: "One 'word' is standardized as five characters. Your WPM is the number of correctly typed characters divided by five, divided by the time in minutes — so mistakes lower your score.",
      },
      {
        q: "What's the difference between WPM and raw WPM?",
        a: "Raw WPM counts everything you type; WPM (net) counts only the characters you typed correctly. The gap between the two is your accuracy.",
      },
      {
        q: "Is what I type recorded?",
        a: "No — the test runs entirely in your browser. The words are generated locally and nothing you type is stored or uploaded.",
      },
      {
        q: "How can I type faster?",
        a: "Use all ten fingers, keep your eyes on the words instead of the keys, and focus on accuracy first — speed follows once your fingers learn the key positions.",
      },
    ],
    related: ["cps-test", "spacebar-counter", "keyboard-tester"],
  },
];

export const gameSlugs: string[] = gameTools.map((t) => t.slug);
