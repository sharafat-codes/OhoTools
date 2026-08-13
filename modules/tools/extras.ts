// Standalone high-demand tools that slot into existing categories (scientific
// calculator, text-to-speech, due-date & mortgage calculators). Kept in their
// own module per the split-registry convention so registry.ts stays lean.
import {
  CalculatorIcon, Volume2Icon, BabyIcon, HomeIcon, NetworkIcon,
  CalendarClockIcon, GraduationCapIcon, FileTextIcon, BarcodeIcon, BanknoteIcon,
  CakeIcon,
} from "lucide-react";

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
  {
    slug: "countdown-to-date",
    name: "Countdown to Date",
    tagline: "Live countdown to any date — see the days, hours, and minutes left.",
    description:
      "Free countdown to any date — see the days, hours, minutes, and seconds until Christmas, New Year, a birthday, exam, or any event. Live and shareable.",
    keywords: [
      "countdown to date",
      "days until",
      "how many days until",
      "new year countdown",
      "countdown clock",
      "countdown to a date",
    ],
    icon: CalendarClockIcon,
    intro:
      "Count down to any moment — a birthday, holiday, exam, launch, or the New Year. Pick a date and time and watch the days, hours, minutes, and seconds tick down live. Give it a title and it becomes your own countdown clock. It runs entirely in your browser.",
    steps: [
      "Pick your target date and time, or tap a preset like New Year.",
      "Add a title for your event, if you like.",
      "Watch the live countdown — it updates every second.",
    ],
    faqs: [
      { q: "How is this different from a timer?", a: "A timer counts down a duration you set, like 10 minutes. This counts down to a specific date and time in the future, so it keeps counting across days and weeks." },
      { q: "Does it keep counting if I close the tab?", a: "Yes — the countdown is based on the real calendar date and time, so whenever you reopen it, it shows the correct time remaining." },
      { q: "Can I count down to New Year or Christmas?", a: "Yes — use the presets, or set any date such as a birthday, wedding, exam, or product launch." },
    ],
    related: ["countdown-timer", "date-difference", "age-calculator"],
  },
  {
    slug: "final-grade-calculator",
    name: "Final Grade Calculator",
    tagline: "Find the score you need on the final to hit your target grade.",
    description:
      "Free final grade calculator — find the score you need on your final exam to reach your target overall grade, based on your current grade and the exam's weight.",
    keywords: [
      "final grade calculator",
      "what do i need on my final",
      "final exam calculator",
      "grade calculator",
      "exam grade needed",
    ],
    icon: GraduationCapIcon,
    intro:
      "Work out exactly what you need to score on your final exam to reach the overall grade you want. Enter your current grade, your target grade, and how much the final is worth — it tells you the mark you need, and whether your goal is still within reach. Calculated instantly in your browser.",
    steps: [
      "Enter your current grade in the class (as a percentage).",
      "Enter the overall grade you're aiming for.",
      "Enter how much the final exam is worth, and see the score you need.",
    ],
    faqs: [
      { q: "How is the required final score calculated?", a: "It uses: needed = (target − current × (1 − weight)) ÷ weight, where weight is the final's share of your grade. That's the score on the final that makes your weighted average reach your target." },
      { q: "What if it says I need more than 100%?", a: "Then your target isn't reachable from the final alone — you'd need extra credit or a higher-weighted assessment. Try a slightly lower target." },
      { q: "What if the needed score is negative?", a: "That means you've already secured your target — even a zero on the final keeps you at or above your goal." },
    ],
    related: ["gpa-calculator", "percentage-calculator", "scientific-calculator"],
  },
  {
    slug: "markdown-editor",
    name: "Markdown Editor",
    tagline: "Write Markdown with a live preview — copy the HTML instantly.",
    description:
      "Free online Markdown editor with live preview. Write Markdown and see it rendered instantly, then copy the HTML or download it. Private — runs in your browser.",
    keywords: [
      "markdown editor",
      "online markdown editor",
      "markdown live preview",
      "markdown previewer",
      "markdown editor online",
    ],
    icon: FileTextIcon,
    intro:
      "Write Markdown on the left and see it rendered live on the right — great for README files, notes, and documentation. Copy the generated HTML, or download your work as a .md or .html file. Everything runs in your browser, so your text stays private.",
    steps: [
      "Type or paste Markdown into the editor.",
      "Watch the formatted preview update as you type.",
      "Copy the HTML, or download your Markdown or HTML file.",
    ],
    faqs: [
      { q: "Which Markdown features are supported?", a: "Standard and GitHub-flavored Markdown — headings, bold and italic, lists, links, images, code blocks, blockquotes, and tables." },
      { q: "Is my text uploaded?", a: "No — the Markdown is rendered locally in your browser and never sent to a server." },
      { q: "Can I get the HTML out?", a: "Yes — copy the rendered HTML with one click, or download it as an .html file (or save the raw Markdown as .md)." },
    ],
    related: ["markdown-to-html", "markdown-to-pdf", "html-to-markdown"],
  },
  {
    slug: "barcode-generator",
    name: "Barcode Generator",
    tagline: "Create Code 128, EAN, UPC and more — download PNG or SVG.",
    description:
      "Free barcode generator — create Code 128, EAN-13, UPC, Code 39, ITF-14, and 2D barcodes. Customize the size and download as PNG or SVG, right in your browser.",
    keywords: [
      "barcode generator",
      "create barcode",
      "code 128 generator",
      "ean-13 barcode",
      "upc barcode generator",
      "free barcode",
    ],
    icon: BarcodeIcon,
    intro:
      "Generate barcodes for products, inventory, and labels — Code 128, EAN-13, EAN-8, UPC-A/E, Code 39/93, ITF-14, Codabar, and 2D formats like Data Matrix and PDF417. Type your value, pick a format, adjust the size, and download a crisp PNG or a scalable SVG. It's all generated in your browser.",
    steps: [
      "Choose a barcode format — Code 128 works for most text and numbers.",
      "Enter the value to encode.",
      "Adjust the size, then download as PNG or SVG.",
    ],
    faqs: [
      { q: "Which barcode format should I use?", a: "Code 128 is the most versatile for general text and numbers. Use EAN-13 or UPC-A for retail products, ITF-14 for shipping cartons, and Data Matrix or PDF417 for 2D codes." },
      { q: "Why won't my value generate?", a: "Some formats require a specific length or character set — EAN-13 needs 12–13 digits and UPC-A needs 11–12 digits, for example. Check the format's requirements and try again." },
      { q: "Are the barcodes free to use?", a: "Yes — free for personal and commercial use. Note that selling retail products may require an officially registered number, such as a GS1 UPC." },
      { q: "Is my data uploaded?", a: "No — barcodes are generated entirely in your browser; nothing is sent anywhere." },
    ],
    related: ["qr-code", "wifi-qr", "bulk-qr-generator"],
  },
  {
    slug: "salary-calculator",
    name: "Salary to Hourly Calculator",
    tagline: "Convert pay between hourly, weekly, monthly, and yearly.",
    description:
      "Free salary calculator — convert pay between hourly, daily, weekly, monthly, and yearly. Set your hours per week to see every equivalent (gross, before tax).",
    keywords: [
      "salary calculator",
      "hourly to salary",
      "salary to hourly",
      "annual salary calculator",
      "hourly wage calculator",
      "pay calculator",
    ],
    icon: BanknoteIcon,
    intro:
      "Convert pay between hourly, daily, weekly, bi-weekly, monthly, and yearly in one place. Enter an amount in any period, set your hours per week and working weeks per year, and see every equivalent instantly. Note: these are gross figures, before tax — take-home pay depends on your country and deductions.",
    steps: [
      "Enter an amount and choose its period, such as hourly or yearly.",
      "Set your hours per week and weeks worked per year.",
      "See your pay converted to every other period.",
    ],
    faqs: [
      { q: "Does this show my take-home (after-tax) pay?", a: "No — it shows gross pay before tax. Income tax, social security, and other deductions vary widely by country and situation, so we don't estimate net pay." },
      { q: "How is annual salary from an hourly wage calculated?", a: "Annual = hourly × hours per week × weeks worked per year. With the common 40 hours and 52 weeks, that's your hourly rate × 2,080." },
      { q: "Can I change the hours per week?", a: "Yes — set any hours per week and weeks per year (for example, to account for unpaid leave) and every figure updates." },
    ],
    related: ["loan-calculator", "percentage-calculator", "gst-vat-calculator"],
  },
  {
    slug: "birthday-card-maker",
    name: "Birthday Card Maker",
    tagline: "Create an animated birthday card and share the link — free.",
    description:
      "Free animated birthday card maker — personalize a name, message, and theme, then share a link that opens as a full-screen animated card. No sign-up.",
    keywords: [
      "birthday card maker",
      "birthday card",
      "animated birthday card",
      "online birthday card",
      "free birthday card",
      "birthday ecard",
    ],
    icon: CakeIcon,
    intro:
      "Create a beautiful animated birthday card in seconds. Add a name, a personal message, and pick a theme — then share the link on WhatsApp or anywhere. It opens as a full-screen animated card with confetti and floating balloons. Free, works on any device, and no sign-up needed.",
    steps: [
      "Type the birthday person's name and your message.",
      "Pick a color theme and watch the live preview.",
      "Copy the share link and send it — it plays a full-screen animated card.",
    ],
    faqs: [
      { q: "Is the birthday card free?", a: "Yes — completely free, with no sign-up. Personalize it and share the link as many times as you like." },
      { q: "How do I share the card?", a: "Copy the link and send it on WhatsApp, SMS, email, or social media. Anyone who opens it sees the full animated card — no app or account needed." },
      { q: "Is my card stored on your servers?", a: "No — the card is encoded entirely in the link itself, so nothing is saved or tracked on our side." },
      { q: "Can I add a photo?", a: "Photos are coming soon. For now cards are text-based with animated themes, which keeps the shareable link lightweight and instant." },
    ],
    related: ["countdown-to-date", "qr-code", "meme-generator"],
  },
];

export const extraSlugs: string[] = extraTools.map((t) => t.slug);
