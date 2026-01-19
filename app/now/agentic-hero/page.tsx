"use client";

export default function AgenticHeroIndex() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900">Agentic Hero Prototypes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Three visual styles for the same prototype scenarios. Click any link to explore.
          </p>
        </div>

        {/* Dark Mode */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Dark Mode (Diligent)</h2>
          <div className="space-y-2 text-sm">
            <div>
              <a href="/now/agentic-hero/dark" className="text-blue-600 hover:underline">
                Steady State
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a href="/now/agentic-hero/dark/security" className="text-blue-600 hover:underline">
                Security Incident
              </a>
              <span className="text-gray-400">|</span>
              <a href="/now/agentic-hero/dark/security-tambo" className="text-purple-600 hover:underline">
                Tambo
              </a>
              <span className="text-gray-400">|</span>
              <a href="/now/agentic-hero/dark/security-jsonrender" className="text-emerald-600 hover:underline">
                JSON Render
              </a>
            </div>
            <div>
              <a href="/now/agentic-hero/dark/whistleblower" className="text-blue-600 hover:underline">
                Whistleblower
              </a>
            </div>
            <div>
              <a href="/now/agentic-hero/dark/compliance" className="text-blue-600 hover:underline">
                Global Compliance
              </a>
            </div>
          </div>
        </section>

        {/* Light Mode */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Light Mode (Diligent)</h2>
          <div className="space-y-2 text-sm">
            <div>
              <a href="/now/agentic-hero/light" className="text-blue-600 hover:underline">
                Steady State
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a href="/now/agentic-hero/light/security" className="text-blue-600 hover:underline">
                Security Incident
              </a>
              <span className="text-gray-400">|</span>
              <a href="/now/agentic-hero/light/security-tambo" className="text-purple-600 hover:underline">
                Tambo
              </a>
              <span className="text-gray-400">|</span>
              <a href="/now/agentic-hero/light/security-jsonrender" className="text-emerald-600 hover:underline">
                JSON Render
              </a>
            </div>
            <div>
              <a href="/now/agentic-hero/light/whistleblower" className="text-blue-600 hover:underline">
                Whistleblower
              </a>
            </div>
            <div>
              <a href="/now/agentic-hero/light/compliance" className="text-blue-600 hover:underline">
                Global Compliance
              </a>
            </div>
          </div>
        </section>

        {/* Wireframe */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Wireframe (Black & White)</h2>
          <div className="space-y-2 text-sm">
            <div>
              <a href="/now/agentic-hero/bw" className="text-blue-600 hover:underline">
                Steady State
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a href="/now/agentic-hero/bw/security" className="text-blue-600 hover:underline">
                Security Incident
              </a>
              <span className="text-gray-400">|</span>
              <a href="/now/agentic-hero/bw/security-tambo" className="text-purple-600 hover:underline">
                Tambo
              </a>
              <span className="text-gray-400">|</span>
              <a href="/now/agentic-hero/bw/security-jsonrender" className="text-emerald-600 hover:underline">
                JSON Render
              </a>
            </div>
            <div>
              <a href="/now/agentic-hero/bw/whistleblower" className="text-blue-600 hover:underline">
                Whistleblower
              </a>
            </div>
            <div>
              <a href="/now/agentic-hero/bw/compliance" className="text-blue-600 hover:underline">
                Global Compliance
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-gray-200 pt-6 text-xs text-gray-500">
          <p>Prototypes by Chris Avore</p>
        </footer>
      </div>
    </div>
  );
}
