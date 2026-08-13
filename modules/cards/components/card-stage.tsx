"use client";

import * as React from "react";
import { RotateCwIcon, SparklesIcon } from "lucide-react";

import type { CardData, TemplateId } from "@/modules/cards/types";
import { BirthdayClassic } from "@/modules/cards/templates/birthday-classic";
import { BirthdayElegant } from "@/modules/cards/templates/birthday-elegant";
import { BirthdayPlayful } from "@/modules/cards/templates/birthday-playful";
import { MusicController } from "@/modules/cards/components/music-controller";

const TEMPLATES: Record<TemplateId, React.ComponentType<{ data: CardData; fireKey?: number }>> = {
  classic: BirthdayClassic,
  elegant: BirthdayElegant,
  playful: BirthdayPlayful,
};

/**
 * Renders a card's animated template inside a positioned parent (which must be
 * `position: relative` with a defined size — a full-screen container on the
 * public page, an aspect-ratio box in the editor preview).
 */
export function CardStage({ data, cta = true, interactive = true, sound = true }: { data: CardData; cta?: boolean; interactive?: boolean; sound?: boolean }) {
  const [fireKey, setFireKey] = React.useState(0);
  const Template = TEMPLATES[data.template] ?? BirthdayClassic;

  return (
    <div className="absolute inset-0">
      <Template data={data} fireKey={fireKey} />

      {data.music && sound && <MusicController />}

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
