import * as React from "react";

import { Graph } from "@/components/graph";
import { parseGraphCSV } from "@/lib/parser";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { SelectBanner } from "@/components/select-banner";
import type { GraphEdge, GraphNode } from "@/types/graph";
import type { GraphWrapper } from "@/dijkstra/dijkstra";

export default function App() {
  const [graph, setGraph] = React.useState<GraphWrapper | null>(null);
  const [nodes, setNodes] = React.useState<GraphNode[]>([]);
  const [edges, setEdges] = React.useState<GraphEdge[]>([]);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const [selectedNodes, setSelectedNodes] = React.useState<GraphNode[]>([]);

  function handleNodeSelection(node: GraphNode) {
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

  React.useEffect(() => {
    import("./dijkstra").then(async (wasm) => {
      await wasm.default();
      const graph = new wasm.GraphWrapper();
      setGraph(graph);
    });
  }, []);

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
        />
        <Button
          variant={"hexaly"}
          className="absolute z-50 bottom-4 right-1/2 translate-x-1/2"
          disabled={selectedNodes.length !== 2}
          onClick={() => alert("Compute")}
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
