"use client";

import React from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type DeviceType = "desktop" | "ipad" | "iphone";
type VersionType = "v1" | "v2" | "v3";

interface Message {
  id: string;
  type: "user" | "assistant" | "action" | "result";
  content: string;
  timestamp: string;
  actionType?: "document" | "search" | "meeting" | "workflow";
  metadata?: Record<string, string>;
}

const sampleThread: Message[] = [
  {
    id: "1",
    type: "assistant",
    content: "Good morning, Sarah. Your legal portfolio is in good shape. 3 items need attention: 2 contract renewals and 1 board filing.",
    timestamp: "9:00 AM",
  },
  {
    id: "2",
    type: "user",
    content: "Who owns the Acme Corp vendor relationship?",
    timestamp: "9:15 AM",
  },
  {
    id: "3",
    type: "action",
    content: "Searching across Third Party Manager, Entities, and Activity Center...",
    timestamp: "9:15 AM",
    actionType: "search",
  },
  {
    id: "4",
    type: "result",
    content: "Sarah Chen (Procurement) is the primary owner of the Acme Corp relationship. Contract value: $2.4M annually, renewal date: March 15, 2025.",
    timestamp: "9:15 AM",
    actionType: "search",
    metadata: {
      source: "Third Party Manager",
      confidence: "98%",
    },
  },
  {
    id: "5",
    type: "user",
    content: "Schedule a meeting with Sarah Chen and the CFO to discuss the renewal",
    timestamp: "9:20 AM",
  },
  {
    id: "6",
    type: "action",
    content: "Finding available times for Sarah Chen, CFO, and you...",
    timestamp: "9:20 AM",
    actionType: "meeting",
  },
  {
    id: "7",
    type: "result",
    content: "Found optimal time: Tomorrow at 3:30 PM. I moved your low-priority sales call to Thursday to open this slot. Shall I send the invites?",
    timestamp: "9:20 AM",
    actionType: "meeting",
    metadata: {
      attendees: "3",
      duration: "30 min",
    },
  },
];

function DiligentLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 222 222" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path fill="#EE312E" d="M200.87,110.85c0,33.96-12.19,61.94-33.03,81.28c-0.24,0.21-0.42,0.43-0.66,0.64c-15.5,14.13-35.71,23.52-59.24,27.11l-1.59-1.62l35.07-201.75l1.32-3.69C178.64,30.36,200.87,65.37,200.87,110.85z"/>
        <path fill="#AF292E" d="M142.75,12.83l-0.99,1.47L0.74,119.34L0,118.65c0,0,0-0.03,0-0.06V0.45h85.63c5.91,0,11.64,0.34,17.19,1.01h0.21c14.02,1.66,26.93,5.31,38.48,10.78C141.97,12.46,142.75,12.83,142.75,12.83z"/>
        <path fill="#D3222A" d="M142.75,12.83L0,118.65v99.27v3.62h85.96c7.61,0,14.94-0.58,21.99-1.66C107.95,219.89,142.75,12.83,142.75,12.83z"/>
      </g>
    </svg>
  );
}

// Thread sidebar showing conversation history
function ThreadSidebar() {
  const threads = [
    { id: "1", title: "Acme Corp Renewal", preview: "Meeting scheduled for tomorrow", time: "Now", active: true },
    { id: "2", title: "Board Materials Prep", preview: "Q1 Legal Update draft ready", time: "Yesterday", active: false },
    { id: "3", title: "Regulatory Inquiry", preview: "Response memo approved", time: "Jan 28", active: false },
    { id: "4", title: "M&A Due Diligence", preview: "Checklist 85% complete", time: "Jan 25", active: false },
  ];

  return (
    <div className="flex h-full w-72 flex-col border-r border-[#30363d] bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-[#30363d] p-4">
        <div className="flex items-center gap-3">
          <DiligentLogo className="h-7 w-7" />
          <span className="text-sm font-semibold text-[#f0f6fc]">Legal AI</span>
        </div>
        <button className="rounded-lg border border-[#30363d] bg-[#21262d] p-2 text-[#8b949e] hover:bg-[#30363d] hover:text-[#f0f6fc]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-[#6e7681]">Threads</p>
        {threads.map((thread) => (
          <button
            key={thread.id}
            className={cn(
              "mb-1 w-full rounded-xl p-3 text-left transition",
              thread.active
                ? "bg-[#58a6ff]/10 border border-[#58a6ff]/30"
                : "hover:bg-[#21262d]"
            )}
          >
            <div className="flex items-start justify-between">
              <p className={cn("text-sm font-medium", thread.active ? "text-[#58a6ff]" : "text-[#f0f6fc]")}>
                {thread.title}
              </p>
              <span className="text-[10px] text-[#6e7681]">{thread.time}</span>
            </div>
            <p className="mt-1 truncate text-xs text-[#8b949e]">{thread.preview}</p>
          </button>
        ))}
      </div>

      <div className="border-t border-[#30363d] p-3">
        <div className="flex items-center gap-3 rounded-xl bg-[#21262d] p-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#58a6ff] to-[#a371f7]" />
          <div>
            <p className="text-sm font-medium text-[#f0f6fc]">Sarah Johnson</p>
            <p className="text-xs text-[#6e7681]">General Counsel</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Message bubble component
function MessageBubble({ message }: { message: Message }) {
  const actionColors: Record<string, string> = {
    search: "#f0883e",
    meeting: "#a371f7",
    document: "#58a6ff",
    workflow: "#3fb950",
  };

  if (message.type === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-md rounded-2xl rounded-br-md bg-[#58a6ff] px-4 py-3">
          <p className="text-sm text-white">{message.content}</p>
          <p className="mt-1 text-right text-[10px] text-white/60">{message.timestamp}</p>
        </div>
      </div>
    );
  }

  if (message.type === "action") {
    const color = message.actionType ? actionColors[message.actionType] : "#6e7681";
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="h-0.5 flex-1 bg-[#30363d]" />
        <div className="flex items-center gap-2 rounded-full border border-[#30363d] bg-[#21262d] px-3 py-1">
          <div className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs text-[#8b949e]">{message.content}</span>
        </div>
        <div className="h-0.5 flex-1 bg-[#30363d]" />
      </div>
    );
  }

  if (message.type === "result") {
    const color = message.actionType ? actionColors[message.actionType] : "#3fb950";
    return (
      <div className="max-w-lg">
        <div 
          className="rounded-2xl rounded-bl-md border px-4 py-3"
          style={{ 
            borderColor: `${color}30`,
            backgroundColor: `${color}08`,
          }}
        >
          <p className="text-sm text-[#f0f6fc]">{message.content}</p>
          {message.metadata && (
            <div className="mt-2 flex gap-3">
              {Object.entries(message.metadata).map(([key, value]) => (
                <span key={key} className="text-[10px] text-[#8b949e]">
                  {key}: <span style={{ color }}>{value}</span>
                </span>
              ))}
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1 text-xs text-[#8b949e] hover:bg-[#30363d]">
              View details
            </button>
            <button 
              className="rounded-lg px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: color }}
            >
              {message.actionType === "meeting" ? "Confirm" : "Open"}
            </button>
          </div>
        </div>
        <p className="mt-1 text-[10px] text-[#6e7681]">{message.timestamp}</p>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="max-w-lg">
      <div className="rounded-2xl rounded-bl-md border border-[#30363d] bg-[#21262d] px-4 py-3">
        <p className="text-sm text-[#f0f6fc]">{message.content}</p>
      </div>
      <p className="mt-1 text-[10px] text-[#6e7681]">{message.timestamp}</p>
    </div>
  );
}

// Main chat area
function ChatArea() {
  const [input, setInput] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full flex-col bg-[#161b22]">
      {/* Thread header */}
      <div className="flex items-center justify-between border-b border-[#30363d] px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-[#f0f6fc]">Acme Corp Renewal</h1>
          <p className="text-xs text-[#8b949e]">Started today · 7 messages</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-xs text-[#8b949e] hover:bg-[#30363d]">
            Export
          </button>
          <button className="rounded-lg border border-[#30363d] bg-[#21262d] p-2 text-[#8b949e] hover:bg-[#30363d]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {sampleThread.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-[#30363d] p-4">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[#30363d] bg-[#0d1117] p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[60px] w-full resize-none bg-transparent text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus:outline-none"
              placeholder="Ask a question, start a workflow, or give a command..."
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {[
                  { icon: "📎", label: "Attach" },
                  { icon: "📊", label: "Report" },
                  { icon: "📝", label: "Draft" },
                  { icon: "📅", label: "Schedule" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="rounded-lg p-2 text-lg hover:bg-[#21262d]"
                    title={action.label}
                  >
                    {action.icon}
                  </button>
                ))}
              </div>
              <button
                disabled={!input.trim()}
                className="rounded-xl bg-[#58a6ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#79b8ff] disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main thread layout
function ThreadLayout() {
  return (
    <div className="flex h-full">
      <ThreadSidebar />
      <div className="flex-1">
        <ChatArea />
      </div>
    </div>
  );
}

// Device frames
function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="relative rounded-[2.5rem] border-[12px] border-[#1c1c1e] bg-[#1c1c1e] shadow-2xl">
        <div className="absolute left-1/2 top-2 z-20 h-[22px] w-[80px] -translate-x-1/2 rounded-full bg-black" />
        <div className="relative h-[700px] w-[340px] overflow-hidden rounded-[2rem] bg-[#0d1117]">
          <div className="h-full w-full overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function IPadFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="relative rounded-[1.5rem] border-[14px] border-[#1c1c1e] bg-[#1c1c1e] shadow-2xl">
        <div className="relative h-[600px] w-[850px] overflow-hidden rounded-[0.75rem] bg-[#0d1117]">
          <div className="h-full w-full overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile chat view
function MobileChatView() {
  return (
    <div className="flex h-full flex-col bg-[#0d1117]">
      <div className="flex items-center gap-3 border-b border-[#30363d] p-4 pt-12">
        <button className="text-[#8b949e]">←</button>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[#f0f6fc]">Acme Corp Renewal</p>
          <p className="text-[10px] text-[#6e7681]">7 messages</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {sampleThread.slice(0, 4).map((msg) => (
            <div key={msg.id} className={cn("text-xs", msg.type === "user" ? "text-right" : "")}>
              <div className={cn(
                "inline-block rounded-xl px-3 py-2",
                msg.type === "user" ? "bg-[#58a6ff] text-white" : "bg-[#21262d] text-[#f0f6fc]"
              )}>
                {msg.content.slice(0, 80)}...
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-[#30363d] p-3">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-xl border border-[#30363d] bg-[#21262d] px-3 py-2 text-sm text-[#f0f6fc] placeholder:text-[#6e7681]"
            placeholder="Message..."
          />
          <button className="rounded-xl bg-[#58a6ff] px-4 py-2 text-sm text-white">Send</button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [device, setDevice] = React.useState<DeviceType>("desktop");
  const [version] = React.useState<VersionType>("v3");

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Top bar with version selector */}
      <div className="border-b border-[#30363d] bg-[#161b22]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[#6e7681]">Prototype</span>
            <span className="text-sm font-semibold text-[#f0f6fc]">General Counsel Command Center</span>
          </div>
          
          {/* Version Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6e7681]">Model:</span>
            <div className="flex rounded-lg border border-[#30363d] bg-[#0d1117] p-0.5">
              {[
                { id: "v1" as VersionType, label: "Canvas Overlay", href: "/now/agentic-hero/dark/general-counsel" },
                { id: "v2" as VersionType, label: "Split Workspace", href: "/now/agentic-hero/dark/general-counsel/v2" },
                { id: "v3" as VersionType, label: "Chat Thread", href: "/now/agentic-hero/dark/general-counsel/v3" },
              ].map((v) => (
                <a
                  key={v.id}
                  href={v.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition",
                    version === v.id
                      ? "bg-[#58a6ff] text-white"
                      : "text-[#8b949e] hover:text-[#f0f6fc]"
                  )}
                >
                  {v.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Device selector - closer to content */}
      <div className="flex justify-center py-4">
        <div className="flex items-center gap-2 rounded-xl border border-[#30363d] bg-[#161b22] p-1">
          {[
            { id: "desktop" as DeviceType, icon: "🖥️", label: "Desktop" },
            { id: "ipad" as DeviceType, icon: "📱", label: "iPad" },
            { id: "iphone" as DeviceType, icon: "📱", label: "iPhone" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDevice(d.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition",
                device === d.id
                  ? "bg-[#21262d] text-[#f0f6fc]"
                  : "text-[#8b949e] hover:text-[#f0f6fc]"
              )}
            >
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Device preview */}
      <div className="flex justify-center pb-8">
        {device === "desktop" ? (
          <div className="w-full max-w-6xl px-4">
            <div className="overflow-hidden rounded-2xl border border-[#30363d] shadow-2xl" style={{ height: "700px" }}>
              <ThreadLayout />
            </div>
          </div>
        ) : device === "ipad" ? (
          <IPadFrame>
            <ThreadLayout />
          </IPadFrame>
        ) : (
          <IPhoneFrame>
            <MobileChatView />
          </IPhoneFrame>
        )}
      </div>
    </div>
  );
}
