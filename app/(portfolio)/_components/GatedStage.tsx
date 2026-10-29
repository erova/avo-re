"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";

type Img = { src: string; width: number; height: number; alt: string };
type Gate = GateText;
export type GateText = {
  note: string;
  request: string;
  requestHref: string;
  label: string;
  button: string;
  error: string;
};

/** Shared by both gates: asks the server whether the access cookie is already set, and posts the code. */
function useGate(probe: string) {
  // null while we find out whether the cookie is already set.
  const [open, setOpen] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    fetch(probe, { method: "HEAD" })
      .then((r) => live && setOpen(r.ok))
      .catch(() => live && setOpen(false));
    return () => {
      live = false;
    };
  }, [probe]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code") ?? "");
    setBusy(true);
    setFailed(false);
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    }).catch(() => null);
    setBusy(false);
    if (res?.ok) setOpen(true);
    else setFailed(true);
  }
  return { open, failed, busy, submit };
}

function GateForm({ gate, g, id }: { gate: Gate; g: ReturnType<typeof useGate>; id: string }) {
  return (
    <form onSubmit={g.submit}>
      <p>
        {gate.note} <a href={gate.requestHref}>{gate.request}</a>.
      </p>
      <div className="gate-controls">
        <label>
          <span>{gate.label}</span>
          <input name="code" type="password" autoComplete="off" required aria-describedby={id} />
        </label>
        <button type="submit" disabled={g.busy}>
          {gate.button}
        </button>
      </div>
      <p id={id} className="gate-error" role="status">
        {g.failed ? gate.error : ""}
      </p>
    </form>
  );
}

/** Wraps a whole showcase (pills and views). Locked, it is one box the shape of the first image. */
export function GatedShowcase({
  probe,
  ratio,
  gate,
  children,
}: {
  probe: string;
  ratio: string;
  gate: Gate;
  children: ReactNode;
}) {
  const g = useGate(probe);
  if (g.open) return <>{children}</>;
  return (
    <div className="stage">
      <div className="stage-locked" style={{ aspectRatio: ratio }}>
        {g.open === false && <GateForm gate={gate} g={g} id="gate-err-showcase" />}
      </div>
    </div>
  );
}

export function GatedStage({ main, panels, gate }: { main: Img; panels: Img[]; gate: Gate }) {
  const g = useGate(main.src);

  if (g.open) {
    return (
      <div className="stage" data-stage>
        <img className="stage-main" {...main} decoding="async" />
        {panels.map((p, i) => (
          <img key={p.src} className={`panel panel-${i === 0 ? "a" : "b"}`} {...p} decoding="async" />
        ))}
      </div>
    );
  }

  return (
    <div className="stage">
      <div className="stage-locked" style={{ aspectRatio: `${main.width} / ${main.height}` }}>
        {g.open === false && <GateForm gate={gate} g={g} id="gate-err" />}
      </div>
    </div>
  );
}

/**
 * An <img> rendered on the client. A plain <img> in a server component makes React send the browser a
 * preload hint for its src; for gated images that request is made before the code is entered and fails.
 */
export function Pic(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />;
}
