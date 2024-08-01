import { BlockType, QuestionCard } from "@prisma/client";
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

  delete: publicProcedure
    .meta({
      openapi: {
        description: "Delete a block",
        tags: ["block"],
        method: "DELETE",
        path: "/block/:id",
      },
    })
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const block = await ctx.prisma.block.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!block) {
        throw new NotFoundError("Block");
      }

      await ctx.prisma.block.delete({
        where: {
          id: block.id,
        },
      });

      return block;
    }),

  get: publicProcedure
    .meta({
      openapi: {
        description: "Get a block",
        tags: ["block"],
        method: "GET",
        path: "/block/:id",
      },
    })
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const block = await ctx.prisma.block.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          title: true,
          markdown: true,
          type: true,
          page: {
            select: {
              sheet: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      });

      if (!block) {
        throw new NotFoundError("Block");
      }

      return block;
    }),

  getQuestions: publicProcedure
    .meta({
      openapi: {
        description: "Get questions from a block",
        tags: ["block"],
        method: "GET",
        path: "/block/questions/:id",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.array(z.object({ question: z.string(), answer: z.string() })))
    .query(async ({ input, ctx }) => {
      const questions: QuestionCard[] = await ctx.prisma.questionCard.findMany({
        where: {
          blockId: input.id,
        },
      });

      if (questions === undefined || questions === null) {
        throw new NotFoundError("Questions");
      }

      return questions;
    }),
});
