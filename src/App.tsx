import * as React from "react";

import { Graph } from "@/components/graph";
import { parseGraphCSV } from "@/lib/parser";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { SelectBanner } from "@/components/select-banner";
import type { DijkstraResult, GraphEdge, GraphNode } from "@/types/graph";
import type { GraphWrapper } from "@/dijkstra/dijkstra";
import { reconstructPath } from "./lib/utils";

export default function App() {
  const [graph, setGraph] = React.useState<GraphWrapper | null>(null);
  const [nodes, setNodes] = React.useState<GraphNode[]>([]);
  const [edges, setEdges] = React.useState<GraphEdge[]>([]);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [selectedNodes, setSelectedNodes] = React.useState<GraphNode[]>([]);
  const [shortestPath, setShortestPath] = React.useState<number[]>([]);

  // Load WASM module and initialize the graph
  React.useEffect(() => {
    const loadWasm = async () => {
      try {
        const wasm = await import("./dijkstra");
        await wasm.default();
        const graphInstance = new wasm.GraphWrapper();
        setGraph(graphInstance);
      } catch (error) {
        console.error("Error loading the WASM module", error);
        alert("Failed to load the graph algorithms. Please try again.");
      }
    };

    loadWasm();
  }, []);

  function handleNodeSelection(node: GraphNode) {
    if (shortestPath.length > 0) {
      setShortestPath([]);
    }

    // we check if the node is already selected
    const index = selectedNodes.findIndex((n) => n.id === node.id);
    if (index === -1) {
      if (selectedNodes.length < 2) {
        setSelectedNodes([...selectedNodes, node]);
      } else {
        alert("You can only select up to 2 nodes at a time.");
      }
    } else {
      // if already selected, unselect it
      setSelectedNodes(selectedNodes.filter((n) => n.id !== node.id));
    }
  }

  const handleFileUpload = async (file: File[]) => {
    if (!graph) return;
    try {
      const { nodes, edges } = await parseGraphCSV(file[0], graph);
      setNodes(nodes);
      setEdges(edges);
    } catch (error) {
      console.error(error);
      alert("Error parsing file");
    }
  };

  function computeDijkstra() {
    if (!graph || selectedNodes.length !== 2) return;

    try {
      const result = graph.dijkstra(selectedNodes[0].id);
      // @ts-ignore
      const dijkstraResults: DijkstraResult = Array.from(result).map((item: any) => ({
        vertex: item.vertex,
        predecessor: item.predecessor,
      }));

      const path = reconstructPath(selectedNodes[0].id, selectedNodes[1].id, dijkstraResults);
      setShortestPath(path);

      console.log(selectedNodes[0].id);
      console.log(selectedNodes[1].id);
      console.log(path);
    } catch (error) {
      console.error("Error running Dijkstra's algorithm", error);
      alert("Failed to compute the shortest path. Please check your graph.");
    }
  }

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (nodes.length > 0) {
    return (
      <main className="relative w-full min-h-svh">
        {selectedNodes.length < 2 && (
          <div className="absolute z-50 top-4 left-1/2 transform -translate-x-1/2">
            <SelectBanner />
          </div>
        )}
        <Graph
          nodes={nodes}
          edges={edges}
          width={dimensions.width}
          height={dimensions.height}
          selectedNodes={selectedNodes}
          onNodeSelection={handleNodeSelection}
          shortestPath={shortestPath}
        />
        <Button
          variant={"hexaly"}
          className="absolute z-50 bottom-4 right-1/2 translate-x-1/2"
          disabled={selectedNodes.length !== 2}
          onClick={computeDijkstra}
        >
          Apply Dijkstra
        </Button>
      </main>
    )
  }

  return (
    <main className="w-full min-h-svh grid place-items-center">
      <div className="max-w-4xl mx-auto">
        <FileUpload onChange={handleFileUpload} />
      </div>
    </main>
  );
}
