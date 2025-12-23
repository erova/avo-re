"use client";

import { MetricTiles as MetricTilesServer } from "./MetricTiles";

export function MetricTiles(props: Parameters<typeof MetricTilesServer>[0]) {
  return <MetricTilesServer {...props} />;
}