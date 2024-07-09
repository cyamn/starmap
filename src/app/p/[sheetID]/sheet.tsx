"use client";

import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";

import { RouterOutput } from "@/server/api/root";
import { api } from "@/utils/api";
import { handleImport } from "@/utils/import";

import Footer from "./footer";
import Header from "./header";
import SheetPage from "./sheet-page";
import SheetTocs from "./sheet-tocs";

dayjs.extend(relativeTime);

interface sheetProperties {
  sheet: NonNullable<RouterOutput["sheets"]["get"]>;
}

const sheet: React.FC<sheetProperties> = ({ sheet }) => {
  const context = api.useUtils();
  const { mutate: importMd } = api.sheets.importFromMarkdown.useMutation({
    onSuccess: () => {
      void context.sheets.get.invalidate({ id: sheet.id });
    },
  });
  async function importMarkdown() {
    const file = await handleImport(false, [".md"]);
    if (file?.[0] === undefined) return;
    importMd({ id: sheet.id, markdown: file[0] });
  }

  return (
    <div className="mt-10 flex flex-col items-center justify-center py-2 text-primary">
      <Header title={sheet.title} id={sheet.id} />
      last updated: {dayjs(sheet.updatedAt).fromNow()}
      <div className="flex flex-row">
        <button onClick={void importMarkdown()}>
          <FontAwesomeIcon
            className="m-1 rounded-md border-2 border-primary p-1"
            icon={faUpload}
          />
        </button>
        <button>
          <FontAwesomeIcon
            className="m-1 rounded-md border-2 border-primary p-1"
            icon={faDownload}
          />
        </button>
      </div>
      <SheetTocs
        pages={sheet.pages}
        title={sheet.title}
        lastUpdated={sheet.updatedAt}
      />
      {sheet.pages.map((page, index) => (
        <SheetPage
          key={page.id}
          title={sheet.title}
          page={page}
          lastUpdated={sheet.updatedAt}
          index={index}
        />
      ))}
      <Footer id={sheet.id} pages={sheet.pages.length} />
    </div>
  );
};

export default sheet;
