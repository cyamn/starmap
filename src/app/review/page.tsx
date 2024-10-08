import Head from "next/head";
import { getServerSession } from "next-auth";

import { DottedBackground } from "@/components/dotted-background";
import { authOptions } from "@/server/auth";

import Flashcards from "./flashcards";
import Profile from "./profile";

const Home = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Head>
        <title>Web App Gen</title>
        <meta name="description" content="Generate  by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DottedBackground />
      <div className="h-full overflow-auto">
        <div className="mt-10 flex flex-col items-center justify-center gap-8 px-32 py-2 text-primary">
          <Profile user={session!.user ?? null} />
          <Flashcards />
        </div>
      </div>
    </>
  );
};

export default Home;
