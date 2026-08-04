# OhoTool Browser Extension (Chrome / Edge, Manifest V3)

A lightweight launcher for [ohotool.com](https://ohotool.com):

- **Popup** — search all tools (pulled live from `/api/tools-index`) and open any in a click.
- **Right-click menus** — jump to the right tool from any page: image → remove background / compress / convert / OCR; page → save as PDF; text selection → count words.

It's plain HTML/JS/CSS (no build step) and just links back to the site, so it stays in sync automatically.

## Load it locally (to test)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer mode** (top-right).
3. Click **Load unpacked** and select this `extension/` folder.
4. Pin the OhoTool icon and click it — the popup should list your tools.

## Publish to the Chrome Web Store

1. Create a developer account at the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) (one-time $5 fee).
2. **Replace the icons** with properly sized PNGs before submitting — `icons/icon16.png` (16×16), `icons/icon48.png` (48×48), `icons/icon128.png` (128×128), and update `manifest.json` to point each size at its file. (Right now all three point at one 128px image, which works locally but the store prefers exact sizes.)
3. Zip the **contents** of this folder (not the folder itself) and upload it.
4. Fill in the listing (screenshots of the popup + a right-click menu, description, category "Productivity"), then submit for review.

Edge Add-ons store accepts the same package via [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge).

## Notes

- The popup fetches `https://ohotool.com/api/tools-index` (declared in `host_permissions`).
- No user data is collected; the extension only opens ohotool.com pages.
- Bump `version` in `manifest.json` on each store update.
