"use client";

import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import classNames from "classnames";
import React, { useCallback, useEffect, useState } from "react";

export type SheetNode = Node<
  {
    label?: string;
    focused: boolean;
  },
  "sheet"
>;

const DEBOUNCE_DELAY = 300; // 300ms delay

export default function SheetNode(properties: NodeProps<SheetNode>) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(properties.data.label);

  // Handle keydown events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!properties.data.focused) return;

      if (editing) {
        console.log("Key pressed in child");
        event.stopPropagation();
        switch (event.code) {
          case "Enter": {
            setEditing(false);
            event.preventDefault();
            break;
          }
          default: {
            break;
          }
        }
      } else {
        switch (event.code) {
          case "Space": {
            setEditing(true);
            event.preventDefault();
            break;
          }
          default: {
            break;
          }
        }
      }
    },
    [properties.data.focused, editing],
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

  return (
    <div
      className={classNames(
        "relative -translate-x-1/2 -translate-y-1/2 rounded-md border-4 border-secondary bg-secondary/25 p-4 text-primary backdrop-blur-md",
        {
          "outline outline-4 outline-offset-8 outline-primary":
            properties.data.focused && !editing,
          "outline-double outline-8 outline-offset-8 outline-primary":
            properties.data.focused && editing,
        },
      )}
    >
      {!editing && <h1 className="text-3xl">{title}</h1>}
      {editing && (
        <div className="inline-block">
          <input
            className="m-0 w-fit min-w-fit max-w-fit border-none border-transparent bg-transparent p-0 text-3xl outline-none ring-0 focus:border-transparent focus:ring-0"
            type="text"
            autoFocus
            value={title}
            onInput={(event) => {
              console.log("key in input");
              event.stopPropagation();
              event.preventDefault();
              setTitle(event.currentTarget.value);
            }}
          />
        </div>
      )}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Handle type="source" position={Position.Bottom} id="a" />
      </div>
    </div>
  );
}
