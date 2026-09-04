import type { ComponentType } from "react";

import * as restaurantQr from "./posts/dynamic-qr-restaurant-menu";
import * as cidrGuide from "./posts/cidr-subnet-cheat-sheet";
import * as devTools from "./posts/free-browser-developer-tools";
import * as formatJson from "./posts/how-to-format-json";
import * as base64Guide from "./posts/what-is-base64-encoding";
import * as strongPassword from "./posts/how-to-create-strong-password";
import * as qrLogo from "./posts/qr-code-with-logo";
import * as decodeJwt from "./posts/how-to-decode-jwt";
import * as mergePdfGuide from "./posts/how-to-merge-pdf-files";
import * as pdfToJpgGuide from "./posts/how-to-convert-pdf-to-jpg";
import * as bulkImagesGuide from "./posts/how-to-bulk-convert-resize-images";
import * as pdfToWordGuide from "./posts/how-to-convert-pdf-to-word";
import * as imageToTextGuide from "./posts/how-to-extract-text-from-an-image";
import * as compressPdfGuide from "./posts/how-to-compress-a-pdf";
import * as urlToPdfGuide from "./posts/how-to-save-a-webpage-as-pdf";
import * as heicGuide from "./posts/how-to-convert-heic-to-jpg";
import * as wordToPdfGuide from "./posts/how-to-convert-word-to-pdf";
import * as excelToPdfGuide from "./posts/how-to-convert-excel-to-pdf";
import * as powerpointToPdfGuide from "./posts/how-to-convert-powerpoint-to-pdf";
import * as compressImageGuide from "./posts/how-to-compress-an-image";
import * as imageToWebpGuide from "./posts/how-to-convert-image-to-webp";
import * as sendLargeFilesGuide from "./posts/how-to-send-large-files-for-free";
import * as passwordProtectGuide from "./posts/how-to-password-protect-a-file";
import * as cropImageGuide from "./posts/how-to-crop-an-image-online";
import * as audioToMp3Guide from "./posts/how-to-convert-audio-to-mp3";
import * as removeNoiseGuide from "./posts/how-to-remove-background-noise-from-audio";
import * as csvToExcelGuide from "./posts/how-to-convert-csv-to-excel";
import * as pdfToPptxGuide from "./posts/how-to-convert-pdf-to-powerpoint";
import * as htmlToPdfGuide from "./posts/how-to-convert-html-to-pdf";
import * as onlineNotepadGuide from "./posts/free-online-notepad";
import * as invoiceGuide from "./posts/how-to-make-a-free-invoice";
import * as businessNameGuide from "./posts/how-to-come-up-with-a-business-name";
import * as humanizeGuide from "./posts/how-to-humanize-ai-text";
import * as pomodoroGuide from "./posts/what-is-the-pomodoro-technique";
import * as removeBgGuide from "./posts/how-to-remove-image-background";
import * as unlockPdfGuide from "./posts/how-to-unlock-a-pdf";
import * as protectPdfGuide from "./posts/how-to-password-protect-a-pdf";
import * as svgToPngGuide from "./posts/how-to-convert-svg-to-png";
import * as scanQrGuide from "./posts/how-to-scan-a-qr-code";
import * as minifyGuide from "./posts/how-to-minify-css-javascript-html";
import * as imageToSvgGuide from "./posts/how-to-convert-image-to-svg";
import * as memeGuide from "./posts/how-to-make-a-meme";
import * as timeCalcGuide from "./posts/how-to-add-and-subtract-time";
import * as jsonXmlGuide from "./posts/how-to-convert-json-to-xml";
import * as mdToPdfGuide from "./posts/how-to-convert-markdown-to-pdf";
import * as colorPickerGuide from "./posts/how-to-get-hex-color-from-image";
import * as typingSpeedGuide from "./posts/what-is-a-good-typing-speed";
import * as cpsGuide from "./posts/what-is-a-good-cps";
import * as dueDateGuide from "./posts/how-to-calculate-your-due-date";
import * as mortgageGuide from "./posts/how-to-calculate-a-mortgage-payment";
import * as ipGuide from "./posts/what-is-my-ip-address";
import * as wordFreqGuide from "./posts/how-to-count-word-frequency";
import * as barcodeGuide from "./posts/how-to-generate-a-barcode";
import * as salaryGuide from "./posts/how-to-convert-hourly-wage-to-salary";
import * as reactionGuide from "./posts/average-human-reaction-time";
import * as markdownCheatGuide from "./posts/markdown-cheat-sheet";
import * as ttsGuide from "./posts/how-to-convert-text-to-speech";
import * as countdownGuide from "./posts/how-to-make-a-countdown-to-a-date";
import * as pemdasGuide from "./posts/order-of-operations-pemdas";
import * as whatsappInviteGuide from "./posts/how-to-send-a-digital-invitation-on-whatsapp";
import * as noWatermarkGuide from "./posts/free-invitation-maker-no-watermark";
import * as birthdayWordingGuide from "./posts/birthday-invitation-wording-ideas";
import * as desiWeddingWordingGuide from "./posts/desi-wedding-invitation-wording";
import * as engagementWordingGuide from "./posts/engagement-invitation-wording";
import * as anniversaryWishesGuide from "./posts/anniversary-wishes-messages";
import * as eidWishesGuide from "./posts/eid-mubarak-wishes-messages";
import * as diwaliWishesGuide from "./posts/happy-diwali-wishes-messages";
import * as atsFriendlyGuide from "./posts/is-your-resume-ats-friendly";
import * as mockDataGuide from "./posts/how-to-generate-mock-data-for-testing";
import * as redirect301Guide from "./posts/301-vs-302-redirect";
import * as userAgentGuide from "./posts/what-is-a-user-agent";
import * as sloganGuide from "./posts/how-to-write-a-slogan";
import * as resumeSummaryGuide from "./posts/how-to-write-a-resume-summary";
import * as hashtagGuide from "./posts/how-to-choose-hashtags";
import * as coverLetterGuide from "./posts/how-to-write-a-cover-letter";
import * as bmiGuide from "./posts/what-is-a-healthy-bmi";
import * as caloriesGuide from "./posts/how-many-calories-should-i-eat";
import * as gpaGuide from "./posts/how-to-calculate-gpa";
import * as excelFormulaGuide from "./posts/how-to-write-excel-formulas";
import * as blogPostGuide from "./posts/how-to-write-a-blog-post";
import * as linkedinPostGuide from "./posts/how-to-write-a-linkedin-post";
import * as shortStoryGuide from "./posts/how-to-write-a-short-story";

export type PostMeta = {
  slug: string;
  title: string;
  /** Used for <meta description> and the card blurb. */
  description: string;
  keywords: string[];
  /** ISO date, e.g. "2026-07-22". */
  date: string;
  readingMinutes: number;
  tags: string[];
  /** Related tool slugs to surface at the end of the post. */
  related: string[];
};

export type BlogPost = { meta: PostMeta; Body: ComponentType };

const modules: BlogPost[] = [
  restaurantQr,
  cidrGuide,
  devTools,
  formatJson,
  base64Guide,
  strongPassword,
  qrLogo,
  decodeJwt,
  mergePdfGuide,
  pdfToJpgGuide,
  bulkImagesGuide,
  pdfToWordGuide,
  imageToTextGuide,
  compressPdfGuide,
  urlToPdfGuide,
  heicGuide,
  wordToPdfGuide,
  excelToPdfGuide,
  powerpointToPdfGuide,
  compressImageGuide,
  imageToWebpGuide,
  sendLargeFilesGuide,
  passwordProtectGuide,
  cropImageGuide,
  audioToMp3Guide,
  removeNoiseGuide,
  csvToExcelGuide,
  pdfToPptxGuide,
  htmlToPdfGuide,
  onlineNotepadGuide,
  invoiceGuide,
  businessNameGuide,
  humanizeGuide,
  pomodoroGuide,
  removeBgGuide,
  unlockPdfGuide,
  protectPdfGuide,
  svgToPngGuide,
  scanQrGuide,
  minifyGuide,
  imageToSvgGuide,
  memeGuide,
  timeCalcGuide,
  jsonXmlGuide,
  mdToPdfGuide,
  colorPickerGuide,
  typingSpeedGuide,
  cpsGuide,
  dueDateGuide,
  mortgageGuide,
  ipGuide,
  wordFreqGuide,
  barcodeGuide,
  salaryGuide,
  reactionGuide,
  markdownCheatGuide,
  ttsGuide,
  countdownGuide,
  pemdasGuide,
  whatsappInviteGuide,
  noWatermarkGuide,
  birthdayWordingGuide,
  desiWeddingWordingGuide,
  engagementWordingGuide,
  anniversaryWishesGuide,
  eidWishesGuide,
  diwaliWishesGuide,
  atsFriendlyGuide,
  mockDataGuide,
  redirect301Guide,
  userAgentGuide,
  sloganGuide,
  resumeSummaryGuide,
  hashtagGuide,
  coverLetterGuide,
  bmiGuide,
  caloriesGuide,
  gpaGuide,
  excelFormulaGuide,
  blogPostGuide,
  linkedinPostGuide,
  shortStoryGuide,
];

/** All posts, newest first. */
export const posts: PostMeta[] = modules
  .map((m) => m.meta)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return modules.find((m) => m.meta.slug === slug);
}
