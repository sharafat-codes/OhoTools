"use client";

import * as React from "react";
import { RotateCwIcon, SparklesIcon } from "lucide-react";

import type { CardData } from "@/modules/cards/types";
import { BirthdayClassic } from "@/modules/cards/templates/birthday-classic";

/**
 * Renders a card's animated template inside a positioned parent (the parent
 * must be `position: relative` with a defined size — a full-screen container on
 * the public page, an aspect-ratio box in the editor preview).
 */
export function CardStage({ data, cta = true, interactive = true }: { data: CardData; cta?: boolean; interactive?: boolean }) {
  const [fireKey, setFireKey] = React.useState(0);

  return (
    <div className="absolute inset-0">
      <BirthdayClassic data={data} fireKey={fireKey} />

      {interactive && (
        <button
          type="button"
          onClick={() => setFireKey((k) => k + 1)}
          aria-label="Replay animation"
          className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/40"
        >
          <RotateCwIcon className="size-3.5" /> Replay
        </button>
      )}

      {cta && (
        <a
          href="/tools/birthday-card-maker"
          className="absolute bottom-3 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-black/25 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/40"
        >
          <SparklesIcon className="size-3.5" /> Made with OhoTool — create your own
        </a>
      )}
    </div>
  );
}
