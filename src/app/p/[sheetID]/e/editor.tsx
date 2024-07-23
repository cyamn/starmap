"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "./style.css";

import {
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
} from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import React from "react";
import { RiInbox2Fill } from "react-icons/ri";

import { RouterOutput } from "@/server/api/root";

import { BoxBlock } from "./box-block";

interface EditorProperties {
  sheet: NonNullable<RouterOutput["sheets"]["get"]>;
}

const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Alert block.
    box: BoxBlock,
  },
});

// Slash menu item to insert an Box block
const insertBox = (editor: typeof schema.BlockNoteEditor) => ({
  title: "Box",
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: "box",
    });
  },
  aliases: ["box", "warning", "error", "info", "success"],
  group: "Other",
  icon: <RiInbox2Fill />,
});

function createBlocksForSheet(
  sheet: NonNullable<RouterOutput["sheets"]["get"]>,
) {
  return sheet.pages.flatMap((page) => {
    const title = {
      type: "heading",
      props: {
        textColor: "default",
        backgroundColor: "default",
        textAlignment: "left",
        level: 1,
      },
      content: [
        {
          type: "text",
          text: page.title,
          styles: {},
        },
      ],
      children: [],
    };
    const blocks = page.blocks.map((block) => {
      return {
        type: "box",
        props: {
          type: block.type,
          title: block.title,
          markdown: block.markdown,
        },
      };
    });
    return [title, ...blocks];
  });
}

const Editor: React.FC<EditorProperties> = ({ sheet }) => {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({ schema });

  const blocks = createBlocksForSheet(sheet);
  editor.replaceBlocks(editor.document, blocks);

  // Renders the editor instance using a React component.
  return (
    <BlockNoteView
      editor={editor}
      data-theming-css-variables-demo
      slashMenu={false}
    >
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          // Gets all default slash menu items and `insertAlert` item.
          filterSuggestionItems(
            [...getDefaultReactSlashMenuItems(editor), insertBox(editor)],
            query,
          )
        }
      />
    </BlockNoteView>
  );
};

export default Editor;
