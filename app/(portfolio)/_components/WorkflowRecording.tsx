"use client";

import { useState } from "react";
import { Clip } from "./GatedStage";

type Step = { title: string; text: string; at: number };
type Main = { src: string; video: string; width: number; height: number; alt: string };

/**
 * A recording with numbered steps beside it. The step covering the current moment of the video is
 * lit; the others are dimmed. Until the video plays (or under reduced motion) all steps read normally.
 */
export function WorkflowRecording({ steps, main }: { steps: Step[]; main: Main }) {
  const [active, setActive] = useState<number | null>(null);

  function onTime(t: number) {
    let i = 0;
    steps.forEach((s, n) => {
      if (t >= s.at) i = n;
    });
    setActive(i);
  }

  return (
    <div className="workflow">
      <ol className="workflow-steps">
        {steps.map((st, i) => (
          <li key={st.title} data-active={active === i ? "" : undefined} data-dim={active !== null && active !== i ? "" : undefined}>
            <strong>{st.title}</strong>
            <span>{st.text}</span>
          </li>
        ))}
      </ol>
      <div className="stage">
        <div className="stage-main pane" style={{ aspectRatio: `${main.width} / ${main.height}` }}>
          <Clip src={main.video} poster={main.src} alt={main.alt} width={main.width} height={main.height} onTime={onTime} />
        </div>
      </div>
    </div>
  );
}
