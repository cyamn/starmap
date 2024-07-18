import { BlockType } from "@prisma/client";

import { RouterOutput } from "@/server/api/root";

export type Neighbor = {
  id: string;
  value: number;
  name?: string;
  type?: BlockType;
}

function getNeighbors(graph: RouterOutput["graph"]["get"], blockId: string): Neighbor[] {
  const incomingLinks = graph.links.filter((link) => link.target === blockId);
  const outgoingLinks = graph.links.filter((link) => link.source === blockId);

  const neighbors: Neighbor[] = [];
  for (const link of incomingLinks) {
    neighbors.push({
      id: link.source,
      value: link.value,
    });
  }
  for (const link of outgoingLinks) {
    neighbors.push({
      id: link.target,
      value: link.value,
    });
  }
  return neighbors.sort((a, b) => a.value - b.value);
}

// find k nearest neighbors (direct or indirect) in the graph by breth first search
export function getNearestNeighbors(blockId: string, graph: RouterOutput["graph"]["get"], k: number): Neighbor[] {
  const visited: Neighbor[] = [];
  const queue: Neighbor[] = [{
    id: blockId,
    value: 0,
  }];
  while (queue.length > 0 && visited.length < k + 1) {
    const current = queue.shift()!;
    // check if current is already visited (if id is in visited)
    if (visited.some((neighbor) => neighbor.id === current.id)) {
      continue;
    }

    visited.push(current);
    console.log(`visiting ${current.id} with value ${current.value}`);
    const neighbors = getNeighbors(graph, current.id);
    console.log(`neighbors: ${neighbors.map((neighbor) => neighbor.id)}`);
    for (const neighbor of neighbors) {
      queue.push({
        id: neighbor.id,
        value: current.value + neighbor.value,
      });
    }
  }
  // remove the first element (the block itself)
  visited.shift();

  // sort visited by distance
  const sorted = visited.sort((a, b) => a.value - b.value);

  // add names from by searching in graph.nodes
  for (const neighbor of sorted) {
    const node = graph.nodes.find((node) => node.id === neighbor.id);
    if (node) {
      neighbor.name = node.name;
      neighbor.type = node.type as BlockType;
    }
  }

  return sorted;
}