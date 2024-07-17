import { BlockType } from "@prisma/client";
import { z } from "zod";

export const NodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  type: z.nativeEnum(BlockType),
});

export const LinkSchema = z.object({
  source: z.string(),
  target: z.string(),
  value: z.number(),
});

export const GraphSchema = z.object({
  nodes: z.array(NodeSchema),
  links: z.array(LinkSchema),
});

export type Node = z.infer<typeof NodeSchema>;
export type Link = z.infer<typeof LinkSchema>;
export type Graph = z.infer<typeof GraphSchema>;