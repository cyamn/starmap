import "./style.css";

/* eslint-disable tailwindcss/no-custom-classname */
import Head from "next/head";
import { getServerSession } from "next-auth";
import { appRouter } from "src/server/api/root";
import { authOptions } from "src/server/auth";
import { prisma } from "src/server/database";

import GraphExplorer from "./graph-explorer";

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

  return (
    <>
      <Head>
        <title>Web App Gen</title>
        <meta name="description" content="Generate  by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <DottedBackground /> */}
      <div className="h-full w-32 overflow-hidden">
        <GraphExplorer sheet={sheet} graph={graph} />
      </div>
    </>
  );
};

export default Home;
/* eslint-enable tailwindcss/no-custom-classname */
