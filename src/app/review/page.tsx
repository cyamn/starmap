import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import { getServerSession } from "next-auth";

import { DottedBackground } from "@/components/dotted-background";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { appRouter } from "@/server/api/root";
import { authOptions } from "@/server/auth";
import { prisma } from "@/server/database";

import BarChart from "./bar-chart";

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
        <div className="mt-10 flex flex-col items-center justify-center gap-8 px-32 py-2 text-primary">
          <div className="flex w-full flex-row justify-center">
            <h1 className="border-x-8 border-primary px-4 text-5xl font-bold">
              Flashcards
            </h1>
          </div>
          <div className="flex w-full flex-row gap-8">
            <Card className="h-96 w-96 rounded-md border border-secondary bg-secondary/25 backdrop-blur-md">
              <CardContent className="flex  h-[440px] flex-col gap-8">
                <div className="flex w-1/2 flex-col items-start gap-2 pt-6 text-gray-400">
                  <span>Average</span>
                  <div className="flex flex-row items-end gap-2">
                    <span className="text-4xl font-bold text-primary">66</span>
                    <span>Cards</span>
                  </div>
                  <span>Last 7 days</span>
                </div>
                <button className="flex flex-row items-center rounded-md bg-secondary p-1 px-2 text-primary">
                  <FontAwesomeIcon className="px-2" icon={faInbox} />
                  Practice todays cards
                </button>
              </CardContent>
              <CardFooter className="h-12"></CardFooter>
            </Card>
            <div className="h-96 w-full">
              <BarChart />
            </div>
            <Card className="w-[550px] rounded-md border border-secondary bg-secondary/25 text-primary backdrop-blur-md">
              <CardContent className="flex  h-[440px] flex-col gap-8">
                <div className="flex flex-row justify-between pt-6 text-gray-400">
                  <div className="flex w-1/2 flex-col items-start gap-2">
                    <span>Time studied</span>
                    <div className="flex flex-row items-end gap-2">
                      <span className="text-4xl font-bold text-primary">3</span>
                      <span>h</span>
                      <span className="text-4xl font-bold text-primary">
                        24{" "}
                      </span>
                      <span>min</span>
                    </div>
                    <span>17 - Jan - 2023</span>
                  </div>
                  <div className="flex w-1/2 flex-col items-start gap-2">
                    <span>Cards studied</span>
                    <div className="flex flex-row items-end gap-2">
                      <span className="text-4xl font-bold text-primary">
                        107
                      </span>
                      <span>cards</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-2">
                  Your performance for flashcard answers
                  <FontAwesomeIcon
                    className="text-info"
                    icon={faCircleQuestion}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-row">
                    <span className="pr-2">❌</span>
                    <span className="w-32">Forgot</span>
                    <div className="flex w-full flex-row items-center gap-2">
                      <div
                        style={{ width: "60%" }}
                        className="h-4 rounded-r-md bg-secondary"
                      ></div>
                      <span className="w-8 font-bold">80%</span>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <span className="pr-2">😬</span>
                    <span className="w-32">Partially</span>
                    <div className="flex w-full flex-row items-center gap-2">
                      <div
                        style={{ width: "80%" }}
                        className="h-4 rounded-r-md bg-secondary"
                      ></div>
                      <span className="w-8 font-bold">100%</span>
                    </div>
                  </div>
                  <div className="flex flex-row">
                    <span className="pr-2">😁</span>
                    <span className="w-32">Recalled</span>
                  </div>
                  <div className="flex flex-row">
                    <span className="pr-2">👑</span>
                    <span className="w-32">Easy</span>
                  </div>
                  <div className="flex flex-row">
                    <span className="pr-2">⏩</span>
                    <span className="w-32">Skips</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="h-12">
                <div className="flex flex-row gap-2">
                  <p>Last activity</p>
                  <p className="font-bold">20 min</p>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="flex w-full flex-row justify-between">
            <span>Jump Back in</span>
            <div className="flex flex-row gap-2 text-2xl">
              <FontAwesomeIcon icon={faCircleChevronLeft} />
              <FontAwesomeIcon icon={faCircleChevronRight} />
            </div>
          </div>
          <div className="flex flex-row gap-8">
            <div className="h-64 w-[450px] rounded-md border border-secondary bg-secondary/25 backdrop-blur-md"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
