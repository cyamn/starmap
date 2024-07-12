import { BlockType } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter } from "@/server/api/trpc";
import { publicProcedure } from "@/server/api/trpc";

import { NotFoundError } from "../shared/errors";

export const blocksRouter = createTRPCRouter({
  add: publicProcedure
    .meta({
      openapi: {
        description: "Add a block to a page",
        tags: ["block"],
        method: "POST",
        path: "/block/:pageID",
      },
    })
    .input(z.object({ pageID: z.string(), index: z.number().optional() }))
    .mutation(async ({ input, ctx }) => {
      const page = await ctx.prisma.page.findUnique({
        where: {
          id: input.pageID,
        },
      });

      if (!page) {
        throw new NotFoundError("Page");
      }

      const block = await ctx.prisma.block.create({
        data: {
          page: {
            connect: {
              id: page.id,
            },
          },
          index: input.index,
          title: "New Block",
          markdown: "",
          type: BlockType.DEFAULT,
        },
      });

      return block;
    }),

  update: publicProcedure
    .meta({
      openapi: {
        description: "Update a block",
        tags: ["block"],
        method: "PATCH",
        path: "/block/:id",
      },
    })
    .input(z.object({ id: z.string(), title: z.string().optional(), markdown: z.string().optional(), type: z.nativeEnum(BlockType).optional(), index: z.number().optional() }))
    .mutation(async ({ input, ctx }) => {
      const block = await ctx.prisma.block.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!block) {
        throw new NotFoundError("Block");
      }

      const updatedBlock = await ctx.prisma.block.update({
        where: {
          id: block.id,
        },
        data: {
          title: input.title ?? block.title,
          markdown: input.markdown ?? block.markdown,
          type: input.type ?? block.type,
          index: input.index ?? block.index,
        },
      });

      return updatedBlock;
    }),
});
