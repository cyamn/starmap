"use client";

import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

import MarkdownWithMath from "@/components/markdown-with-math";
import { cn } from "@/lib/utils";
import { RouterOutput } from "@/server/api/root";

import { TypeToBorderColor } from "../box";
import { TypeToColor } from "../box-editor";

type Sheet = NonNullable<RouterOutput["sheets"]["get"]>;
type Page = NonNullable<Sheet["pages"]>[0];
type Block = NonNullable<Page["blocks"]>[0];

interface PresentationProperties {
  sheet: Sheet;
}

const Presentation: React.FC<PresentationProperties> = ({ sheet: sheet_ }) => {
  // create a copy of sheet but insert a dummy block with type toc at the beginning of each page
  const sheet = {
    ...sheet_,
    pages: sheet_.pages.map((page) => ({
      ...page,
      blocks: [
        {
          id: "toc",
          title: "TOC",
          markdown: page.title,
          type: "toc",
        },
        ...page.blocks,
      ],
    })),
  };

  const [activeBlock, setActiveBlock] = useState(-1);

  let blockCount = 0;
  for (const page of sheet.pages) {
    blockCount += page.blocks.length;
  }

  // handle keypress
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === " ") {
      setActiveBlock((previous) =>
        previous < blockCount ? previous + 1 : previous,
      );
    } else if (event.key === "ArrowLeft") {
      setActiveBlock((previous) => (previous > -1 ? previous - 1 : previous));
    }
  };

  // Add and remove event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const loadingBarPercentage = ((activeBlock + 1) / (blockCount + 1)) * 100;
  1;
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center"
      tabIndex={0}
    >
      <PresentationContent
        sheet={sheet}
        activeBlock={activeBlock}
        blockCount={blockCount}
      />
      <div className="absolute bottom-0 w-full flex-row">
        <div
          style={{ width: `${loadingBarPercentage}%` }}
          className="h-1 bg-secondary"
        ></div>
      </div>
      <div className="absolute bottom-2 right-4 text-primary">
        {activeBlock + 1} / {blockCount + 1}
      </div>
    </div>
  );
};

interface PresentationProperties {
  sheet: NonNullable<RouterOutput["sheets"]["get"]>;
  activeBlock: number;
  blockCount: number;
}

function getActivePageAndBlock(
  sheet: Sheet,
  activeBlock: number,
): { block: Block; page: Page } | null {
  let index = 0;
  for (const page of sheet.pages) {
    for (const block of page.blocks) {
      if (index === activeBlock) {
        return { block, page };
      }
      index++;
    }
  }
  return null;
}

const PresentationContent: React.FC<PresentationProperties> = ({
  sheet,
  activeBlock,
  blockCount,
}) => {
  if (activeBlock === -1) {
    return (
      <div className="p-2 backdrop-blur-sm">
        <h1 className="m-8 border-x-8 border-primary px-4 text-center text-7xl font-bold text-primary">
          {sheet.title}
        </h1>
      </div>
    );
  }

  if (activeBlock === blockCount) {
    return (
      <div className="flex w-96 flex-col items-center p-2 backdrop-blur-sm">
        <h1 className="m-8 border-x-8 border-primary px-4 text-center text-7xl font-bold text-primary">
          Fin
        </h1>
        <QRCode
          size={256}
          value={window.location.hostname + "/p/" + sheet.id}
          viewBox={`0 0 256 256`}
          bgColor="#060410"
          fgColor="hsl(201, 65%, 88%)"
        />
        <p className="p-8 text-center text-primary">
          Visit{" "}
          <a className="text-info" href="">
            {window.location.hostname + "/p/" + sheet.id}
          </a>{" "}
          to download a cheat sheet of this presentation and more.
        </p>
      </div>
    );
  }

  const current = getActivePageAndBlock(sheet, activeBlock);

  if (!current) {
    return null;
  }

  const { block, page: page_ } = current;

  if ((block.type as string) === "toc") {
    return (
      <div className="mx-32 text-3xl text-primary">
        <div className="m-8 p-2 backdrop-blur-sm">
          <h1
            className={cn(
              "border-x-8  border-primary px-4 text-center text-primary",
            )}
          >
            TOC
          </h1>
        </div>
        <div className="p-2 pl-6 backdrop-blur-sm">
          <ul>
            {sheet.pages.map((page) => (
              <li
                key={page.id}
                className={
                  page.title === page_.title
                    ? "bg-primary p-1 text-background"
                    : "p-1"
                }
              >
                <a href={`#${page.title}`}>{page.title}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute bottom-2 left-4 text-base text-primary">
          {sheet.title}
        </div>
      </div>
    );
  }

  const borderColor = TypeToBorderColor[block.type];
  const textColor = TypeToColor[block.type];

  return (
    <div className="mx-32 text-3xl text-primary">
      <div className="m-8 p-2 backdrop-blur-sm">
        <h1
          className={cn("border-x-8  px-4 text-center", borderColor, textColor)}
        >
          {block.title}
        </h1>
      </div>
      <div className="p-2 pl-6 backdrop-blur-sm">
        <MarkdownWithMath content={block.markdown} />
      </div>
      <div className="absolute bottom-2 left-4 text-base text-primary">
        {sheet.title} {">"} {page_.title}
      </div>
    </div>
  );
};

export default Presentation;
