const SITE = "https://ohotool.com";

// Right-click shortcuts that jump straight to the relevant OhoTool tool.
// (The user uploads/pastes the file on the tool page — we don't ship the
// image across origins in this version.)
const MENUS = [
  { id: "remove-background", title: "Remove image background", slug: "remove-background", contexts: ["image"] },
  { id: "compress-image", title: "Compress image", slug: "compress-image", contexts: ["image"] },
  { id: "image-converter", title: "Convert image (PNG / JPG / WebP)", slug: "image-converter", contexts: ["image"] },
  { id: "image-to-text", title: "Extract text from image (OCR)", slug: "image-to-text", contexts: ["image"] },
  { id: "url-to-pdf", title: "Save this page as PDF", slug: "url-to-pdf", contexts: ["page"] },
  { id: "word-counter", title: "Count words in selection", slug: "word-counter", contexts: ["selection"] },
];

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    for (const m of MENUS) {
      chrome.contextMenus.create({ id: m.id, title: `OhoTool: ${m.title}`, contexts: m.contexts });
    }
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  const m = MENUS.find((x) => x.id === info.menuItemId);
  if (!m) return;
  chrome.tabs.create({ url: `${SITE}/tools/${m.slug}` });
});
