import { prisma } from "src/server/database";

import { InternalError } from "../shared/errors";
import { Graph, Node } from "./shema";

export async function getGraph(): Promise<Graph> {
  const blocks = await prisma.block.findMany({
    select: {
      id: true,
      title: true,
      type: true,
    },
  });

  const links = await prisma.link.findMany({
    select: {
      source: true,
      target: true,
      value: true,
    },
  });

  if (!blocks || !links) {
    throw new InternalError("Could not build graph");
  }

  const nodes: Node[] = blocks.map((block) => ({
    id: block.id,
    name: block.title,
    type: block.type,
    value: 1,
  }));

  return { nodes: nodes, links };
}