import Papa from "papaparse";

import type { GraphNode, GraphEdge } from "@/types/graph";

interface ParsedGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function parseGraphCSV(file: File): Promise<ParsedGraphData> {
  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.data.length < 2) {
            throw new Error("Invalid CSV format: Insufficient data");
          }

          const nodeNbr = parseNumberSafely(results.data[0][0], "Number of nodes");

          if (results.data.length < nodeNbr + 2) {
            throw new Error("Invalid CSV format: Not enough node data");
          }

          const nodes: GraphNode[] = [];
          for (let i = 1; i <= nodeNbr; i++) {
            const node = results.data[i];

            if (node.length < 3) {
              throw new Error(`Invalid node data at row ${i}`);
            }

            nodes.push({
              id: parseStringSafely(node[0], `Node ID at row ${i}`),
              x: parseFloatSafely(node[1], `X coordinate for node ${node[0]}`),
              y: parseFloatSafely(node[2], `Y coordinate for node ${node[0]}`)
            });
          }

          const edgeNbr = parseNumberSafely(results.data[nodeNbr + 1][0], "Number of edges");

          if (results.data.length < nodeNbr + edgeNbr + 2) {
            throw new Error("Invalid CSV format: Not enough edge data");
          }

          const edges: GraphEdge[] = [];
          for (let i = nodeNbr + 2; i < nodeNbr + edgeNbr + 2; i++) {
            const edge = results.data[i];

            if (edge.length < 3) {
              throw new Error(`Invalid edge data at row ${i}`);
            }

            edges.push({
              source: parseStringSafely(edge[0], `Source node at row ${i}`),
              target: parseStringSafely(edge[1], `Target node at row ${i}`),
              weight: parseFloatSafely(edge[2], `Edge weight at row ${i}`)
            });
          }

          resolve({ nodes, edges });
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error)
    });
  });
}

// Utility functions for safe parsing
function parseNumberSafely(value: string, context: string): number {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Invalid number for ${context}: ${value}`);
  }
  return parsed;
}

function parseFloatSafely(value: string, context: string): number {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    throw new Error(`Invalid float for ${context}: ${value}`);
  }
  return parsed;
}

function parseStringSafely(value: string, context: string): string {
  if (!value || typeof value !== 'string') {
    throw new Error(`Invalid string for ${context}: ${value}`);
  }
  return value.trim();
}
