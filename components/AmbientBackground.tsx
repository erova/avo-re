"use client";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Ambient background — gradient/noise only. Roll back by restoring previous gradient values. */}
      {/* Gradient layer */}
      <div
        className="absolute inset-0 ambient-gradient"
        style={{
          background:
            `
            /* Primary light bloom (top-left) */
            radial-gradient(
              1400px 700px at 18% 12%,
              rgba(43, 61, 84, 0.32),
              transparent 62%
            ),

            /* Secondary cool wash (lower-left) */
            radial-gradient(
              1100px 600px at 28% 78%,
              rgba(30, 52, 90, 0.22),
              transparent 68%
            ),

            /* Base canvas */
            linear-gradient(
              180deg,
              rgba(6, 10, 28, 0.55),
              rgba(6, 10, 28, 0.9)
            )
            `,
          backgroundSize: "200% 200%",
        }}
      />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")",
        }}
      />

      <style jsx>{`
        .ambient-gradient {
          animation: ambientGradientShift 60s ease-in-out infinite alternate;
        }

        @keyframes ambientGradientShift {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
      `}</style>
    </div>
  );
}