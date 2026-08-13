// Standalone high-demand tools that slot into existing categories (scientific
// calculator, text-to-speech, due-date & mortgage calculators). Kept in their
// own module per the split-registry convention so registry.ts stays lean.
import { CalculatorIcon, Volume2Icon, BabyIcon, HomeIcon, NetworkIcon } from "lucide-react";

import type { DevTool } from "./registry";

export const extraTools: DevTool[] = [
  {
    slug: "scientific-calculator",
    name: "Scientific Calculator",
    tagline: "A full scientific calculator — trig, logs, powers, and roots.",
    description:
      "Free online scientific calculator — trigonometry, logarithms, powers, roots, factorials, π and e, with degrees or radians. Fast and works in your browser.",
    keywords: [
      "scientific calculator",
      "online calculator",
      "trigonometry calculator",
      "log calculator",
      "square root calculator",
      "calculator online",
    ],
    icon: CalculatorIcon,
    intro:
      "A full scientific calculator in your browser — sine, cosine and tangent (in degrees or radians), natural and base-10 logs, powers and roots, factorials, and the constants π and e. Type with your keyboard or tap the buttons; everything is calculated locally, nothing is sent anywhere.",
    steps: [
      "Build your expression with the buttons or your keyboard.",
      "Switch between DEG and RAD for trigonometry as needed.",
      "Press = (or Enter) to evaluate; use C to clear and ⌫ to delete.",
    ],
    faqs: [
      { q: "Does it do trigonometry in degrees or radians?", a: "Both — use the DEG/RAD toggle. It defaults to degrees, which most people expect, and switches to radians in one tap." },
      { q: "Can I use my keyboard?", a: "Yes. Type digits and operators directly, press Enter to evaluate, Backspace to delete, and Esc to clear." },
      { q: "Is my input sent to a server?", a: "No — the calculator runs entirely in your browser, so nothing you type leaves your device." },
    ],
    related: ["percentage-calculator", "unit-converter", "number-base-converter"],
  },
  {
    slug: "text-to-speech",
    name: "Text to Speech",
    tagline: "Type or paste text and hear it read aloud.",
    description:
      "Free text to speech online — type or paste text and hear it read aloud. Pick a voice, adjust speed and pitch. Private, runs in your browser, no sign-up.",
    keywords: [
      "text to speech",
      "tts",
      "text to speech online",
      "read text aloud",
      "text reader",
      "speech synthesis",
    ],
    icon: Volume2Icon,
    intro:
      "Turn any text into speech and listen to it out loud. Paste your text, choose from the voices installed on your device, and adjust the speed and pitch. It uses your browser's built-in speech engine, so it's completely free and private — nothing is uploaded.",
    steps: [
      "Type or paste your text.",
      "Pick a voice and set the speed and pitch.",
      "Press Play to hear it — pause, resume, or stop anytime.",
    ],
    faqs: [
      { q: "Is it really free?", a: "Yes — it uses your browser and operating system's built-in text-to-speech, so there's no cost and no sign-up." },
      { q: "Why are the voices different on my phone and laptop?", a: "The available voices come from your device and browser, so the list varies between Windows, macOS, Android, and iOS." },
      { q: "Can I download the audio as a file?", a: "Browser text-to-speech plays audio live rather than exporting a file. It's great for listening and proofreading; for downloadable audio you'd need a server-based service." },
      { q: "Is my text uploaded?", a: "No — the speech is generated on your own device, so your text never leaves your browser." },
    ],
    related: ["online-notepad", "word-counter", "ai-summarizer"],
  },
  {
    slug: "due-date-calculator",
    name: "Due Date Calculator",
    tagline: "Estimate your pregnancy due date and how far along you are.",
    description:
      "Free due date calculator — estimate your pregnancy due date from your last period, conception, or IVF transfer, plus how far along you are and your trimester.",
    keywords: [
      "due date calculator",
      "pregnancy calculator",
      "pregnancy due date",
      "how far along am i",
      "estimated due date",
      "gestational age calculator",
    ],
    icon: BabyIcon,
    intro:
      "Estimate your baby's due date and see how far along you are. Calculate from the first day of your last period (with an adjustable cycle length), your conception date, or an IVF transfer — and get your estimated due date, current gestational age in weeks and days, trimester, and conception date. Everything is worked out in your browser.",
    steps: [
      "Choose your method — last period, conception date, or IVF transfer.",
      "Enter the relevant date (and your cycle length if using last period).",
      "See your estimated due date, how far along you are, and your trimester.",
    ],
    faqs: [
      { q: "How is the due date calculated?", a: "The classic method (Naegele's rule) adds 280 days — 40 weeks — to the first day of your last menstrual period, adjusted for your cycle length. Conception and IVF methods count forward from those dates instead." },
      { q: "How accurate is it?", a: "It's a standard estimate; only about 1 in 20 babies arrive exactly on the due date. Your doctor may adjust the date after an ultrasound." },
      { q: "What if my cycle isn't 28 days?", a: "Enter your average cycle length and the calculation adjusts the due date accordingly, since ovulation timing shifts with cycle length." },
      { q: "Is my information private?", a: "Yes — everything is calculated locally in your browser and nothing is stored or uploaded." },
    ],
    related: ["age-calculator", "date-difference", "bmi-calculator"],
  },
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    tagline: "Estimate your monthly payment, taxes, insurance, and total cost.",
    description:
      "Free mortgage calculator — estimate your monthly payment with principal, interest, taxes, insurance, and HOA, plus total interest and a full amortization schedule.",
    keywords: [
      "mortgage calculator",
      "home loan calculator",
      "monthly mortgage payment",
      "amortization calculator",
      "mortgage payment calculator",
      "house payment calculator",
    ],
    icon: HomeIcon,
    intro:
      "Estimate your full monthly mortgage payment — not just principal and interest, but property tax, home insurance, and HOA too. Enter your home price, down payment, rate, and term to see your monthly payment, the total interest over the life of the loan, the total cost, and a year-by-year amortization schedule. It all runs in your browser.",
    steps: [
      "Enter the home price and your down payment.",
      "Add your interest rate and loan term, plus optional taxes, insurance, and HOA.",
      "See your monthly payment breakdown, total interest, and amortization schedule.",
    ],
    faqs: [
      { q: "What's included in the monthly payment?", a: "Principal and interest from the loan, plus optional monthly property tax, home insurance, and HOA fees — often called PITI (principal, interest, taxes, insurance)." },
      { q: "How is the principal and interest calculated?", a: "It uses the standard amortization formula based on the loan amount (price minus down payment), your monthly interest rate, and the number of monthly payments." },
      { q: "What is an amortization schedule?", a: "It shows how each year's payments split between interest and principal, and how your remaining balance falls over time — early payments are mostly interest, later ones mostly principal." },
      { q: "Does it store my numbers?", a: "No — the calculation runs entirely in your browser and nothing is uploaded." },
    ],
    related: ["loan-calculator", "compound-interest-calculator", "percentage-calculator"],
  },
  {
    slug: "what-is-my-ip",
    name: "What Is My IP Address",
    tagline: "See your public IP address and browser details instantly.",
    description:
      "See your public IP address instantly, plus your browser, operating system, screen size, and timezone. Private — we only show what your browser already sends.",
    keywords: [
      "what is my ip",
      "my ip address",
      "what's my ip",
      "ip address",
      "find my ip",
      "whats my ip",
    ],
    icon: NetworkIcon,
    intro:
      "See your public IP address at a glance, along with the details your browser reveals to every site you visit — your browser and version, operating system, screen and window size, timezone, and language. We only display what your device already sends with each request; nothing is logged or stored.",
    steps: [
      "Your public IP address is shown at the top — click to copy it.",
      "Below it you'll find your browser, OS, screen, timezone, and language.",
      "Use it to check your connection, troubleshoot, or set up remote access and port forwarding.",
    ],
    faqs: [
      { q: "What is an IP address?", a: "An IP address is a unique number that identifies your device on the internet, so websites and services know where to send data back to you." },
      { q: "Is this my public or private IP?", a: "It's your public IP — the address the internet sees, assigned by your ISP. Your private (local) IP inside your home network isn't visible to websites, so it isn't shown here." },
      { q: "Why does my IP differ from another site or check?", a: "If you use a VPN, proxy, or mobile data, your IP can change or differ between checks. This shows the address your current connection is using right now." },
      { q: "Do you store or log my IP address?", a: "No — we simply display the IP that your browser's request already includes, and we don't log or save it." },
    ],
    related: ["cidr-calculator", "wifi-qr", "qr-code"],
  },
];

export const extraSlugs: string[] = extraTools.map((t) => t.slug);
