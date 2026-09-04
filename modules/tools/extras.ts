// Standalone high-demand tools that slot into existing categories (scientific
// calculator, text-to-speech, due-date & mortgage calculators). Kept in their
// own module per the split-registry convention so registry.ts stays lean.
import {
  CalculatorIcon, Volume2Icon, BabyIcon, HomeIcon, NetworkIcon,
  CalendarClockIcon, GraduationCapIcon, FileTextIcon, BarcodeIcon, BanknoteIcon,
  CakeIcon, GemIcon, HeartIcon, WineIcon, MoonStarIcon, SparklesIcon, FileCheck2Icon,
  ServerIcon, DatabaseIcon, FingerprintIcon, TableIcon, GitBranchIcon, BracesIcon, LinkIcon,
  MicIcon, CaptionsIcon, PenToolIcon, SigmaIcon, ReceiptIcon, VideoIcon, SpellCheckIcon,
  SheetIcon, NewspaperIcon, Share2Icon, BookOpenIcon,
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
  {
    slug: "wedding-invitation-maker",
    name: "Wedding Invitation Maker",
    tagline: "Create an animated wedding invitation and share the link — free.",
    description:
      "Free animated wedding invitation maker — add the couple's names, message, photo and theme, then share a link that opens as a full-screen animated invitation. No sign-up.",
    keywords: [
      "wedding invitation maker",
      "wedding invitation",
      "digital wedding invitation",
      "online wedding invitation",
      "wedding e-invite",
      "shaadi card",
    ],
    icon: GemIcon,
    intro:
      "Create a beautiful animated wedding invitation in minutes. Add the couple's names, your message, a photo, and choose an elegant theme — then share the link on WhatsApp or anywhere. It opens as a full-screen animated invitation with music and effects. Free, works on any device, and no sign-up needed.",
    steps: [
      "Enter the couple's names and your invitation message.",
      "Pick an elegant template, theme, and effect — add a photo and music if you like.",
      "Copy the share link and send it — it opens as a full-screen animated invitation.",
    ],
    faqs: [
      { q: "Is the wedding invitation free?", a: "Yes — completely free, with no sign-up. Personalize it and share the link as many times as you like." },
      { q: "How do guests open it?", a: "They just tap the link — it opens as a full-screen animated invitation on any phone or computer. No app or account needed." },
      { q: "Can I add our photo and music?", a: "Yes — add a photo and turn on music, and the invitation plays them when a guest opens it." },
      { q: "Is our information stored?", a: "No — the invitation is encoded in the link itself, so nothing is saved on our servers." },
    ],
    related: ["engagement-invitation-maker", "anniversary-card-maker", "birthday-card-maker"],
  },
  {
    slug: "engagement-invitation-maker",
    name: "Engagement Invitation Maker",
    tagline: "Create an animated engagement invitation and share the link — free.",
    description:
      "Free animated engagement invitation maker — add names, message, photo and theme, then share a link that plays a full-screen animated invitation. No sign-up.",
    keywords: [
      "engagement invitation maker",
      "engagement invitation",
      "engagement announcement card",
      "online engagement invite",
      "engagement e-invite",
    ],
    icon: HeartIcon,
    intro:
      "Announce your engagement in style with an animated invitation. Add your names, your message, a photo, and pick a romantic theme — then share the link on WhatsApp or social media. It opens as a full-screen animated invitation with music and effects. Free and instant, no sign-up.",
    steps: [
      "Enter your names and your engagement message.",
      "Choose a template, theme, and effect — add a photo and music if you like.",
      "Copy the share link and send it — it opens as a full-screen animated invitation.",
    ],
    faqs: [
      { q: "Is it free?", a: "Yes — completely free with no sign-up. Personalize it and share the link freely." },
      { q: "How do people open it?", a: "They tap the link and it plays as a full-screen animated invitation on any device — no app needed." },
      { q: "Can I add a photo and music?", a: "Yes — add a couple photo and turn on music; both play when the invitation is opened." },
      { q: "Is my data stored?", a: "No — the invitation lives in the link itself; nothing is saved on our servers." },
    ],
    related: ["wedding-invitation-maker", "anniversary-card-maker", "birthday-card-maker"],
  },
  {
    slug: "anniversary-card-maker",
    name: "Anniversary Card Maker",
    tagline: "Create an animated anniversary card and share the link — free.",
    description:
      "Free animated anniversary card maker — personalize names, message, photo and theme, then share a link that opens as a full-screen animated card. No sign-up.",
    keywords: [
      "anniversary card maker",
      "anniversary card",
      "happy anniversary card",
      "wedding anniversary card",
      "online anniversary card",
    ],
    icon: WineIcon,
    intro:
      "Celebrate an anniversary with a heartfelt animated card. Add the names, your message, a photo, and choose a theme — then share the link on WhatsApp or anywhere. It opens as a full-screen animated card with music and effects. Free, works on any device, no sign-up.",
    steps: [
      "Enter the names and your anniversary message.",
      "Pick a template, theme, and effect — add a photo and music if you like.",
      "Copy the share link and send it — it opens as a full-screen animated card.",
    ],
    faqs: [
      { q: "Is the anniversary card free?", a: "Yes — completely free with no sign-up. Personalize and share the link as often as you like." },
      { q: "How is it opened?", a: "The recipient taps the link and it plays as a full-screen animated card on any phone or computer." },
      { q: "Can I add a photo and music?", a: "Yes — add a photo and enable music; both play when the card is opened." },
      { q: "Is anything stored?", a: "No — the card is encoded in the link, so nothing is saved on our servers." },
    ],
    related: ["wedding-invitation-maker", "engagement-invitation-maker", "birthday-card-maker"],
  },
  {
    slug: "eid-card-maker",
    name: "Eid Card Maker",
    tagline: "Create an animated Eid Mubarak card and share the link — free.",
    description:
      "Free animated Eid card maker — personalize a name, message, photo and theme, then share a link that opens as a full-screen Eid Mubarak card with a crescent moon and lanterns. No sign-up.",
    keywords: [
      "eid card maker",
      "eid mubarak card",
      "eid card",
      "happy eid card",
      "eid mubarak greeting card",
      "eid ecard",
    ],
    icon: MoonStarIcon,
    intro:
      "Send a beautiful animated Eid card in seconds. Add a name, an Eid Mubarak message, a photo, and pick a festive theme — then share the link on WhatsApp or anywhere. It opens as a full-screen animated card with a glowing crescent moon, twinkling stars, and hanging lanterns. Free, works on any device, and no sign-up needed.",
    steps: [
      "Type the recipient's name and your Eid Mubarak message.",
      "Pick the Festival template and a theme — add a photo and music if you like.",
      "Copy the share link and send it — it opens as a full-screen animated Eid card.",
    ],
    faqs: [
      { q: "Is the Eid card free?", a: "Yes — completely free with no sign-up. Personalize it and share the link as many times as you like." },
      { q: "How do I send it?", a: "Copy the link and send it on WhatsApp, SMS, or social media. Anyone who opens it sees the full animated Eid card — no app or account needed." },
      { q: "Does it work for both Eid al-Fitr and Eid al-Adha?", a: "Yes — the wording is a general 'Eid Mubarak' that suits both. Edit the message to mention the specific Eid if you like." },
      { q: "Can I add a photo and music?", a: "Yes — add a photo and turn on music, and they play when the card is opened." },
    ],
    related: ["diwali-card-maker", "birthday-card-maker", "anniversary-card-maker"],
  },
  {
    slug: "diwali-card-maker",
    name: "Diwali Card Maker",
    tagline: "Create an animated Happy Diwali card and share the link — free.",
    description:
      "Free animated Diwali card maker — personalize a name, message, photo and theme, then share a link that opens as a full-screen Happy Diwali card with glowing diyas. No sign-up.",
    keywords: [
      "diwali card maker",
      "happy diwali card",
      "diwali card",
      "diwali greeting card",
      "diwali wishes card",
      "diwali ecard",
    ],
    icon: SparklesIcon,
    intro:
      "Send a bright animated Diwali card in seconds. Add a name, a Happy Diwali message, a photo, and pick a festive theme — then share the link on WhatsApp or anywhere. It opens as a full-screen animated card with glowing diyas, sparkles, and hanging lanterns. Free, works on any device, and no sign-up needed.",
    steps: [
      "Type the recipient's name and your Diwali message.",
      "Pick the Festival template and a theme — add a photo and music if you like.",
      "Copy the share link and send it — it opens as a full-screen animated Diwali card.",
    ],
    faqs: [
      { q: "Is the Diwali card free?", a: "Yes — completely free with no sign-up. Personalize it and share the link as many times as you like." },
      { q: "How do I send it?", a: "Copy the link and send it on WhatsApp, SMS, or social media. Anyone who opens it sees the full animated Diwali card — no app or account needed." },
      { q: "Can I add our photo and music?", a: "Yes — add a photo and turn on music, and they play when the card is opened." },
      { q: "Is my information stored?", a: "No — the card is encoded in the link itself, so nothing is saved on our servers." },
    ],
    related: ["eid-card-maker", "birthday-card-maker", "anniversary-card-maker"],
  },
  {
    slug: "ats-resume-checker",
    name: "ATS Resume Checker",
    tagline: "Check if your resume will pass ATS parsing — free.",
    description:
      "Free ATS resume checker. Upload your resume (PDF or Word) for an instant ATS-friendliness score with exact fixes — selectable text, columns, images, tables, sections, and contact info. Runs in your browser, nothing uploaded.",
    keywords: [
      "ats resume checker",
      "ats checker",
      "ats friendly resume checker",
      "resume format checker",
      "is my resume ats friendly",
      "ats scanner",
      "resume ats score",
    ],
    icon: FileCheck2Icon,
    intro:
      "Will an applicant tracking system (ATS) actually read your resume? Upload your PDF or Word file for an instant, deterministic check — is the text selectable, is the layout single-column, are there images or tables that break parsing, and are your contact details and sections detectable? You get a score plus the exact fixes to make. Everything runs in your browser; your resume is never uploaded.",
    steps: [
      "Upload your resume (PDF or Word .docx).",
      "We analyze the file for ATS parsing issues in your browser.",
      "Get an ATS score and the exact fixes to make.",
    ],
    faqs: [
      { q: "What is an ATS?", a: "An Applicant Tracking System is software employers use to scan and filter resumes before a human sees them. If it can't parse your resume, you can be rejected automatically." },
      { q: "Is my resume uploaded anywhere?", a: "No — the file is read and analyzed entirely in your browser. Nothing is sent to our servers." },
      { q: "Does this match keywords for a specific job?", a: "This tool checks whether an ATS can parse your resume's format. For keyword matching against a job description, use our AI Resume Reviewer." },
      { q: "Which files can I check?", a: "PDF and Word (.docx) resumes, plus plain text. Image files (JPG/PNG) always fail because an ATS can't read text from an image." },
    ],
    related: ["resume-summary-generator"],
  },
  {
    slug: "http-status-codes",
    name: "HTTP Status Codes",
    tagline: "Look up any HTTP status code and what it means.",
    description:
      "Free HTTP status code reference — search every code (200, 301, 404, 500…) by number, name, or meaning, grouped by class. Fast, no sign-up.",
    keywords: ["http status codes", "404 meaning", "301 vs 302", "500 error", "http response codes", "status code list"],
    icon: ServerIcon,
    intro:
      "A fast, searchable reference for HTTP status codes. Search by number, name, or meaning — or filter by class (1xx–5xx) — to quickly understand what a response code means, from 200 OK to 404 Not Found and 500 Internal Server Error.",
    steps: [
      "Search a code, name, or keyword (e.g. 404, redirect, timeout).",
      "Filter by class — 1xx, 2xx, 3xx, 4xx, or 5xx.",
      "Read the plain-English meaning of each code.",
    ],
    faqs: [
      { q: "What's the difference between 301 and 302?", a: "301 is a permanent redirect (update your links; it passes SEO value), while 302 is temporary (keep using the original URL)." },
      { q: "What does 404 mean?", a: "404 Not Found means the server couldn't find the requested resource — the URL may be wrong or the page removed." },
      { q: "What is a 500 error?", a: "500 Internal Server Error is a generic server-side failure — something went wrong on the server with no more specific message." },
      { q: "What are the HTTP status code classes?", a: "1xx informational, 2xx success, 3xx redirection, 4xx client errors, and 5xx server errors." },
    ],
    related: ["what-is-my-ip", "jwt-decoder", "json-formatter"],
  },
  {
    slug: "mock-data-generator",
    name: "Mock Data Generator",
    tagline: "Generate fake test data as JSON or CSV.",
    description:
      "Free mock data generator — create realistic fake names, emails, addresses, and more as JSON or CSV for testing and prototyping. Runs in your browser.",
    keywords: ["mock data generator", "fake data generator", "test data generator", "dummy data", "json test data", "csv test data"],
    icon: DatabaseIcon,
    intro:
      "Generate realistic fake data for testing, prototyping, and demos. Pick the fields you need — names, emails, phone numbers, addresses, dates, and more — choose how many rows, and export as JSON or CSV. Everything is generated in your browser.",
    steps: [
      "Pick the fields you want in each record.",
      "Set the number of rows and choose JSON or CSV.",
      "Generate, then copy or download the data.",
    ],
    faqs: [
      { q: "Is the data real?", a: "No — it's randomly generated fake data for testing. Any resemblance to real people is coincidental." },
      { q: "Can I export to CSV?", a: "Yes — switch the format to CSV for a spreadsheet-ready file, or use JSON for APIs and code." },
      { q: "Is anything uploaded?", a: "No — data is generated entirely in your browser and never sent to a server." },
      { q: "How many rows can I generate?", a: "Up to 200 rows at a time — generate again for more." },
    ],
    related: ["json-formatter", "json-to-csv", "uuid-generator"],
  },
  {
    slug: "user-agent-parser",
    name: "User Agent Parser",
    tagline: "See and decode any browser user-agent string.",
    description:
      "Free user-agent parser — see your own user agent and decode any UA string into browser, OS, device, and rendering engine. Runs in your browser.",
    keywords: ["user agent parser", "what is my user agent", "parse user agent", "user agent string", "my browser user agent", "ua parser"],
    icon: FingerprintIcon,
    intro:
      "See your own browser's user-agent string and decode any user agent into its parts — browser and version, operating system, rendering engine, and device type. Paste any UA string to parse it. Everything runs in your browser.",
    steps: [
      "Your user agent is shown and parsed automatically.",
      "Or paste any user-agent string to decode it.",
      "Read the browser, OS, engine, and device type.",
    ],
    faqs: [
      { q: "What is a user agent?", a: "A user-agent string is text your browser sends with every request, identifying the browser, version, operating system, and device." },
      { q: "What is my user agent?", a: "It's shown at the top of this tool — your browser's exact user-agent string, parsed into browser, OS, engine, and device." },
      { q: "Can user agents be faked?", a: "Yes — user-agent strings can be spoofed or changed, so treat parsed results as a best-effort guess." },
      { q: "Is my data sent anywhere?", a: "No — parsing happens entirely in your browser; nothing is uploaded." },
    ],
    related: ["what-is-my-ip", "http-status-codes"],
  },
  {
    slug: "ascii-table",
    name: "ASCII Table",
    tagline: "Full ASCII table — decimal, hex, binary, and characters.",
    description:
      "Free ASCII table — look up every character's decimal, hex, octal, and binary code, plus control-character names. Searchable, no sign-up.",
    keywords: ["ascii table", "ascii code", "ascii chart", "character codes", "ascii value", "ascii to text"],
    icon: TableIcon,
    intro:
      "A complete, searchable ASCII table. Look up any character's decimal, hexadecimal, octal, and binary value — including the names of control characters like tab, newline, and escape. Search by number, hex, character, or name.",
    steps: [
      "Search a decimal, hex, character, or name (e.g. 65, 41, A, tab).",
      "Read the character's decimal, hex, octal, and binary codes.",
      "Use it to debug encoding, escape sequences, or low-level data.",
    ],
    faqs: [
      { q: "What is the ASCII value of 'A'?", a: "Uppercase A is decimal 65 (hex 0x41). Lowercase a is 97 (0x61)." },
      { q: "What are control characters?", a: "Codes 0–31 and 127 are non-printing control characters — like tab (9), line feed (10), and carriage return (13) — used to control text flow, not display glyphs." },
      { q: "What's the difference between ASCII and Unicode?", a: "ASCII covers 128 characters (0–127). Unicode is a superset that covers virtually every character in every language; the first 128 Unicode code points match ASCII." },
    ],
    related: ["number-base-converter", "text-to-binary", "html-entities"],
  },
  {
    slug: "gitignore-generator",
    name: ".gitignore Generator",
    tagline: "Build a .gitignore for your languages and tools.",
    description:
      "Free .gitignore generator — pick your languages, frameworks, and editors (Node, Python, Next.js, macOS…) and get a ready-to-use .gitignore to copy or download.",
    keywords: ["gitignore generator", ".gitignore", "gitignore template", "gitignore file", "create gitignore"],
    icon: GitBranchIcon,
    intro:
      "Generate a clean .gitignore in seconds. Select the languages, frameworks, operating systems, and editors your project uses, and get a combined .gitignore ready to copy or download into your repo.",
    steps: [
      "Select your languages, frameworks, and tools.",
      "The .gitignore builds automatically as you pick.",
      "Copy it or download the file into your project root.",
    ],
    faqs: [
      { q: "What is a .gitignore file?", a: "It tells Git which files and folders to ignore — like node_modules, build output, and secrets — so they're never committed to your repository." },
      { q: "Where do I put the .gitignore?", a: "In the root of your Git repository. You can also add nested .gitignore files in subfolders." },
      { q: "Can I combine multiple templates?", a: "Yes — pick several (e.g. Node + Next.js + macOS) and they're merged into one file." },
    ],
    related: ["code-beautifier", "commit-message-generator", "json-formatter"],
  },
  {
    slug: "csv-to-json",
    name: "CSV to JSON",
    tagline: "Convert CSV to JSON in your browser.",
    description:
      "Free CSV to JSON converter — paste CSV and get clean JSON (array of objects, using the header row as keys). Handles quoted fields. Runs in your browser.",
    keywords: ["csv to json", "convert csv to json", "csv to json converter", "csv parser", "csv to array"],
    icon: BracesIcon,
    intro:
      "Convert CSV data into JSON instantly. Paste your CSV — with or without a header row — and get a clean JSON array of objects, ready to use in code or an API. Quoted fields and commas inside quotes are handled correctly. Everything runs in your browser.",
    steps: [
      "Paste your CSV data.",
      "Choose whether the first row is headers.",
      "Copy the JSON output.",
    ],
    faqs: [
      { q: "Does it handle quoted fields and commas?", a: "Yes — fields wrapped in quotes, escaped quotes, and commas or newlines inside quotes are parsed correctly." },
      { q: "Is my data uploaded?", a: "No — the conversion happens entirely in your browser; nothing is sent to a server." },
      { q: "What if my CSV has no header row?", a: "Turn off 'First row is headers' and you'll get a JSON array of arrays instead of objects." },
    ],
    related: ["json-to-csv", "json-formatter", "csv-to-xlsx"],
  },
  {
    slug: "url-parser",
    name: "URL Parser",
    tagline: "Break a URL into its parts and query params.",
    description:
      "Free URL parser — paste a URL to break it into protocol, host, port, path, query parameters, and hash. Runs entirely in your browser.",
    keywords: ["url parser", "parse url", "url components", "query string parser", "url breakdown", "url query parameters"],
    icon: LinkIcon,
    intro:
      "Paste any URL to see its parts laid out — protocol, host, port, path, query string, and hash — plus a table of every query parameter. Handy for debugging links, redirects, and API requests. Everything runs in your browser.",
    steps: [
      "Paste a URL.",
      "See it broken into protocol, host, path, query, and hash.",
      "Read each query parameter in the table below.",
    ],
    faqs: [
      { q: "What are query parameters?", a: "They're the key=value pairs after the ? in a URL (e.g. ?q=hello&lang=en), used to pass data to a page or API." },
      { q: "Does the URL need a protocol?", a: "Yes — include https:// (or another protocol) so the URL can be parsed. Bare domains like example.com won't parse on their own." },
      { q: "Is anything sent to a server?", a: "No — parsing happens entirely in your browser." },
    ],
    related: ["url-encoder", "utm-builder", "what-is-my-ip"],
  },
  {
    slug: "voice-recorder",
    name: "Voice Recorder",
    tagline: "Record audio from your mic and download it — free.",
    description:
      "Free online voice recorder — record audio from your microphone right in your browser, play it back, and download it. No sign-up, nothing uploaded.",
    keywords: ["voice recorder", "online voice recorder", "audio recorder", "record voice online", "mic recorder", "record audio"],
    icon: MicIcon,
    intro:
      "Record your voice or any audio straight from your browser. Hit record, speak, and stop — then play it back and download the file. It all happens on your device; nothing is uploaded to a server.",
    steps: [
      "Click Start recording and allow microphone access.",
      "Record your audio, then click Stop.",
      "Play it back and download the file.",
    ],
    faqs: [
      { q: "Is the recording uploaded anywhere?", a: "No — recording happens entirely in your browser and the audio never leaves your device." },
      { q: "What format is the download?", a: "A WebM/Opus audio file, which plays in modern browsers and most players. You can convert it with our audio converter if needed." },
      { q: "Why won't it record?", a: "You need to allow microphone permission in your browser, and the site must be on HTTPS (it is)." },
    ],
    related: ["speech-to-text", "audio-converter", "enhance-audio"],
  },
  {
    slug: "speech-to-text",
    name: "Speech to Text",
    tagline: "Transcribe your voice to text as you speak — free.",
    description:
      "Free speech to text — transcribe your voice into text live using your browser's speech recognition, in multiple languages. No sign-up, nothing uploaded to us.",
    keywords: ["speech to text", "voice to text", "voice typing", "dictation online", "transcribe voice", "speech recognition"],
    icon: CaptionsIcon,
    intro:
      "Turn your speech into text instantly. Pick a language, start speaking, and watch your words appear — then copy or edit the transcript. It uses your browser's built-in speech recognition, so audio is handled on your device.",
    steps: [
      "Choose your language and click Start.",
      "Allow microphone access and start speaking.",
      "Copy or edit the transcribed text.",
    ],
    faqs: [
      { q: "Which browsers are supported?", a: "Speech recognition works best in Chrome and Edge (desktop and Android). Firefox and Safari have limited or no support." },
      { q: "Is my voice sent to your servers?", a: "No — transcription is handled by your browser/operating system, not by us." },
      { q: "What languages are supported?", a: "Several, including English, Urdu, Hindi, Arabic, Spanish, and French — pick one before you start." },
    ],
    related: ["voice-recorder", "text-to-speech", "word-counter"],
  },
  {
    slug: "signature-generator",
    name: "Signature Generator",
    tagline: "Draw your signature and download it as a PNG.",
    description:
      "Free online signature generator — draw your signature with a mouse or finger and download it as a transparent PNG for documents and emails. Nothing uploaded.",
    keywords: ["signature generator", "online signature", "draw signature", "signature maker", "create signature", "digital signature image"],
    icon: PenToolIcon,
    intro:
      "Create a handwritten signature in seconds. Draw with your mouse, trackpad, or finger, pick a pen color and size, and download a transparent PNG you can drop into documents, PDFs, or emails. It all happens in your browser.",
    steps: [
      "Draw your signature in the box.",
      "Adjust the pen color and size if you like.",
      "Download it as a transparent PNG.",
    ],
    faqs: [
      { q: "Is the signature transparent?", a: "Yes — it downloads as a PNG with a transparent background, so it sits cleanly on documents." },
      { q: "Is anything uploaded?", a: "No — your signature is drawn and exported entirely in your browser." },
      { q: "Can I use it to sign a PDF?", a: "Yes — download the PNG, then add it with our sign-PDF tool or any PDF editor." },
    ],
    related: ["sign-pdf", "crop-image", "add-text-to-image"],
  },
  {
    slug: "sales-tax-calculator",
    name: "Sales Tax Calculator",
    tagline: "Add or remove sales tax from any price.",
    description:
      "Free sales tax calculator — add sales tax to a price to get the total, or remove tax from a total to find the pre-tax price. Enter any tax rate. Runs in your browser.",
    keywords: [
      "sales tax calculator",
      "tax calculator",
      "add sales tax",
      "reverse sales tax calculator",
      "calculate sales tax",
      "price plus tax",
    ],
    icon: ReceiptIcon,
    intro:
      "Work out sales tax both ways. Enter a tax rate, then either add tax to a pre-tax price to see the tax and total, or remove tax from a tax-inclusive total to find the original price. Great for receipts, invoices, and quick checks — it all runs in your browser.",
    steps: [
      "Enter your sales tax rate as a percentage.",
      "Choose Add tax (from a pre-tax price) or Remove tax (from a total).",
      "Enter the amount and read the tax and result instantly.",
    ],
    faqs: [
      { q: "How do I add sales tax to a price?", a: "Multiply the price by the tax rate (as a decimal) to get the tax, then add it to the price. This tool does it for you — enter the price and rate under Add tax." },
      { q: "How do I remove sales tax from a total?", a: "Divide the tax-inclusive total by 1 plus the rate as a decimal (e.g. total ÷ 1.0825 for 8.25%). Use the Remove tax tab and it's calculated automatically." },
      { q: "Which tax rate should I use?", a: "Use your local combined rate (state plus any city or county tax). Rates vary by location, so check your area's current sales tax rate." },
      { q: "Is anything uploaded?", a: "No — the calculation runs entirely in your browser; nothing is sent anywhere." },
    ],
    related: ["discount-calculator", "percentage-calculator", "gst-vat-calculator"],
  },
  {
    slug: "average-calculator",
    name: "Average Calculator",
    tagline: "Find the mean, median, mode, and range of any numbers.",
    description:
      "Free average calculator — paste a list of numbers to get the mean (average), median, mode, range, sum, count, min, and max instantly. Runs in your browser.",
    keywords: [
      "average calculator",
      "mean median mode calculator",
      "mean calculator",
      "median calculator",
      "how to calculate average",
      "average of numbers",
    ],
    icon: SigmaIcon,
    intro:
      "Get every common average and summary statistic for a set of numbers at once. Paste or type your values — separated by commas, spaces, or new lines — and see the mean, median, mode, range, sum, count, minimum, and maximum. It all runs in your browser, so your data stays private.",
    steps: [
      "Enter your numbers, separated by commas, spaces, or new lines.",
      "The mean, median, mode, and range update instantly.",
      "Read the full breakdown, including sum, count, min, and max.",
    ],
    faqs: [
      { q: "What's the difference between mean, median, and mode?", a: "The mean is the sum divided by how many numbers there are (the everyday 'average'). The median is the middle value when sorted. The mode is the value that appears most often." },
      { q: "What if there's no repeating number?", a: "Then there's no mode — the tool shows 'None' when every value appears only once." },
      { q: "Can it be more than one mode?", a: "Yes — if several values tie for the most occurrences, all of them are shown." },
      { q: "Is my data uploaded?", a: "No — everything is calculated locally in your browser and nothing is sent to a server." },
    ],
    related: ["percentage-calculator", "gpa-calculator", "scientific-calculator"],
  },
  {
    slug: "webcam-test",
    name: "Webcam Test",
    tagline: "Check your camera works — right in your browser.",
    description:
      "Free online webcam test — instantly check that your camera works, see the live preview, and view its resolution. Private: your video never leaves your device.",
    keywords: [
      "webcam test",
      "camera test",
      "test my webcam",
      "check webcam",
      "online webcam test",
      "is my camera working",
    ],
    icon: VideoIcon,
    intro:
      "Quickly check that your webcam is working before a video call, interview, or recording. Click start, allow camera access, and you'll see a live preview plus your camera's name and resolution. Everything runs in your browser — your video is shown locally and never uploaded.",
    steps: [
      "Click Start camera and allow camera access when prompted.",
      "Check the live preview — you should see yourself.",
      "Review the detected camera name and resolution.",
    ],
    faqs: [
      { q: "Is my video recorded or uploaded?", a: "No — the preview runs entirely in your browser and nothing is recorded or sent to a server." },
      { q: "Why can't it see my camera?", a: "Make sure you allowed camera permission, that no other app (Zoom, Teams, etc.) is using the camera, and that you're on a secure (https) connection." },
      { q: "Can I test a specific camera?", a: "It uses your default camera. Switch your system's default camera, then reload and start again to test another one." },
    ],
    related: ["mic-test", "screen-recorder", "voice-recorder"],
  },
  {
    slug: "mic-test",
    name: "Mic Test",
    tagline: "Test your microphone with a live input meter.",
    description:
      "Free online mic test — check your microphone works with a live input-level meter. Speak and watch the bar move. Private: your audio never leaves your device.",
    keywords: [
      "mic test",
      "microphone test",
      "test my mic",
      "check microphone",
      "online mic test",
      "is my microphone working",
    ],
    icon: MicIcon,
    intro:
      "Check that your microphone works before a call, interview, or recording. Click start, allow mic access, and speak — the live level meter moves with your voice. If the bar stays flat, your mic isn't picking up sound. It all runs in your browser; your audio is never uploaded.",
    steps: [
      "Click Start microphone and allow mic access when prompted.",
      "Speak normally and watch the input-level meter.",
      "If the bar moves, your mic is working; if it's flat, check your device.",
    ],
    faqs: [
      { q: "Is my audio recorded or uploaded?", a: "No — the meter runs entirely in your browser and your audio is never recorded or sent anywhere." },
      { q: "The bar isn't moving — what's wrong?", a: "Check that you allowed mic permission, selected the right input in your system settings, and that no other app is using the microphone." },
      { q: "Which browsers are supported?", a: "All modern browsers (Chrome, Edge, Firefox, Safari) on a secure https connection support the microphone test." },
    ],
    related: ["webcam-test", "voice-recorder", "speech-to-text"],
  },
  {
    slug: "number-to-words",
    name: "Number to Words",
    tagline: "Convert numbers into words — and amounts into currency text.",
    description:
      "Free number to words converter — turn any number into written words, or an amount into currency words (dollars and cents) for cheques and invoices. Runs in your browser.",
    keywords: [
      "number to words",
      "number to words converter",
      "amount in words",
      "spell number",
      "numbers to text",
      "figures to words",
    ],
    icon: SpellCheckIcon,
    intro:
      "Convert any number into written words, or an amount into currency text like you'd write on a cheque. Type a number and get the words instantly — plus a dollars-and-cents version for invoices and legal documents. Everything runs in your browser.",
    steps: [
      "Type or paste a number (decimals and commas are fine).",
      "Choose Words or Currency (USD).",
      "Copy the written form with one click.",
    ],
    faqs: [
      { q: "How big a number can it convert?", a: "Up to the hundreds of trillions, including decimals. Very large numbers are capped for readability." },
      { q: "Can it write amounts for cheques?", a: "Yes — the Currency tab writes amounts as dollars and cents (e.g. 'One thousand two hundred thirty-four dollars and fifty-six cents')." },
      { q: "Is my input sent anywhere?", a: "No — the conversion happens entirely in your browser; nothing is uploaded." },
    ],
    related: ["percentage-calculator", "roman-numeral", "number-base-converter"],
  },
  {
    slug: "love-calculator",
    name: "Love Calculator",
    tagline: "Enter two names for a fun love-match score.",
    description:
      "Free love calculator — enter two names for a playful love-compatibility percentage and message. Just for fun, and it works entirely in your browser.",
    keywords: [
      "love calculator",
      "love test",
      "love compatibility",
      "name compatibility",
      "love percentage calculator",
      "crush calculator",
    ],
    icon: HeartIcon,
    intro:
      "A fun love calculator: enter two names and get a playful compatibility percentage with a little message. The result is the same every time for the same pair of names, so you can share it — but it's purely for fun, not a real prediction. It runs entirely in your browser.",
    steps: [
      "Enter your name and their name.",
      "Tap Calculate love.",
      "See your match percentage and message — then share it!",
    ],
    faqs: [
      { q: "Is the love calculator accurate?", a: "No — it's just for fun. The score is a playful calculation based on the letters in the two names, not a real measure of compatibility." },
      { q: "Why do I get the same result each time?", a: "The score is deterministic, so the same two names always give the same percentage — that's what makes it shareable." },
      { q: "Do you store the names I enter?", a: "No — everything runs in your browser and nothing is saved or uploaded." },
    ],
    related: ["spin-the-wheel", "coin-flip", "random-number-generator"],
  },
  {
    slug: "excel-formula-generator",
    name: "AI Excel Formula Generator",
    tagline: "Describe what you want — get the Excel or Sheets formula.",
    description:
      "Free AI Excel formula generator — describe what you need in plain English and get the correct Excel or Google Sheets formula, with an explanation. Free daily; Pro for unlimited.",
    keywords: [
      "excel formula generator",
      "ai excel formula",
      "google sheets formula generator",
      "formula generator",
      "excel formula from text",
      "how to write excel formula",
    ],
    icon: SheetIcon,
    intro:
      "Stop hunting through function docs. Describe what you want to calculate in plain English — like \"sum column B where column A is 'Paid'\" — and get the correct Excel or Google Sheets formula, plus a short explanation of how it works. Everyone gets free daily AI runs; Pro removes the cap.",
    steps: [
      "Describe what you want the formula to do.",
      "Pick Excel or Google Sheets.",
      "Copy the generated formula and paste it into your spreadsheet.",
    ],
    faqs: [
      { q: "Does it work for Google Sheets too?", a: "Yes — choose Google Sheets and it uses the right function names and syntax for Sheets." },
      { q: "Will the formula always be correct?", a: "It's highly accurate for common tasks, but always test on your own data — describe your columns and conditions clearly for the best result." },
      { q: "Is it free?", a: "You get a set number of free AI runs each day; go Pro for unlimited use." },
    ],
    related: ["sql-generator", "regex-generator", "csv-to-xlsx"],
  },
  {
    slug: "blog-post-generator",
    name: "AI Blog Post Generator",
    tagline: "Turn a topic into a structured draft blog post.",
    description:
      "Free AI blog post generator — enter a topic and get a structured draft with a title, intro, subheadings, and conclusion. Free daily runs; Pro for unlimited long-form.",
    keywords: [
      "ai blog post generator",
      "blog post generator",
      "ai article writer",
      "blog writer ai",
      "write a blog post with ai",
      "content generator",
    ],
    icon: NewspaperIcon,
    intro:
      "Beat the blank page. Give the AI your topic (and any angle or key points) and get a structured first draft — title, introduction, subheadings, and a conclusion — that you can edit into your own voice. Great for outlines and drafts; always review and fact-check before publishing. Free daily runs; Pro removes the limit.",
    steps: [
      "Enter your topic and any key points or angle.",
      "Choose a tone and length.",
      "Generate, then edit the draft into your own voice.",
    ],
    faqs: [
      { q: "Should I publish the output as-is?", a: "Treat it as a first draft — edit for accuracy and voice, and verify any facts. AI drafts are a starting point, not a finished article." },
      { q: "Can it write long posts?", a: "Yes — choose the long option. Very long articles are best generated section by section for quality." },
      { q: "Is it free?", a: "You get a set number of free AI runs each day; go Pro for unlimited use." },
    ],
    related: ["headline-generator", "ai-paraphraser", "ai-summarizer", "faq-generator"],
  },
  {
    slug: "linkedin-post-generator",
    name: "AI LinkedIn Post Generator",
    tagline: "Turn an idea into an engaging LinkedIn post.",
    description:
      "Free AI LinkedIn post generator — enter a topic and get an engaging post with a strong hook, scannable lines, and hashtags. Free daily runs; Pro for unlimited.",
    keywords: [
      "linkedin post generator",
      "ai linkedin post",
      "linkedin content generator",
      "linkedin caption generator",
      "write linkedin post ai",
      "linkedin post ideas",
    ],
    icon: Share2Icon,
    intro:
      "Post consistently without staring at a blank box. Describe your idea, experience, or announcement and get a ready-to-edit LinkedIn post — a scroll-stopping hook, short readable paragraphs, a call to action, and relevant hashtags. Free daily runs; Pro for unlimited.",
    steps: [
      "Describe your topic, story, or announcement.",
      "Pick a tone.",
      "Generate, tweak, and post.",
    ],
    faqs: [
      { q: "Will it sound like me?", a: "Give it your key points and pick a tone — then edit lightly so it keeps your voice. The more context you add, the more authentic it reads." },
      { q: "Does it add hashtags?", a: "Yes — it ends with a few relevant hashtags you can keep or swap." },
      { q: "Is it free?", a: "You get a set number of free AI runs each day; go Pro for unlimited use." },
    ],
    related: ["caption-generator", "bio-generator", "headline-generator", "hashtag-generator"],
  },
  {
    slug: "story-generator",
    name: "AI Story Generator",
    tagline: "Turn a prompt into a short story in any genre.",
    description:
      "Free AI story generator — give a premise and get a short story in the genre you choose, with a beginning, middle, and end. Free daily runs; Pro for unlimited.",
    keywords: [
      "ai story generator",
      "story generator",
      "short story generator",
      "story writer ai",
      "story idea generator",
      "write a story with ai",
    ],
    icon: BookOpenIcon,
    intro:
      "Spark your imagination. Give the AI a premise, characters, or just a vibe, pick a genre and length, and get a complete short story with a beginning, middle, and end. Perfect for writing prompts, bedtime stories, and beating writer's block. Free daily runs; Pro removes the cap.",
    steps: [
      "Describe your premise, characters, or idea.",
      "Choose a genre and length.",
      "Generate your story — then continue or regenerate for a new take.",
    ],
    faqs: [
      { q: "Can I control the genre?", a: "Yes — pick from options like fantasy, sci-fi, mystery, romance, and more, and set the length." },
      { q: "Is the story original?", a: "Each story is generated fresh from your prompt. As with any AI writing, review it before publishing anywhere." },
      { q: "Is it free?", a: "You get a set number of free AI runs each day; go Pro for unlimited use." },
    ],
    related: ["ai-paraphraser", "headline-generator", "caption-generator"],
  },
];

export const extraSlugs: string[] = extraTools.map((t) => t.slug);
