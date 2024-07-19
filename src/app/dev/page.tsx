/* eslint-disable tailwindcss/no-custom-classname */
import Head from "next/head";

import { DottedBackground } from "@/components/dotted-background";

import DevevelopementPanel from "./developement-panel";

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
        <h1>Dev Panel</h1>
        <DevevelopementPanel />
      </div>
    </>
  );
};

export default Home;
/* eslint-enable tailwindcss/no-custom-classname */
