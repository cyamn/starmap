"use client";

// Sheet.tsx
import { BlockType } from "@prisma/client";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";

import { api } from "@/utils/api";

import Box from "../box";
import BoxLabel from "../box-label";

export type BoxNode = Node<
  {
    label: string;
    type: BlockType;
    markdown: string;
    focused: boolean;
    sheet: string;
  },
  "box"
>;

const EditMode = {
  NONE: "NODE",
  HEADER: "HEADER",
  BODY: "BODY",
};

function getNextEnumValue<T extends Record<string, string>>(
  enumObject: T,
  currentValue: T[keyof T],
): T[keyof T] {
  const values = Object.values(enumObject);
  const currentIndex = values.indexOf(currentValue);

  if (currentIndex === -1) {
    throw new Error("Invalid enum value");
  }

  // Cycle back to the first value if at the last one
  const nextIndex = (currentIndex + 1) % values.length;

  return values[nextIndex] as T[keyof T];
}

const DEBOUNCE_DELAY = 300; // 300ms delay

export default function BoxNode(properties: NodeProps<BoxNode>) {
  const [editMode, setEditMode] = useState(EditMode.NONE);
  const [type, setType] = useState(properties.data.type);
  const [title, setTitle] = useState(properties.data.label);

  const context = api.useUtils();
  const { mutate: updateBlock } = api.blocks.update.useMutation({
    onSuccess: async () => {
      await context.sheets.get.invalidate({ id: properties.data.sheet });
    },
  });

  // Handle keydown events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!properties.data.focused) return;

      switch (event.code) {
        case "Space": {
          if (editMode === EditMode.NONE) setEditMode(EditMode.HEADER);
          event.preventDefault();
          break;
        }
        default: {
          break;
        }
      }

      if (editMode === EditMode.HEADER) {
        switch (event.key) {
          case "Tab": {
            const nextType = getNextEnumValue(BlockType, type);
            setType(nextType);

            const id = properties.id.replace("block-", "");
            updateBlock({
              id,
              type: nextType,
            });

            event.preventDefault();
            break;
          }
          default: {
            break;
          }
        }
      }
    },
    [properties.data.focused, type],
  );

  // Attach the keydown event listener with debounce logic
  useEffect(() => {
    let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

    if (properties.data.focused) {
      debounceTimeout = setTimeout(() => {
        window.addEventListener("keydown", handleKeyDown);
      }, DEBOUNCE_DELAY);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [properties.data.focused, handleKeyDown]);

  if (!properties.data.focused)
    return (
      <div className="relative h-fit w-fit -translate-x-1/2 -translate-y-1/2 bg-background">
        <BoxLabel title={title} type={type} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Handle type="source" position={Position.Bottom} id="a" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Handle type="target" position={Position.Bottom} id="b" />
        </div>
      </div>
    );

  return (
    <div
      className={classNames(
        "relative h-fit w-fit -translate-x-1/2 -translate-y-1/2 rounded-md bg-background  ",
        {
          "outline outline-4 outline-offset-8 outline-primary":
            editMode === EditMode.NONE,
          "scale-150 outline-double outline-8 outline-offset-[16px] outline-primary":
            editMode === EditMode.HEADER,
        },
      )}
    >
      <Box
        title={title}
        markdown={properties.data.markdown}
        type={type}
        id=""
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Handle type="source" position={Position.Bottom} id="a" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Handle type="target" position={Position.Bottom} id="b" />
      </div>
    </div>
  );
}
