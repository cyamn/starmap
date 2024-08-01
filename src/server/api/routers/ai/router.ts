import { z } from "zod";

import { createTRPCRouter } from "@/server/api/trpc";
import { publicProcedure } from "@/server/api/trpc";

import { NotFoundError } from "../shared/errors";
import { createQuestionsFromBlock } from "./create-questions";

export const aiRouter = createTRPCRouter({
  generateQuestions: publicProcedure
    .meta({
      openapi: {
        description: "Generate questions from a block",
        tags: ["ai"],
        method: "POST",
        path: "/ai/generate-questions",
      },
    })
    .input(z.object({ blockID: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const block = await ctx.prisma.block.findUnique({
        where: {
          id: input.blockID,
        },
        select: {
          markdown: true,
          title: true,
          page: {
            select: {
              title: true,
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

      const questions = await createQuestionsFromBlock(block);

      await ctx.prisma.questionCard.createMany({
        data: questions.map((question) => ({
          question: question.question,
          answer: question.answer,
          blockId: input.blockID,
        })),
      });

      return questions;
    }),

  generateQuestionsForSheet: publicProcedure
    .meta({
      openapi: {
        description: "Generate questions for a sheet",
        tags: ["ai"],
        method: "POST",
        path: "/ai/generate-questions-for-sheet",
      },
    })
    .input(z.object({ sheetID: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const blocks = await ctx.prisma.block.findMany({
        where: {
          page: {
            sheetId: input.sheetID,
          },
          questionCards: {
            none: {},
          },
        },
        select: {
          id: true,
          markdown: true,
          title: true,
          page: {
            select: {
              title: true,
              sheet: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      });

      for (const block of blocks) {
        const questions = await createQuestionsFromBlock(block);

        await ctx.prisma.questionCard.createMany({
          data: questions.map((question) => ({
            question: question.question,
            answer: question.answer,
            blockId: block.id,
          })),
        });
      }

      return true;
    }),

});
