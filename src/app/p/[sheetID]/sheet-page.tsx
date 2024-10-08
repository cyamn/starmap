import React from "react";

import { RouterOutput } from "@/server/api/root";
import { formatDate } from "@/utils/date";
import { nameToInternal } from "@/utils/name-to-internal";

import BoxContextMenu from "./box-context-menu";
import CreateBoxButton from "./create-box-button";

interface sheetPageProperties {
  title: string;
  lastUpdated: Date;
  index: number;
  page: NonNullable<RouterOutput["sheets"]["get"]>["pages"][0];
  setDialogComponent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  sheetID: string;
}

const sheetPage: React.FC<sheetPageProperties> = ({
  title,
  lastUpdated,
  index,
  page,
  setDialogComponent,
  sheetID,
}) => {
  return (
    <div
      id={`${nameToInternal(page.title)}`}
      className="m-4 flex h-[1485px] w-[1050px] flex-col overflow-hidden rounded-md border-2 border-secondary bg-secondary/5 p-8 pt-3 backdrop-blur-sm print:m-0 print:h-screen print:w-screen"
    >
      <div className="flex w-full flex-row justify-between">
        <p></p>
        <a href="#top">
          <h1 className="print:text-3xl">{title}</h1>
        </a>
        <p></p>
      </div>
      <div className="flex w-full flex-row justify-between">
        <p></p>
        <h2 className="m-2 rounded-md bg-primary p-1 px-2 text-2xl text-background print:text-xl">
          {page.title}
        </h2>
        <p></p>
      </div>
      <div className="mr-3 h-[1285px] print:h-[950px]">
        {/* 2 columns */}
        <div className="flex h-full w-full flex-col flex-wrap gap-5 pt-3">
          {/* <Box title="Title 1" /> */}
          {page.blocks.map((box) => (
            <BoxContextMenu
              id={`${nameToInternal(page.title)}:${nameToInternal(box.title)}`}
              uuid={box.id}
              key={box.id}
              title={box.title}
              markdown={box.markdown}
              type={box.type}
              setDialogComponent={setDialogComponent}
              sheetID={sheetID}
            />
          ))}
          <CreateBoxButton
            setDialogComponent={setDialogComponent}
            pageID={page.id}
            boxes={page.blocks.length}
            sheetID={sheetID}
          />
        </div>
      </div>
      <div className="flex w-full flex-row justify-between">
        <p className="w-96 text-2xl print:text-xl">made by Ingmar with ❤️</p>
        <p className="text-center text-4xl print:text-3xl">-{index + 1}-</p>
        {/* <p className="text-2xl w-96 text-right">July 4, 2024</p> */}
        <p className="w-96 text-right text-2xl">{formatDate(lastUpdated)}</p>
      </div>
    </div>
  );
};

export default sheetPage;
