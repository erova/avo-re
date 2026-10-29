"use client";

import { useState } from "react";
import { Pic } from "./GatedStage";

type View = { label: string; src: string; width: number; height: number; alt: string };

/**
 * One frame with a switch for the views inside it. The screens share a grid cell, so the frame
 * keeps the height of the tallest and switching never moves the page. Nothing advances on its own.
 */
export function ViewSwitch({ label, views }: { label: string; views: View[] }) {
  const [on, setOn] = useState(0);
  return (
    <div className="views">
      <div className="views-switch" role="group" aria-label={`${label} views`}>
        {views.map((v, i) => (
          <button key={v.label} type="button" aria-pressed={on === i} onClick={() => setOn(i)}>
            {v.label}
          </button>
        ))}
      </div>
      <div className="stage">
        <div className="stage-main pane views-frame">
          {views.map((v, i) => (
            <div
              key={v.src}
              className="views-shot"
              data-on={on === i ? "" : undefined}
              style={{ aspectRatio: `${v.width} / ${v.height}` }}
              inert={on !== i}
            >
              <Pic src={v.src} width={v.width} height={v.height} alt={v.alt} decoding="async" loading={i === 0 ? undefined : "lazy"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
