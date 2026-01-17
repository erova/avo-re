"use client";

import React from "react";

export type ReceiptStepModel = {
  id: string;
  status: "done" | "pending";
  title: string;
  detail?: string;
  time?: string;
  actor?: "Agent" | "Human" | string;
};

export type ReceiptModel = {
  id: string;
  title: string;
  summary?: string[];
  completedSteps?: number;
  totalSteps?: number;
  steps: ReceiptStepModel[];
};

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export function ReceiptComponent({
  model,
  onClose,
}: {
  model: ReceiptModel;
  onClose: () => void;
}) {
  const doneCount =
    model.completedSteps ??
    model.steps.filter((s) => s.status === "done").length;

  const totalCount = model.totalSteps ?? model.steps.length;

  return (
    <div className="min-h-full bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Receipt
            </div>
            <div className="truncate text-lg font-semibold text-slate-900">
              {model.title}
            </div>
            <div className="mt-1 text-sm text-slate-600">
              This is an always-on early warning update. The system recalculates risk at the entity node and enterprise level as third-party states change.
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-6 py-8">
        {model.summary?.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">
              Summary
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {model.summary.map((line, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={cn("mt-6", model.summary?.length ? "" : "mt-0")}>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-3">
              <div className="text-sm font-semibold text-slate-900">
                Event log
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Shows what the agent has done, what’s pending, and who
                needs to act next.
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {model.steps.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start gap-4 px-5 py-4"
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                      s.status === "done"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 bg-white text-slate-600"
                    )}
                  >
                    {s.status === "done" ? "✓" : "•"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <div className="text-sm font-medium text-slate-900">
                        {s.title}
                      </div>
                      {s.actor ? (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                          {s.actor}
                        </span>
                      ) : null}
                      {s.time ? (
                        <span className="text-xs text-slate-500">
                          {s.time}
                        </span>
                      ) : null}
                    </div>
                    {s.detail ? (
                      <div className="mt-1 text-sm text-slate-600">
                        {s.detail}
                      </div>
                    ) : null}
                  </div>

                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-xs",
                      s.status === "done"
                        ? "border-slate-200 bg-white text-slate-700"
                        : "border-slate-200 bg-slate-50 text-slate-700"
                    )}
                  >
                    {s.status === "done" ? "Completed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Close receipt
          </button>
        </div>
      </div>
    </div>
  );
}