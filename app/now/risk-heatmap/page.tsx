import HeatmapDemo from "./components/HeatMapDemo";

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Risk Heatmap Prototype
        </h1>
        <p className="text-sm text-muted-foreground">
          A simple experiment to toggle between a classic red–yellow–green
          (stoplight) risk heatmap and a more modern, accessibility-friendly
          palette. Dummy data only; layout loosely follows the internal risk
          dashboard you’re used to.
        </p>
      </header>

      <HeatmapDemo />
    </div>
  );
}