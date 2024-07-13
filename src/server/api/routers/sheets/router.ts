import { BlockType } from "@prisma/client";
import cuid from "cuid";
import { z } from "zod";

import { createTRPCRouter } from "@/server/api/trpc";
import { publicProcedure } from "@/server/api/trpc";
import { normalizeMarkdown } from "@/utils/normalize-markdown";

import { NotFoundError } from "../shared/errors";

export const sheetsRouter = createTRPCRouter({
  get: publicProcedure
    .meta({
      openapi: {
        description: "Get a sheet by id",
        tags: ["sheet"],
        method: "GET",
        path: "/sheet/:id",
      },
    })
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const sheet = ctx.prisma.sheet.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          title: true,
          updatedAt: true,
          pages: {
            select: {
              id: true,
              index: true,
              title: true,
              blocks: {
                select: {
                  title: true,
                  id: true,
                  type: true,
                  markdown: true,
                  index: true,
                },
                orderBy: {
                  index: "asc",
                },
              },
            },
          },
        },
      });

      if (sheet === undefined || sheet === null) {
        throw new NotFoundError("Sheet");
      }

      return sheet;
    }),

  create: publicProcedure
    .meta({
      openapi: {
        description: "Create a sheet",
        tags: ["sheet"],
        method: "POST",
        path: "/sheet",
      },
    })
    .mutation(async ({ ctx }) => {
      const sheet = ctx.prisma.sheet.create({
        data: {
          title: "New Sheet",
        },
      });

      return sheet;
    }),

  update: publicProcedure
    .meta({
      openapi: {
        description: "Update a sheet by id",
        tags: ["sheet"],
        method: "PATCH",
        path: "/sheet/:id",
      },
    })
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const sheet = ctx.prisma.sheet.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          updatedAt: new Date(),
        },
      });

      return sheet;
    }),

  list: publicProcedure
    .meta({
      openapi: {
        description: "List all sheets",
        tags: ["sheet"],
        method: "GET",
        path: "/sheet/list",
      },
    })
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const sheets = ctx.prisma.sheet.findMany({
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
      });

      return sheets;
    }),

  importFromMarkdown: publicProcedure
    .meta({
      openapi: {
        description: "Import a sheet from markdown",
        tags: ["sheet"],
        method: "POST",
        path: "/sheet/import",
      },
    })
    .input(z.object({ id: z.string(), markdown: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const sheet = ctx.prisma.sheet.findUnique({
        where: {
          id: input.id,
        },
      });

      if (sheet === undefined || sheet === null) {
        throw new NotFoundError("Sheet");
      }
      // delete old pages
      await ctx.prisma.page.deleteMany({
        where: {
          sheetId: input.id,
        },
      });

      // clean markdown
      const markdown = normalizeMarkdown(input.markdown);


      // for each # create new page with in for each ## create new block
      const pages: {
        title: string;
        blocks: {
          title: string;
          type: BlockType;
          markdown: string;
          index: number;
        }[];
      }[] = [];
      let blockIndex = 0;
      for (const [, line] of markdown.split("\n").entries()) {
        if (line.startsWith("##")) {
          let title = line.replace("##", "").trim();

          let type: BlockType = BlockType.DEFAULT;
          const lastChar = line.slice(-1);
          console.log(lastChar);
          switch (lastChar) {
            case ".": {
              type = BlockType.INFO;
              break;
            }
            case "?": {
              type = BlockType.HINT;
              break;
            }
            case "!": {
              type = BlockType.WARNING;
              break;
            }
            case "$": {
              type = BlockType.ERROR;
              break;
            }
            default: {
              type = BlockType.DEFAULT;
              break;
            }
          }

          if (type !== BlockType.DEFAULT) {
            title = title.slice(0, -1);
            console.log(`Found type ${type} for title ${title}`);
          }

          const lastPage = pages.at(-1);
          lastPage!.blocks.push({
            type,
            title,
            markdown: "",
            index: blockIndex++,
          });
        } else if (line.startsWith("#")) {
          blockIndex = 0;
          pages.push({
            title: line.replace("#", "").trim(),
            blocks: [],
          });
        } else {
          const lastPage = pages.at(-1);
          const lastBlock = lastPage!.blocks[lastPage!.blocks.length - 1];
          if (lastBlock) lastBlock.markdown += line + "\n";
        }
      }

      const pageIDs = pages.map(() => cuid());

      // create pages
      await ctx.prisma.page.createMany({
        data: pages.map((page, index) => {
          return {
            sheetId: input.id,
            title: page.title,
            index: index,
            id: pageIDs[index],
          };
        }),
      });

      // create blocks
      const blocks = pages.flatMap((page, index) => {
        return page.blocks.map((block) => {
          return {
            title: block.title,
            pageId: pageIDs[index]!,
            type: block.type,
            markdown: block.markdown,
            index: block.index,
          };
        });
      });

      await ctx.prisma.block.createMany({
        data: blocks,
      });

      return sheet;
    }),


  exportToMarkdown: publicProcedure
    .meta({
      openapi: {
        description: "Export a sheet to markdown",
        tags: ["sheet"],
        method: "GET",
        path: "/sheet/export/:id",
      },
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ markdown: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const sheet = await ctx.prisma.sheet.findUnique({
        where: {
          id: input.id,
        },
        select: {
          title: true,
          pages: {
            select: {
              title: true,
              blocks: {
                select: {
                  title: true,
                  markdown: true,
                  type: true,
                },
                orderBy: {
                  index: "asc",
                },
              },
            },
            orderBy: {
              index: "asc",
            },
          },
        },
      });

      if (sheet === undefined || sheet === null) {
        throw new NotFoundError("Sheet");
      }

      let markdown = "";

      for (const page of sheet.pages) {
        markdown += `# ${page.title}\n\n`;

        for (const block of page.blocks) {
          let type = "";
          switch (block.type) {
            case BlockType.INFO: {
              type = ".";
              break;
            }
            case BlockType.HINT: {
              type = "?";
              break;
            }
            case BlockType.WARNING: {
              type = "!";
              break;
            }
            case BlockType.ERROR: {
              type = "$";
              break;
            }
            default: {
              type = "";
              break;
            }
          }

          markdown += `## ${block.title}${type}\n${block.markdown}\n`;
        }
      }

      return {
        markdown,
      };
    }),
});
