// Sheet.tsx
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import classNames from "classnames";
import React from "react";

export type TopicNode = Node<
  {
    label?: string;
    focused: boolean;
  },
  "topic"
>;

export default function TopicNode(properties: NodeProps<TopicNode>) {
  return (
    <div
      className={classNames(
        "relative -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-secondary bg-secondary/25 p-4 text-primary backdrop-blur-md",
        {
          "outline outline-4 outline-offset-8 outline-primary":
            properties.data.focused,
        },
      )}
    >
      <h2 className="text-xl">{properties.data.label}</h2>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Handle type="source" position={Position.Bottom} id="a" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Handle type="target" position={Position.Bottom} id="b" />
      </div>
    </div>
  );
}
