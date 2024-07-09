import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { DottedBackground } from "@/components/dotted-background";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

import CreateSheetButton from "./create-sheet-button";

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
      <div className="h-full overflow-auto">
        <div className="mt-10 flex flex-col items-center justify-center py-2 text-primary">
          <h1 className="text-6xl font-bold">Explore Cheat sheets here</h1>
          <div className="w-full px-24 pt-8">
            <input className="w-full rounded-md border-2 border-primary bg-primary/5" />
          </div>
          <CreateSheetButton />
          <div className="mt-8 grid grid-cols-3 gap-4">
            {sheets.map((sheet) => (
              <button key={sheet.id} className="rounded-md bg-primary p-4">
                <Link
                  href={`/p/${sheet.id}`}
                  className="text-2xl text-background"
                >
                  {sheet.title}
                </Link>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
