"use client";

import { BlockType } from "@prisma/client";
import { extend } from "@react-three/fiber";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { ForceGraph3D } from "react-force-graph";
import { RouterOutput } from "src/server/api/root";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

extend({ UnrealBloomPass, EffectComposer, RenderPass });

interface graphProperties {
  graph: RouterOutput["graph"]["get"];
  setBlockId: React.Dispatch<React.SetStateAction<string | null>>;
}

interface Node {
  id: string;
  name: string;
  color: string;
  value: number;
  type: BlockType;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const TypeToColor = {
  [BlockType.DEFAULT]: "hsl(201, 65%, 88%)",
  [BlockType.INFO]: "#52A7E0",
  [BlockType.HINT]: "#70EE9C",
  [BlockType.WARNING]: "#FFF07C",
  [BlockType.ERROR]: "#FC6DAB",
};

type NodeObject = {
  id: string;
  x: number;
  y: number;
  z: number;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
const Graph = forwardRef<{ handleClick: () => void }, graphProperties>(
  ({ graph, setBlockId }, reference) => {
    // !If we don't create a deep copy, the origninal graph will be overwritten and break typesafety
    const data: GraphData = JSON.parse(JSON.stringify(graph)) as GraphData;

    const fgReference = useRef<any>();

    // @ts-expect-error we do not need to export handleClick
    useImperativeHandle(reference, () => ({
      focusNodeById,
    }));

    function focusNodeById(id: string) {
      const node = data.nodes.find((node) => node.id === id);
      if (node) {
        // @ts-expect-error the type is correct because the data type was changed above
        focusNode(node);
      }
    }

    function focusNode(node: NodeObject) {
      // Aim at node from outside it
      const distance = 120;
      const distributionRatio =
        1 + distance / Math.hypot(node.x, node.y, node.z);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      fgReference.current.cameraPosition(
        {
          x: node.x * distributionRatio,
          y: node.y * distributionRatio,
          z: node.z * distributionRatio,
        }, // new position
        node, // lookAt ({ x, y, z })
        1000, // ms transition duration
      );
      setBlockId(node.id);
    }

    const handleClick = useCallback(
      (node: NodeObject) => {
        focusNode(node);
      },
      [fgReference],
    );

    useEffect(() => {
      if (fgReference.current !== undefined) {
        // Create resolution vector
        const resolution = new THREE.Vector2(
          window.innerWidth,
          window.innerHeight,
        );

        // Create UnrealBloomPass with required arguments
        const bloomPass = new UnrealBloomPass(resolution, 0.1, 0.5, 0.1);

        // Get the post-processing composer and add the bloom pass

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const composer = fgReference.current.postProcessingComposer();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        composer.addPass(bloomPass);
      }
    }, [fgReference]);
    return (
      <ForceGraph3D
        ref={fgReference}
        backgroundColor="#000001"
        nodeOpacity={1}
        graphData={data}
        nodeLabel={(node: Node) => node.name}
        nodeColor={(node: Node) => TypeToColor[node.type]}
        nodeRelSize={3}
        linkColor={"#FF0000"}
        nodeResolution={16}
        enableNodeDrag={false}
        // @ts-expect-error function is defined correctly
        onNodeRightClick={handleClick}
        nodeVal={(node: Node) => node.value}
      />
    );
  },
);
/* eslint-enable react/display-name */
/* eslint-enable @typescript-eslint/no-explicit-any */

export default Graph;
