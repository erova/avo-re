"use client";

import { useEffect, useState, type FormEvent } from "react";

type Img = { src: string; width: number; height: number; alt: string };
type Gate = {
  note: string;
  request: string;
  requestHref: string;
  label: string;
  button: string;
  error: string;
};

export function GatedStage({ main, panels, gate }: { main: Img; panels: Img[]; gate: Gate }) {
  // null while we find out whether the cookie is already set.
  const [open, setOpen] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    fetch(main.src, { method: "HEAD" })
      .then((r) => live && setOpen(r.ok))
      .catch(() => live && setOpen(false));
    return () => {
      live = false;
    };
  }, [main.src]);

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

  if (open) {
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
        {open === false && (
          <form onSubmit={submit}>
            <p>
              {gate.note} <a href={gate.requestHref}>{gate.request}</a>.
            </p>
            <div className="gate-controls">
              <label>
                <span>{gate.label}</span>
                <input name="code" type="password" autoComplete="off" required aria-describedby="gate-err" />
              </label>
              <button type="submit" disabled={busy}>
                {gate.button}
              </button>
            </div>
            <p id="gate-err" className="gate-error" role="status">
              {failed ? gate.error : ""}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
