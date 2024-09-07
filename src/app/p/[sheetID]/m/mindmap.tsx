/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
"use client";

import "@xyflow/react/dist/style.css";

import {
  addEdge,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { RouterOutput } from "@/server/api/root";
import { api } from "@/utils/api";

import { TypeToColor } from "../../../g/[sheetID]/graph";
import Box from "./box";
import Sheet from "./sheet";
import Topic from "./topic";

const nodeTypes: NodeTypes = {
  sheet: Sheet,
  topic: Topic,
  box: Box,
};

type Sheet = NonNullable<RouterOutput["sheets"]["get"]>;

type Map = {
  nodes: Node[];
  edges: Edge[];
};

const NODE_DISTANCE = 300;

function createMapFromSheet(sheet: Sheet, focused_id: string = ""): Map {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  nodes.push({
    id: "sheet",
    type: "sheet",
    position: { x: 0, y: 0 },
    data: { label: sheet.title, focused: focused_id === "sheet" },
  });

  const childNodeCount = sheet.pages.length;
  const angle = (2 * Math.PI) / childNodeCount;

  sheet.pages.map((page, index) => {
    const id = `topic-${page.id}`;
    const x = 1.7 * NODE_DISTANCE * Math.cos(angle * index);
    const y = 1.7 * NODE_DISTANCE * Math.sin(angle * index);
    nodes.push({
      id,
      type: "topic",
      position: {
        x,
        y,
      },
      data: { label: page.title, focused: focused_id === id },
    });

    edges.push({
      id: `sheet-${id}`,
      source: "sheet",
      target: id,
      type: "straight",
      style: { strokeWidth: 3, stroke: "hsl(250, 60%, 40%)" },
    });

    // blocks
    const blockCount = page.blocks.length;
    const childCountBound = Math.min(childNodeCount, 4);
    const box_angle_space = Math.min(
      ((2 * Math.PI) / childCountBound) * 2,
      1.5 * Math.PI,
    );
    const box_angle = box_angle_space / blockCount;

    page.blocks.map((block, blockIndex) => {
      const block_id = `block-${block.id}`;
      nodes.push({
        id: block_id,
        type: "box",
        position: {
          x:
            x +
            NODE_DISTANCE *
              Math.cos(
                box_angle * blockIndex - 0.5 * box_angle_space + index * angle,
              ),
          y:
            y +
            NODE_DISTANCE *
              Math.sin(
                box_angle * blockIndex - 0.5 * box_angle_space + index * angle,
              ),
        },
        data: {
          label: block.title,
          type: block.type,
          markdown: block.markdown,
          focused: focused_id === block_id,
          sheet: sheet.id,
        },
        zIndex: focused_id === block_id ? 10 : -10,
        parentId: id,
      });
      edges.push({
        id: `${id}-${block_id}`,
        source: id,
        target: block_id,
        type: "straight",
        style: { strokeWidth: 2, stroke: TypeToColor[block.type] },
      });
    });
  });

  return {
    nodes,
    edges,
  };
}

interface MindmapProperties {
  sheet: Sheet;
}

const Mindmap: React.FC<MindmapProperties> = ({ sheet: sheetPrefetched }) => {
  const context = api.useUtils();

  const { data: sheetRefetched } = api.sheets.get.useQuery({
    id: sheetPrefetched.id,
  });

  const [nextID, setNextID] = useState<string | null>(null);
  const [nextNextID, setNextNextID] = useState<string | null>(null);
  const [focused, setFocused] = useState<Node | null>(null);

  const { mutate: addTopic } = api.pages.add.useMutation({
    onSuccess: async (data) => {
      console.log("added topic");
      await context.sheets.get.invalidate({ id: sheet.id });

      setNextID(`topic-${data.id}`);
    },
  });

  const { mutate: addBlock } = api.blocks.add.useMutation({
    onSuccess: async (data) => {
      await context.sheets.get.invalidate({ id: sheet.id });
      setNextID(`block-${data.id}`);
    },
  });

  const { mutate: deletePage } = api.pages.delete.useMutation({
    onSuccess: async () => {
      await context.sheets.get.invalidate({ id: sheet.id });
      setNextID(nextNextID);
    },
  });
  const { mutate: deleteBlock } = api.blocks.delete.useMutation({
    onSuccess: async () => {
      await context.sheets.get.invalidate({ id: sheet.id });
      setNextID(nextNextID);
    },
  });

  const sheet = sheetRefetched ?? sheetPrefetched;
  const map: Map = createMapFromSheet(sheet);
  const [nodes, setNodes, onNodesChange] = useNodesState(map.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(map.edges);

  const { fitView, setViewport } = useReactFlow();

  useEffect(() => {
    const map: Map = createMapFromSheet(sheet);
    setNodes(map.nodes);
    setEdges(map.edges);

    // refocus
    if (focused) focus(focused);
  }, [sheet]);

  const onConnect = useCallback(
    (parameters) => {
      setEdges((eds) => addEdge(parameters, eds));
    },
    [setEdges],
  );

  function focus(node: Node) {
    const map: Map = createMapFromSheet(sheet, node.id);
    setNodes(map.nodes);
    setEdges(map.edges);
    setFocused(node);
    fitView({ nodes: [{ id: node.id }], duration: 500, maxZoom: 1 });

    if (divReference.current) {
      divReference.current.focus();
    }
  }

  const handleNodeClick = (event, node: Node) => {
    focus(node);
  };

  function getFirstChild(node: Node | null): Node | undefined {
    if (node === null) {
      // find "sheet" node
      const root = nodes.find((node) => node.id === "sheet");
      return root;
    }

    // leaf
    if (node.type === "box") return node;

    // find first edge with nodeId as source
    const edge = edges.find((edge) => edge.source === node.id);
    if (edge === undefined) return undefined;
    const childId = edge?.target;
    const child = nodes.find((node) => node.id === childId);
    return child;
  }

  function createChild(node: Node) {
    if (node.id.startsWith("sheet")) {
      addTopic({
        sheetID: sheet.id,
      });
    } else if (node.id.startsWith("topic")) {
      const id = node.id.replace("topic-", "");
      addBlock({
        pageID: id,
      });
    }
  }

  function getNextSibling(node: Node): Node | null {
    // reject root
    if (node.type === "sheet") return node;

    // find parentId
    const edgeNumber = edges.findIndex((edge) => edge.target === node.id);
    if (edgeNumber === -1) return node;

    let edge = edges[edgeNumber];
    const parentId = edge?.source;
    let found = false;

    for (let index = edgeNumber + 1; index < edges.length; index++) {
      edge = edges[index];
      if (edge?.source === parentId) {
        found = true;
        break;
      }
    }

    if (!found) return null;

    const siblingId = edge?.target;
    const sibling = nodes.find((node) => node.id === siblingId);
    if (sibling === undefined) return null;
    return sibling;
  }

  function getPreviousSibling(node: Node): Node | null {
    // reject root
    if (node.type === "sheet") return node;

    // find parentId
    const edgeNumber = edges.findIndex((edge) => edge.target === node.id);
    if (edgeNumber === -1) return node;

    let edge = edges[edgeNumber];
    const parentId = edge?.source;
    let found = false;

    for (let index = edgeNumber - 1; index >= 0; index--) {
      edge = edges[index];
      if (edge?.source === parentId) {
        found = true;
        break;
      }
    }

    if (!found) return null;

    const siblingId = edge?.target;
    const sibling = nodes.find((node) => node.id === siblingId);
    if (sibling === undefined) return null;
    return sibling;
  }

  function deleteChild(node: Node) {
    if (node.id.startsWith("sheet")) return;
    const child = getFirstChild(node);
    if (child !== undefined && child.id !== node.id) {
      const proceed = confirm("Delete Node with children?");
      if (!proceed) return;
    }

    if (node.id.startsWith("topic")) {
      const id = node.id.replace("topic-", "");
      deletePage({
        id,
      });
    } else if (node.id.startsWith("block")) {
      const id = node.id.replace("block-", "");
      deleteBlock({
        id,
      });
    }
  }

  function getParent(node: Node, delChild: boolean = false): Node | null {
    // reject root
    if (node.type === "sheet") return node;

    // find parentId
    const edgeNumber = edges.findIndex((edge) => edge.target === node.id);
    if (edgeNumber === -1) return node;

    const edge = edges[edgeNumber];
    const parentId = edge?.source;

    const parent = nodes.find((node) => node.id === parentId);

    // deleteChild
    if (delChild) deleteChild(node);

    if (parent === undefined) return null;
    return parent;
  }

  // Create a ref for the div element
  const divReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus the div when the component mounts
    if (divReference.current) {
      divReference.current.focus();
    }
  }, []);

  function addSibling(node: Node) {
    if (node.id.startsWith("topic")) {
      addTopic({
        sheetID: sheet.id,
      });
    } else if (node.id.startsWith("block")) {
      const parent = getParent(node);
      if (parent === null) return;
      const id = parent.id.replace("topic-", "");
      addBlock({
        pageID: id,
      });
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Tab": {
        console.log("Tab");
        if (focused === null) break;
        const next = getFirstChild(focused);
        if (next === undefined) createChild(focused);
        else focus(next);
        event.preventDefault();
        break;
      }
      case "Enter": {
        console.log("Enter");
        if (focused === null) break;
        const next = event.shiftKey
          ? getPreviousSibling(focused)
          : getNextSibling(focused);
        if (next === null) {
          addSibling(focused);
        } else {
          focus(next);
        }
        break;
      }
      case "Backspace": {
        console.log("Backspace key pressed in parent");
        if (focused === null) break;

        const nnext = event.shiftKey ? getPreviousSibling(focused) : null;

        const next = getParent(focused, event.shiftKey);
        if (next === null) break;
        else focus(next);

        if (event.shiftKey) {
          // focus sibling instead
          if (nnext === null) {
            setNextNextID(next.id);
          } else {
            setNextNextID(nnext.id);
            focus(nnext);
          }
        }
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <div
      ref={divReference} // Attach the ref to the div
      tabIndex={0} // Ensure the div is focusable
      className="h-screen w-full bg-transparent"
      onKeyDown={handleKeyDown}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => {
          // call the actual change handler to apply the node changes to your nodes
          onNodesChange(changes);

          // loop through the changes and check for a dimensions change that relates to the node we want to focus
          for (const change of changes) {
            if (
              change.type === "dimensions" &&
              nextID === change.id &&
              change.dimensions &&
              change.dimensions.height > 0 &&
              change.dimensions.width > 0
            ) {
              const node = nodes.find((node) => node.id === nextID);
              if (node !== undefined) focus(node);

              // reset the focus id so we don't retrigger fit view when the dimensions of this node happen to change
              setNextID(null);
            }
          }
        }}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default Mindmap;

/* eslint-enable max-lines-per-function */
/* eslint-enable max-lines */
