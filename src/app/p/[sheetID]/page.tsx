/* eslint-disable tailwindcss/no-custom-classname */
import Head from "next/head";
import { getServerSession } from "next-auth";

import { DottedBackground } from "@/components/dotted-background";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

import Sheet from "./sheet";

type PageProperties = {
  params: {
    sheetID: string;
  };
};

const Home = async ({ params }: PageProperties) => {
  const session = await getServerSession(authOptions);

  const caller = appRouter.createCaller({ prisma, session });
  const sheet = await caller.sheets.get({ id: params.sheetID });

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
      <DottedBackground />
      <div className="h-full overflow-auto">
        <Sheet sheet={sheet} />
      </div>
    </>
  );
};

export default Home;
/* eslint-enable tailwindcss/no-custom-classname */
