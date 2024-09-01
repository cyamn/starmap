/* eslint-disable tailwindcss/no-custom-classname */
import Head from "next/head";

import { DottedBackground } from "@/components/dotted-background";

import Otp from "./otp";

type PageProperties = {
  params: {
    user: string;
  };
};

const Home = async ({ params }: PageProperties) => {
  return (
    <>
      <Head>
        <title>Web App Gen</title>
        <meta name="description" content="Generate  by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DottedBackground />
      <div className="flex h-full w-full flex-col items-center justify-center overflow-auto">
        <Otp userID={params.user} />
      </div>
    </>
  );
};

export default Home;
/* eslint-enable tailwindcss/no-custom-classname */
