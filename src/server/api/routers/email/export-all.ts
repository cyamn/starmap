import { prisma } from "@/server/database";
import { sheetToMarkdown } from "@/utils/export-markdown";
import { createZipFromMarkdown } from "@/utils/zip-markdown-files";


export async function exportAllSheets() {
  const sheets = await prisma.sheet.findMany({
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

  const markdowns = sheets.map((sheet) => {
    return sheetToMarkdown(sheet);
  });

  const titles = sheets.map((sheet) => {
    return sheet.title;
  });

  const zipped = await createZipFromMarkdown(titles, markdowns);
  return zipped;
}