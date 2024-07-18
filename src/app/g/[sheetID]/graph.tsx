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
  sprite?: THREE.Sprite;
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

const Graph = forwardRef<{ handleClick: () => void }, graphProperties>(
  ({ graph, setBlockId }, reference) => {
    // !If we don't create a deep copy, the origninal graph will be overwritten and break typesafety
    const data: GraphData = JSON.parse(JSON.stringify(graph)) as GraphData;

    const fgReference = useRef<any>();

    useImperativeHandle(reference, () => ({
      focusNodeById,
    }));

    function focusNodeById(id: string) {
      const node = data.nodes.find((node) => node.id === id);
      if (node) {
        focusNode(node);
      }
    }

    function focusNode(node) {
      // Aim at node from outside it
      const distance = 120;
      const distributionRatio =
        1 + distance / Math.hypot(node.x, node.y, node.z);

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
      (node) => {
        focusNode(node);
      },
      [fgReference],
    );

    useEffect(() => {
      if (fgReference.current) {
        // Create resolution vector
        const resolution = new THREE.Vector2(
          window.innerWidth,
          window.innerHeight,
        );

        // Create UnrealBloomPass with required arguments
        const bloomPass = new UnrealBloomPass(resolution, 0.1, 0.5, 0.1);

        // Get the post-processing composer and add the bloom pass
        const composer = fgReference.current.postProcessingComposer();
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
        // numDimensions={2}
        // linkDirectionalParticles="value"
        // linkDirectionalParticleWidth={2 * 0.5}
        // linkDirectionalParticleSpeed={(d) => d.value * 0.0001}
        //linkDirectionalArrowLength={(link: Link) => link.value}
        linkLabel={(link: Link) => link.value}
        enableNodeDrag={false}
        onNodeRightClick={handleClick}
        nodeVal={(node: Node) => node.value}
      />
    );
  },
);

export default Graph;
