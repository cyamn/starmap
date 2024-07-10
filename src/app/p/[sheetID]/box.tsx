import { BlockType } from "@prisma/client";
import React from "react";

import MarkdownWithMath from "@/components/markdown-with-math";
import { cn } from "@/lib/utils";

import BoxLabel from "./box-label";

interface boxProperties {
  id: string;
  title: string;
  type: BlockType;
  markdown: string;
}

// dictionary to map BlockType to color
const TypeToBackgroundTransparentColor = {
  [BlockType.DEFAULT]: "bg-primary/5",
  [BlockType.INFO]: "bg-info/5",
  [BlockType.HINT]: "bg-success/5",
  [BlockType.WARNING]: "bg-warning/5",
  [BlockType.ERROR]: "bg-danger/5",
};

const TypeToBorderColor = {
  [BlockType.DEFAULT]: "border-primary",
  [BlockType.INFO]: "border-info",
  [BlockType.HINT]: "border-success",
  [BlockType.WARNING]: "border-warning",
  [BlockType.ERROR]: "border-danger",
};

const box: React.FC<boxProperties> = ({ title, markdown, type, id }) => {
  const bgColorTransparent = TypeToBackgroundTransparentColor[type];
  const borderColor = TypeToBorderColor[type];

  return (
    <div
      className={cn(
        "text-md w-1/2 rounded-md border-2 p-1 backdrop-blur-sm",
        bgColorTransparent,
        borderColor,
      )}
    >
      <div id={id} className="fixed -translate-x-1 -translate-y-4">
        <BoxLabel title={title} type={type} />
      </div>
      <div className="pt-3">
        <MarkdownWithMath content={markdown} />
      </div>
    </div>
  );
};

export default box;
