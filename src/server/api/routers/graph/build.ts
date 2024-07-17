import { prisma } from "src/server/database";

import { Link } from "./shema";

export async function rebuildGraph() {
  const blocks = await prisma.block.findMany({
    select: {
      id: true,
      title: true,
      type: true,
    },
  });

  const links: Link[] = [];

  // Create random links with random length (chance 1/10) and length 1-10
  for (const block of blocks) {
    for (const target of blocks) {
      if (block.id !== target.id && Math.random() < 0.1) {
        links.push({
          source: block.id,
          target: target.id,
          value: Math.floor(Math.random() * 10) + 1,
        });
      }
    }
  }

  await prisma.link.deleteMany();
  await prisma.link.createMany({
    data: links,
  });
}