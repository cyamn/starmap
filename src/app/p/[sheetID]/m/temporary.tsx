// Sheet.tsx
import { Handle, Position } from "@xyflow/react";
import React from "react";

// Box.tsx
export const Box: React.FC = () => {
  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
      }}
    >
      <h3>Box</h3>
      <p>This is a box node</p>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="target" position={Position.Top} id="b" />
    </div>
  );
};
