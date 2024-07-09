import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { RouterOutput } from "@/server/api/root";
import { formatDate } from "@/utils/date";

import Box from "./box";

interface sheetPageProperties {
  title: string;
  lastUpdated: Date;
  index: number;
  page: NonNullable<RouterOutput["sheets"]["get"]>["pages"][0];
}

const sheetPage: React.FC<sheetPageProperties> = ({
  title,
  lastUpdated,
  index,
  page,
}) => {
  return (
    <div className="m-4 flex h-[1485px] w-[1050px] flex-col overflow-hidden rounded-md border-2 border-secondary bg-secondary/5 p-8 pt-3 backdrop-blur-sm">
      <div className="flex w-full flex-row justify-between">
        <p></p>
        <h1>{title}</h1>
        <p></p>
      </div>
      <div className="flex w-full flex-row justify-between">
        <p></p>
        <h2 className="m-2 rounded-md bg-primary p-1 px-2 text-2xl text-background">
          {page.title}
        </h2>
        <p></p>
      </div>
      <div className="mr-3 h-[1285px]">
        {/* 2 columns */}
        <div className="flex h-full w-full flex-col flex-wrap gap-3 pt-3">
          {/* <Box title="Title 1" /> */}
          {page.blocks.map((box) => (
            <Box
              key={box.id}
              title={box.title}
              markdown={box.markdown}
              type={box.type}
            />
          ))}
          <button className="rounded-xl bg-primary/5 text-2xl">
            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
          </button>
        </div>
      </div>
      <div className="flex w-full flex-row justify-between">
        <p className="w-96 text-2xl">made by Ingmar with ❤️</p>
        <p className="text-center text-4xl">-{index + 1}-</p>
        {/* <p className="text-2xl w-96 text-right">July 4, 2024</p> */}
        <p className="w-96 text-right text-2xl">{formatDate(lastUpdated)}</p>
      </div>
    </div>
  );
};

export default sheetPage;
