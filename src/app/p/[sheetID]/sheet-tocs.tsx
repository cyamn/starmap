import React from "react";

import { RouterOutput } from "@/server/api/root";
import { formatDate } from "@/utils/date";
import { nameToInternal } from "@/utils/name-to-internal";

import BoxLabel from "./box-label";

interface sheetTocsProperties {
  pages: NonNullable<RouterOutput["sheets"]["get"]>["pages"];
  title: string;
  lastUpdated: Date;
}

const sheetTocs: React.FC<sheetTocsProperties> = ({
  pages,
  title,
  lastUpdated,
}) => {
  return (
    <div className="m-4 flex h-[1485px] w-[1050px] flex-col overflow-hidden rounded-md border-2 border-secondary bg-secondary/5 p-8 pt-3 backdrop-blur-sm print:m-0 print:h-screen print:w-screen">
      <div className="flex w-full flex-row justify-between">
        <p></p>
        <h1 className="print:text-3xl">{title}</h1>
        <p></p>
      </div>
      <div className="flex w-full flex-row justify-between">
        <p></p>
        <h2 className="m-2 rounded-md bg-primary p-1 px-2 text-2xl text-background">
          Tables of content
        </h2>
        <p></p>
      </div>
      <div className="flex h-full flex-col items-baseline gap-4">
        {pages.map((page, index) => (
          <div key={page.id} className="flex w-full flex-row items-center">
            <a
              href={`#${nameToInternal(page.title)}`}
              className="flex flex-row items-center"
            >
              <h3 className="my-2 w-48 overflow-hidden rounded-l-md border-2 border-primary bg-primary p-1 px-2 text-xl text-background print:w-32 print:text-base">
                {page.title}
              </h3>
              <h3 className="w-12 w-16 rounded-r-md border-2 border-secondary bg-secondary/30 p-1 px-2 text-right text-xl text-primary print:text-base">
                {index + 1}
              </h3>
            </a>
            <div className="m-1 h-full border border-secondary"></div>
            <div className="flex w-full flex-row flex-wrap">
              {page.blocks.map((box) => (
                <a
                  key={box.id}
                  href={`#${nameToInternal(page.title)}:${nameToInternal(
                    box.title,
                  )}`}
                >
                  <div className="m-1 cursor-pointer">
                    <BoxLabel title={box.title} type={box.type} />
                  </div>
                </a>
              ))}
            </div>
            <div className="m-1 h-full border border-secondary"></div>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-row justify-between">
        <p className="w-96 text-2xl print:text-xl">made by Ingmar with ❤️</p>
        <p className="text-center text-4xl print:text-3xl">-0-</p>
        {/* <p className="text-2xl w-96 text-right">July 4, 2024</p> */}
        <p className="w-96 text-right text-2xl">{formatDate(lastUpdated)}</p>
      </div>
    </div>
  );
};

export default sheetTocs;
