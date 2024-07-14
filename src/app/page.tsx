/* eslint-disable tailwindcss/no-custom-classname */
import Head from "next/head";
import Link from "next/link";

import { DottedBackground } from "@/components/dotted-background";

const Home = () => {
  // const session = await getServerSession(authOptions);
  return (
    <>
      <Head>
        <title>Web App Gen</title>
        <meta name="description" content="Generate  by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DottedBackground />
      <div className="flex min-h-screen flex-col items-center justify-center py-2 text-primary">
        <h1 className="text-6xl font-bold">Start learning about topic today</h1>
        <p className="mt-3 text-2xl">Create/Explore/Share Cheat sheets</p>
        <Link href="/s">
          <button className="primary z-0 w-64 cursor-pointer rounded-md border-2 border-secondary bg-background/5 p-2 text-center text-lg font-semibold text-[#8D7CDE] no-underline  backdrop-blur-xl transition hover:bg-[#8D7CDE]/90 hover:text-background">
            Start here
          </button>
        </Link>
      </div>
    </>
  );
};

export default Home;
/* eslint-enable tailwindcss/no-custom-classname */
