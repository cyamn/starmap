import Head from "next/head";
import { getServerSession } from "next-auth";

import { DottedBackground } from "@/components/dotted-background";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

import Signin from "./signin";

const Home = async () => {
  const session = await getServerSession(authOptions);

  const caller = appRouter.createCaller({ prisma, session });
  const sheets = await caller.sheets.list({});

  return (
    <>
      <Head>
        <title>Web App Gen</title>
        <meta name="description" content="Generate  by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DottedBackground />
      <div className="overflow-auto">
        <div className="mt-10 flex flex-col items-center justify-center gap-8 py-2 text-primary">
          <h1 className="border-x-8 border-primary px-4 text-5xl font-bold">
            Register
          </h1>
          <Signin />
        </div>
      </div>
    </>
  );
};

export default Home;
