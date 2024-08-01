"use client";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

import MarkdownWithMath from "@/components/markdown-with-math";
import { RouterOutput } from "@/server/api/root";
import { api } from "@/utils/api";

import Box, { TypeToBorderColor } from "../box";
import { TypeToColor } from "../box-editor";
import QuestionAccordion from "./question-accordion";

type Sheet = NonNullable<RouterOutput["sheets"]["get"]>;
type Page = NonNullable<Sheet["pages"]>[0];
type Block = NonNullable<Page["blocks"]>[0];

interface QuestionEditorProperties {
  sheet: Sheet;
}

const QuestionEditor: React.FC<QuestionEditorProperties> = ({
  sheet: sheet_,
}) => {
  // create a copy of sheet but insert a dummy block with type toc at the beginning of each page
  const sheet = sheet_;

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
      <QuestionEditorContent
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

interface QuestionEditorProperties {
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

const QuestionEditorContent: React.FC<QuestionEditorProperties> = ({
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
          to download a cheat sheet of this QuestionEditor and more.
        </p>
      </div>
    );
  }

  const current = getActivePageAndBlock(sheet, activeBlock);

  if (!current) {
    return null;
  }

  const { block, page: page_ } = current;

  const borderColor = TypeToBorderColor[block.type];
  const textColor = TypeToColor[block.type];

  return <QuestionGenerator block={block} sheet={sheet} />;
};

type QuestionGeneratorProperties = {
  block: Block;
  sheet: Sheet;
};

const QuestionGenerator: React.FC<QuestionGeneratorProperties> = ({
  block,
  sheet,
}) => {
  const { data: questions, isLoading } = api.blocks.getQuestions.useQuery({
    id: block.id,
  });

  const { mutate, isLoading: isGenerating } =
    api.ai.generateQuestionsForSheet.useMutation({
      onSuccess: () => {
        alert("Questions generated successfully");
      },
      onError: () => {
        alert("Failed to generate questions!");
      },
    });

  const { mutate: createOne, isLoading: isGeneratingOne } =
    api.ai.generateQuestions.useMutation({
      onSuccess: () => {
        alert("Question generated successfully");
      },
      onError: () => {
        alert("Failed to generate question!");
      },
    });

  return (
    <div className="mx-32 flex flex-col justify-center text-primary">
      <Box
        title={block.title}
        markdown={block.markdown}
        type={block.type}
        id={block.id}
      />
      {isLoading || (questions === undefined && <div> Loading questions </div>)}
      {questions?.length === 0 && (
        <>
          <button
            disabled={isGenerating}
            onClick={() => {
              createOne({
                blockID: block.id,
              });
            }}
          >
            {isGenerating || isGeneratingOne
              ? "Generating..."
              : "Create Questions for block"}
          </button>
          <button
            disabled={isGenerating}
            onClick={() => {
              mutate({
                sheetID: sheet.id,
              });
            }}
          >
            {isGenerating || isGeneratingOne
              ? "Generating..."
              : "Create Questions for sheet"}
          </button>
        </>
      )}
      {!isLoading && questions !== undefined && (
        <>
          <FontAwesomeIcon
            className="text-center text-5xl text-secondary"
            icon={faChevronDown}
          />
          <QuestionAccordion questions={questions} />
        </>
      )}
    </div>
  );
};

type QuestionCardProperties = {
  question: string;
  answer: string;
};

const QuestionCard: React.FC<QuestionCardProperties> = ({
  question,
  answer,
}) => {
  return (
    <div className="p-2">
      <MarkdownWithMath content={`Q: ${question}\nA: ${answer}\n\n`} />
    </div>
  );
};

export default QuestionEditor;
