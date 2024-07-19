import { Block, BlockType } from "@prisma/client";

type Sheet = {
  title: string;
  pages: {
    title: string;
    blocks: Block[];
  }[];
}


export function sheetToMarkdown(sheet: Sheet): string {
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

  return markdown;
}
