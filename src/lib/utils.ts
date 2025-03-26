import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { DijkstraResult } from "@/types/graph";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function reconstructPath(
  start: number,
  end: number,
  dijkstraResults: DijkstraResult[]
) {
  const path = [];
  let current = end;

  while (current !== start) {
    const result = dijkstraResults.find((item: any) => item.vertex === current);
    if (!result || !result.predecessor) return [];
    path.unshift(current);
    current = result.predecessor.predecessor;
  }
  path.unshift(start);
  return path;
}
