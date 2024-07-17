import "./style.css";

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
/* eslint-disable tailwindcss/no-custom-classname */
import Head from "next/head";
import { getServerSession } from "next-auth";
import Box from "src/app/p/[sheetID]/box";
import BoxLabel from "src/app/p/[sheetID]/box-label";
import { appRouter } from "src/server/api/root";
import { authOptions } from "src/server/auth";
import { prisma } from "src/server/database";

import DisplayGraph from "./graph";
import Rebuild from "./rebuild";

type PageProperties = {
  params: {
    sheetID: string;
  };
};

const Home = async ({ params }: PageProperties) => {
  const session = await getServerSession(authOptions);

  const caller = appRouter.createCaller({ prisma, session });
  const sheet = await caller.sheets.get({ id: params.sheetID });
  const graph = await caller.graph.get();

  if (!sheet) {
    return <div>Sheet not found</div>;
  }

  const blocks = sheet.pages.flatMap((page) => page.blocks);
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
      <Head>
        <title>Web App Gen</title>
        <meta name="description" content="Generate  by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <DottedBackground /> */}
      <div className="h-full w-32 overflow-hidden">
        <div className="absolute h-full w-full overflow-hidden bg-background">
          <DisplayGraph graph={graph} />
        </div>
        <div className="absolute left-0 z-10 flex flex-col p-2 text-primary">
          <p>seen 70%</p>
          <p>known 34%</p>
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

            <h2 className="flex flex-row items-center py-4 text-2xl">
              <FontAwesomeIcon
                className="animate-wiggle animate-infinite"
                icon={faRocket}
              />
              <p>Cruising in:</p>
              <p className="border-md ml-3 rounded-md bg-primary p-1 text-background">
                {sheet.title}
              </p>
            </h2>
            <Box
              title={blocks[0].title}
              markdown={blocks[0].markdown}
              type={blocks[0].type}
              id={blocks[0].id}
            />
            <h2 className="flex flex-row items-center pt-4 text-2xl">
              <FontAwesomeIcon icon={faCircleNodes} />
              <p>In proximity:</p>
            </h2>
            <div className="flex max-h-64 flex-col gap-2 overflow-scroll rounded-md border-2 border-secondary p-2">
              {blocks.slice(1, 8).map((block) => (
                <BoxLabel
                  key={block.id}
                  title={block.title}
                  type={block.type}
                />
              ))}
            </div>
            <h2 className="flex flex-row items-center pt-4 text-2xl">
              <FontAwesomeIcon icon={faInfinity} />
              <p>Outbound:</p>
            </h2>
            <div className="flex max-h-64 flex-col gap-2 overflow-scroll rounded-md border-2 border-secondary p-2">
              {blocks.slice(9, 16).map((block) => (
                <BoxLabel
                  key={block.id}
                  title={block.title}
                  type={block.type}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
/* eslint-enable tailwindcss/no-custom-classname */
