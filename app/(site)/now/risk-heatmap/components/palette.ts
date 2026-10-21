export type ColorMode = "stoplight" | "modern";

// 1 (safest, most intense green) → 9 (hottest red)
export type RiskLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type PaletteClasses = {
  bg: string;
  border: string;
  text: string;
};

type Palette = Record<RiskLevel, PaletteClasses>;

export const palettes: Record<ColorMode, Palette> = {
  // Stoplight-style gradient: strong green → lighter green → yellow → amber → orange → red
  stoplight: {
    // Low-risk, green band – 1 is MOST intense green
    1: { bg: "bg-green-500", border: "border-green-700", text: "text-white" },
    2: { bg: "bg-green-400", border: "border-green-600", text: "text-green-950" },
    3: { bg: "bg-green-200", border: "border-green-400", text: "text-green-950" },

    // Mid-range, yellow / amber
    4: { bg: "bg-yellow-200", border: "border-yellow-400", text: "text-yellow-900" },
    5: { bg: "bg-yellow-300", border: "border-yellow-500", text: "text-yellow-900" },
    6: { bg: "bg-amber-300",  border: "border-amber-500",  text: "text-amber-950" },

    // High-risk, orange / red
    7: { bg: "bg-orange-300", border: "border-orange-500", text: "text-orange-950" },
    8: { bg: "bg-red-300",    border: "border-red-500",    text: "text-red-950" },
    9: { bg: "bg-red-600",    border: "border-red-700",    text: "text-red-50"  },
  },

  // Alternate “modern” palette – cool neutrals → blues → magenta
  modern: {
    1: { bg: "bg-slate-500",  border: "border-slate-700", text: "text-slate-50" },
    2: { bg: "bg-slate-400",  border: "border-slate-600", text: "text-slate-950" },
    3: { bg: "bg-slate-200",  border: "border-slate-400", text: "text-slate-950" },

    4: { bg: "bg-sky-200",    border: "border-sky-400",   text: "text-sky-900" },
    5: { bg: "bg-sky-300",    border: "border-sky-500",   text: "text-sky-950" },
    6: { bg: "bg-cyan-300",   border: "border-cyan-500",  text: "text-cyan-950" },

    7: { bg: "bg-indigo-300", border: "border-indigo-500", text: "text-indigo-950" },
    8: { bg: "bg-violet-300", border: "border-violet-500", text: "text-violet-950" },
    9: { bg: "bg-fuchsia-500", border: "border-fuchsia-700", text: "text-fuchsia-50" },
  },
};

export function getCellClasses(mode: ColorMode, level: RiskLevel): string {
    const { bg, border, text } = palettes[mode][level];
  
    return [
      bg,
      border,
      text,
    
      "border rounded-md flex flex-col items-center justify-between",
      "[--cell-radius:6px]",
    
      "px-2 py-2",
      "w-28 h-24 md:w-32 md:h-28",
    ].join(" ");
  }