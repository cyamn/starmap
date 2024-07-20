"use client";

import {
  faDownload,
  faPersonChalkboard,
  faPrint,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useEffect, useRef, useState } from "react";

import { RouterOutput } from "@/server/api/root";
import { api } from "@/utils/api";
import { handleDownload } from "@/utils/download";
import { handleImport } from "@/utils/import";

import Footer from "./footer";
import Header from "./header";
import SheetPage from "./sheet-page";
import SheetSidenav from "./sheet-sidenav";
import SheetTocs from "./sheet-tocs";

dayjs.extend(relativeTime);

interface SheetProperties {
  sheet: NonNullable<RouterOutput["sheets"]["get"]>;
}

const Sheet: React.FC<SheetProperties> = ({ sheet: sheetPrefetched }) => {
  const context = api.useUtils();

  const { data: sheetRefetched } = api.sheets.get.useQuery({
    id: sheetPrefetched.id,
  });

  const { mutate: importMd } = api.sheets.importFromMarkdown.useMutation({
    onSuccess: () => {
      void context.sheets.get.invalidate({ id: sheet.id });
    },
  });

  const { mutate: exportMd } = api.sheets.exportToMarkdown.useMutation({
    onSuccess: (data) => {
      alert(data.markdown);
      handleDownload(`${sheet.title}.md`, data.markdown, "text/markdown");
    },
  });

  const [dialogComponent, setDialogComponent] = useState<React.ReactNode>(null);

  const sheet = sheetRefetched ?? sheetPrefetched;
  const [activePage, setActivePage] = useState(sheet.pages[0]?.index || 0);
  const pageReferences = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2; // Middle of the viewport
      const offsets = pageReferences.current.map(
        (reference) => reference?.offsetTop || 0,
      );

      for (let index = offsets.length - 1; index >= 0; index--) {
        if (offsets[index] !== undefined && scrollPosition >= offsets[index]!) {
          setActivePage(sheet.pages[index]?.index ?? 0);
          console.log(sheet.pages[index]?.index ?? 0);
          break;
        }
      }
    };

    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 100);
    };

    let timeoutId: NodeJS.Timeout;
    window.addEventListener("scroll", debouncedHandleScroll);
    handleScroll(); // Initial call to set the correct active page

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [sheet.pages]);

  async function importMarkdown() {
    const file = await handleImport(false, [".md"]);
    if (file?.[0] === undefined) return;
    importMd({ id: sheet.id, markdown: file[0] });
  }

  return (
    <div
      id="top"
      className=" flex flex-col items-center justify-center py-2 text-primary print:py-0"
    >
      <div className="mt-10 flex flex-col items-center justify-center print:hidden">
        <Header title={sheet.title} id={sheet.id} />
        last updated: {dayjs(sheet.updatedAt).fromNow()}
        <div className="flex flex-row">
          <button onClick={importMarkdown}>
            <FontAwesomeIcon
              className="m-1 rounded-md border-2 border-primary p-1"
              icon={faUpload}
            />
          </button>
          <button
            onClick={() => {
              exportMd({
                id: sheet.id,
              });
            }}
          >
            <FontAwesomeIcon
              className="m-1 rounded-md border-2 border-primary p-1"
              icon={faDownload}
            />
          </button>
          <button
            onClick={() => {
              window.print();
            }}
          >
            <FontAwesomeIcon
              className="m-1 rounded-md border-2 border-primary p-1"
              icon={faPrint}
            />
          </button>
          <a href={`/p/${sheet.id}/p`}>
            <button>
              <FontAwesomeIcon
                className="m-1 rounded-md border-2 border-primary p-1"
                icon={faPersonChalkboard}
              />
            </button>
          </a>
        </div>
        <SheetSidenav pages={sheet.pages} activePage={activePage} />
      </div>
      <div ref={(element) => (pageReferences.current[0] = element)}>
        <SheetTocs
          pages={sheet.pages}
          title={sheet.title}
          lastUpdated={sheet.updatedAt}
        />
      </div>
      {sheet.pages.map((page, index) => (
        <div
          ref={(element) => (pageReferences.current[index + 1] = element)}
          key={page.id}
        >
          <SheetPage
            title={sheet.title}
            page={page}
            lastUpdated={sheet.updatedAt}
            index={index}
            setDialogComponent={setDialogComponent}
            sheetID={sheet.id}
          />
        </div>
      ))}
      <Footer id={sheet.id} pages={sheet.pages.length} />
      {dialogComponent !== null && (
        <div className="fixed left-0 top-0 h-screen w-screen p-8 backdrop-blur-sm">
          {dialogComponent}
        </div>
      )}
    </div>
  );
};

export default Sheet;
