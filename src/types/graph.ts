export interface GraphNode {
  id: number;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: number;
  target: number;
  weight: number;
}

export interface DijkstraResult {
  vertex: number;
  predecessor: {
    predecessor: number;
    distance: number;
  } | null;
}[];

