"use client";

import {
  faArrowsToCircle,
  faBurst,
  faCircleNodes,
  faFilter,
  faInfinity,
  faRocket,
  faSatelliteDish,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import Box from "src/app/p/[sheetID]/box";

import BoxLabel from "@/app/p/[sheetID]/box-label";
import { RouterOutput } from "@/server/api/root";
import { api } from "@/utils/api";

import DisplayGraph from "./graph";
import { getNearestNeighbors, Neighbor } from "./neighbors";
import Rebuild from "./rebuild";

interface GraphExplorerProperties {
  sheet: NonNullable<RouterOutput["sheets"]["get"]>;
  graph: RouterOutput["graph"]["get"];
}

const GraphExplorer: React.FC<GraphExplorerProperties> = ({ sheet, graph }) => {
  const [blockId, setBlockId] = React.useState<string | null>(null);

  // const childReference = useRef(
  //   <DisplayGraph graph={graph} setBlockId={setBlockId} />,
  // );

  const childReference = useRef();
  const childComponent = useRef(
    <DisplayGraph graph={graph} setBlockId={setBlockId} ref={childReference} />,
  );

  function focusNodeId(id: string) {
    setBlockId(id);
    childReference.current.focusNodeById(id);
  }

  const dummySheetTitles = [
    "Sheet 1",
    "Sheet 2",
    "Sheet 3",
    "Sheet 4",
    "Sheet 5",
    "Sheet 6",
    "Sheet 7",
    "Sheet 8",
    "Sheet 9",
    "Sheet 10",
  ];

  return (
    <>
      <div className="absolute h-full w-full overflow-hidden bg-background">
        {childComponent.current}
      </div>
      <div className="absolute left-0 z-10 flex flex-col p-2 text-primary">
        <p>seen 70%</p>
        <p>known 34%</p>
      </div>
      {/* draw + in center of screen as scope */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 z-30 -translate-x-4 -translate-y-6 text-5xl font-thin text-secondary">
        +
      </div>
      <div className="absolute right-0 z-10 h-full w-[600px] border-l-2 border-secondary bg-background/95 pr-10">
        <div className="m-6 flex h-full w-full flex-col gap-2 text-primary">
          <h1 className="border-x-8 border-primary text-center">
            Star Explorer
          </h1>
          <Rebuild />
          <br />
          <div className="flex flex-row rounded-md border-2 border-secondary p-1">
            <button className="m-1 rounded-md border-2 border-secondary bg-secondary/25 p-1">
              <FontAwesomeIcon icon={faArrowsToCircle} />
            </button>
            <button className="m-1 rounded-md border-2 border-secondary bg-secondary/25 p-1">
              <FontAwesomeIcon icon={faBurst} />
            </button>
            <button className="m-1 rounded-md border-2 border-secondary bg-secondary/25 p-1">
              3D
            </button>
            <button className="m-1 rounded-md border-2 border-secondary bg-secondary/25 p-1">
              <FontAwesomeIcon icon={faFilter} />
            </button>
            <button className="m-1 rounded-md border-2 border-secondary bg-secondary/25 p-1">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <h2 className="flex flex-row items-center pt-4 text-2xl">
            <FontAwesomeIcon icon={faSatelliteDish} />
            <p>Scanning for:</p>
          </h2>
          <div className="flex max-h-64 flex-row flex-wrap overflow-scroll">
            {dummySheetTitles.map((title) => (
              <button
                key={title}
                className="m-1 rounded-md border-2 border-secondary bg-secondary/25 p-1"
              >
                {title}
              </button>
            ))}
          </div>
          {blockId !== null && (
            <BlockPreview
              blockId={blockId}
              graph={graph}
              setBlockId={focusNodeId}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default GraphExplorer;

type BlockPreviewProperties = {
  blockId: string;
  graph: RouterOutput["graph"]["get"];
  setBlockId: (id: string) => void;
};

const BlockPreview: React.FC<BlockPreviewProperties> = ({
  blockId,
  graph,
  setBlockId,
}) => {
  const {
    data: block,
    isLoading,
    error,
  } = api.blocks.get.useQuery({ id: blockId });

  const neighbors: Neighbor[] = getNearestNeighbors(blockId, graph, 8);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <h2 className="flex flex-row items-center py-4 text-2xl">
        <FontAwesomeIcon
          className="animate-wiggle animate-infinite"
          icon={faRocket}
        />
        <p>Cruising in:</p>
        <p className="border-md ml-3 rounded-md bg-primary p-1 text-background">
          {block.page.sheet.title}
        </p>
      </h2>
      <Box
        title={block.title}
        markdown={block.markdown}
        type={block.type}
        id={block.id}
      />
      <h2 className="flex flex-row items-center pt-4 text-2xl">
        <FontAwesomeIcon icon={faCircleNodes} />
        <p>In proximity:</p>
      </h2>
      <div className="flex flex-col gap-2 overflow-scroll rounded-md border-2 border-secondary p-2">
        {/* {blocks.slice(1, 8).map((block) => (
          <BoxLabel key={block.id} title={block.title} type={block.type} />
        ))} */}
        {neighbors.map((neighbor) => (
          <div
            className="cursor-pointer"
            key={neighbor.id}
            onClick={() => {
              setBlockId(neighbor.id);
            }}
          >
            <BoxLabel
              title={neighbor.name ?? neighbor.id}
              type={neighbor.type ?? "DEFAULT"}
            />
          </div>
        ))}
      </div>
      <h2 className="flex flex-row items-center pt-4 text-2xl">
        <FontAwesomeIcon icon={faInfinity} />
        <p>Outbound:</p>
      </h2>
      <div className="flex max-h-64 flex-col gap-2 overflow-scroll rounded-md border-2 border-secondary p-2">
        {/* {blocks.slice(9, 16).map((block) => (
          <BoxLabel key={block.id} title={block.title} type={block.type} />
        ))} */}
      </div>
    </>
  );
};
