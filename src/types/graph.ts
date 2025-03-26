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
