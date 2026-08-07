"use client";

import * as React from "react";

// Posts the document height to the embedding page so the parent iframe can size
// itself to the content (no inner scrollbar). The snippet on /tools/<slug>
// listens for { ohotoolHeight, slug } messages and updates the iframe height.
export function EmbedResizer({ slug }: { slug: string }) {
  React.useEffect(() => {
    if (window.parent === window) return; // not framed — nothing to do

    const post = () => {
      const h = Math.ceil(document.documentElement.scrollHeight);
      window.parent.postMessage({ ohotoolHeight: h, slug }, "*");
    };

    post();
    const ro = new ResizeObserver(post);
    ro.observe(document.documentElement);
    window.addEventListener("load", post);
    // Late layout shifts (fonts, images, expanding results) settle within ~1s.
    const t = window.setTimeout(post, 800);

    return () => {
      ro.disconnect();
      window.removeEventListener("load", post);
      window.clearTimeout(t);
    };
  }, [slug]);

  return null;
}
