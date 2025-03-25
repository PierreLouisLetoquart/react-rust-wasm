import * as React from "react";

import { FileUpload } from "@/components/file-upload";
import { Graph } from "@/components/graph";
import { parseGraphCSV } from "@/lib/parser";
import type { GraphEdge, GraphNode } from "@/types/graph";

export default function App() {
  const [nodes, setNodes] = React.useState<GraphNode[]>([]);
  const [edges, setEdges] = React.useState<GraphEdge[]>([]);

  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

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

  const handleFileUpload = async (file: File[]) => {
    try {
      const { nodes, edges } = await parseGraphCSV(file[0]);
      setNodes(nodes);
      setEdges(edges);
    } catch (error) {
      console.error(error);
      alert("Error parsing file");
    }
  };

  return (
    <main className="w-full min-h-svh grid place-items-center p-4">
      <section className="w-full max-w-4xl mx-auto">
        {nodes.length > 0 ? (
          <div className="absolute inset-0">
            <Graph
              nodes={nodes}
              edges={edges}
              width={dimensions.width}
              height={dimensions.height}
            />
          </div>
        ) : (
          <FileUpload onChange={handleFileUpload} />
        )}
      </section>
    </main>
  );
}
