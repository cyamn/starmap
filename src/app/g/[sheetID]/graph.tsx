"use client";

import { BlockType } from "@prisma/client";
import { extend } from "@react-three/fiber";
import React, { useCallback, useEffect, useRef } from "react";
import { ForceGraph3D } from "react-force-graph";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import { RouterOutput } from "@/server/api/root";

extend({ UnrealBloomPass, EffectComposer, RenderPass });

interface graphProperties {
  sheet: NonNullable<RouterOutput["sheets"]["get"]>;
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

function createGraphFromSheet(
  sheet: NonNullable<RouterOutput["sheets"]["get"]>,
): GraphData {
  const nodes: Node[] = sheet.pages.flatMap((page) =>
    page.blocks.map((block) => ({
      id: block.id,
      name: block.title,
      color: TypeToColor[block.type],
      value: 1,
    })),
  );

  const rootNode = {
    id: "root",
    name: sheet.title,
    color: "hsl(250, 60%, 60%)",
    value: 12,
  };

  nodes.push(rootNode);

  // Link the path through the blocks in a page
  const links: Link[] = sheet.pages.flatMap((page) => {
    const blocks = page.blocks;
    const links: Link[] = [];
    links.push({
      source: rootNode.id,
      target: blocks[0].id,
      value: 4,
    });
    for (let index = 0; index < blocks.length - 1; index++) {
      links.push({
        source: blocks[index].id,
        target: blocks[index + 1].id,
        value: 4,
      });
    }
    return links;
  });

  return { nodes, links };
}

const Graph: React.FC<graphProperties> = ({ sheet }) => {
  const data: GraphData = createGraphFromSheet(sheet);

  const fgReference = useRef<any>();

  const handleClick = useCallback(
    (node) => {
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
      const bloomPass = new UnrealBloomPass(resolution, 0.15, 0.5, 0.1);

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
      nodeColor={(node: Node) => node.color}
      linkColor={"#FF0000"}
      nodeResolution={16}
      // numDimensions={2}
      linkDirectionalParticles="value"
      linkDirectionalParticleWidth={(d) => d.value * 0.5}
      linkDirectionalParticleSpeed={(d) => d.value * 0.001}
      enableNodeDrag={false}
      onNodeRightClick={handleClick}
      nodeVal={(node: Node) => node.value}
    />
  );
};

export default Graph;
