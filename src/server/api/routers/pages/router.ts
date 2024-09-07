import { z } from "zod";

import { createTRPCRouter } from "@/server/api/trpc";
import { publicProcedure } from "@/server/api/trpc";

import { NotFoundError } from "../shared/errors";

export const pagesRouter = createTRPCRouter({
  add: publicProcedure
    .meta({
      openapi: {
        description: "Add a page to a sheet",
        tags: ["page"],
        method: "POST",
        path: "/page/:sheetID",
      },
    })
    .input(z.object({ sheetID: z.string(), index: z.number().optional() }))
    .mutation(async ({ input, ctx }) => {
      const sheet = await ctx.prisma.sheet.findUnique({
        where: {
          id: input.sheetID,
        },
      });

      if (!sheet) {
        throw new NotFoundError("Sheet");
      }

      const page = await ctx.prisma.page.create({
        data: {
          sheet: {
            connect: {
              id: sheet.id,
            },
          },
          index: input.index,
        },
      });

      return page;
    }),

  delete: publicProcedure
    .meta({
      openapi: {
        description: "Delete a page",
        tags: ["page"],
        method: "DELETE",
        path: "/page/:id"
      }
    })
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const page = await ctx.prisma.page.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!page) {
        throw new NotFoundError("Page");
      }

      await ctx.prisma.page.delete({
        where: {
          id: page.id,
        },
      });

      return page;
    }),
});
