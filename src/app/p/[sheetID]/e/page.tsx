/* eslint-disable tailwindcss/no-custom-classname */
import Head from "next/head";
import { getServerSession } from "next-auth";

import { DottedBackground } from "@/components/dotted-background";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

import Editor from "./editor";

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
      <div className="flex h-full w-full flex-row justify-center overflow-auto p-4 py-28">
        <div className="h-fit max-w-screen-2xl rounded-md border-2 border-secondary bg-secondary/20 p-2 pt-8">
          <Editor sheet={sheet} />
        </div>
      </div>
    </>
  );
};

export default Home;
/* eslint-enable tailwindcss/no-custom-classname */
