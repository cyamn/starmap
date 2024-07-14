import { faPlus, faSearch, faSort } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { getServerSession } from "next-auth";

import { DottedBackground } from "@/components/dotted-background";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

import CreateSheetButton from "./create-sheet-button";
import SheetPreview from "./sheet-preview";

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
          <h1 className="border-x-8 border-primary px-4 text-5xl font-bold">
            Explore {sheets.length} existing Cheat sheets
          </h1>
          <div className="flex w-full flex-row px-32 pt-8">
            <input
              type="text"
              placeholder="Search for cheat sheets"
              className="backdrop:sm h-12 w-full rounded-md border-2 border-secondary bg-secondary/25 placeholder:text-secondary"
            />
            <button>
              <FontAwesomeIcon
                className="ml-1 rounded-md border-2 border-secondary bg-secondary/25 p-3"
                icon={faSearch}
              />
            </button>
            <button>
              <FontAwesomeIcon
                className="ml-1 rounded-md border-2 border-secondary bg-secondary/25 p-3"
                icon={faSort}
              />
            </button>
            <button>
              <FontAwesomeIcon
                className="ml-1 rounded-md border-2 border-secondary bg-secondary/25 p-3"
                icon={faPlus}
              />
            </button>
          </div>
          <div className="flex w-full flex-col gap-2 p-8 px-32">
            {sheets.map((sheet) => (
              <SheetPreview
                key={sheet.id}
                id={sheet.id}
                title={sheet.title}
                pages={sheet.pages}
              />
            ))}
          </div>
          <CreateSheetButton />
        </div>
      </div>
    </>
  );
};

export default Home;
