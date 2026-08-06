"use client";

import * as React from "react";

// Flags the owner's browser so tool-view analytics ignore it. Rendered inside
// the (admin-only) layout, so only an admin who has opened /admin gets it. The
// cookie rides along on the same-origin /api/track beacon, which then skips.
export function NoTrack() {
  React.useEffect(() => {
    document.cookie = "oho_no_track=1; path=/; max-age=63072000; samesite=lax";
  }, []);
  return null;
}
