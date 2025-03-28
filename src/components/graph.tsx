import * as React from "react";
import * as d3 from "d3";

import { GraphEdge, GraphNode } from "@/types/graph";

interface GraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: number;
  height: number;

  selectedNodes: GraphNode[];
  onNodeSelection: (node: GraphNode) => void;
  shortestPath: number[] | null;

  nodeRadius?: number;
  baseDistance?: number;
  weightDistanceMultiplier?: number;
}

export function Graph({
  nodes,
  edges,
  width,
  height,

  selectedNodes,
  onNodeSelection,
  shortestPath,

  nodeRadius = 10,
  baseDistance = 20,
  weightDistanceMultiplier = 10,
}: GraphProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous rendering

    // Calculate dynamic link distances based on weights
    const maxWeight = Math.max(...edges.map(e => e.weight), 1);
    const linkDistanceScale = d3.scaleLinear()
      .domain([0, maxWeight])
      .range([baseDistance, baseDistance + maxWeight * weightDistanceMultiplier]);

    // Modify link force to use dynamic distances
    const simulation = d3.forceSimulation(nodes as any)
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('link', d3.forceLink(edges)
        .id((d: any) => d.id)
        .distance((d: any) => linkDistanceScale(d.weight))
      );

    // Draw edges
    const link = svg.append('g')
      .selectAll('line')
      .data(edges)
      .enter().append('line')
      .attr('stroke', '#BCBBB5')
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 1);

    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', nodeRadius)
      .attr('fill', (d) => selectedNodes.includes(d) ? '#EF5F00' : '#63635E')
      // @ts-ignore
      .on('click', (event, d) => {
        onNodeSelection(d);
      });

    // Node labels
    svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .text((d) => d.id)
      .attr('font-size', 12)
      .attr('fill', '#FFFFFF')
      .attr('dx', 12)
      .attr('dy', 4);

    // Update positions on each tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });

    if (shortestPath) {
      // Color nodes in the shortest path
      svg.selectAll('circle')
        .attr('fill', (d: any) => shortestPath.includes(d.id) ? '#EF5F00' : (selectedNodes.includes(d) ? '#EF5F00' : '#63635E'));

      // Color edges in the shortest path
      svg.selectAll('line')
        .attr('stroke', (d: any) => {
          //const isPartOfShortestPath = (shortestPath.includes(d.source.id) && shortestPath.includes(d.target.id));
          const isPartOfShortestPath = shortestPath.some((node, index) =>
            index < shortestPath.length - 1 &&
            node === d.source.id &&
            shortestPath[index + 1] === d.target.id
          );

          return isPartOfShortestPath ? '#EF5F00' : '#BCBBB5';
        });
    }
  }, [nodes, edges, selectedNodes, shortestPath, width, height]);

  return <svg width={width} height={height} ref={svgRef} />;
}
