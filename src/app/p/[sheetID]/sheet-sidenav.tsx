import React from "react";

import { RouterOutput } from "@/server/api/root";

interface sheetSidenavProperties {
  pages: NonNullable<RouterOutput["sheets"]["get"]>["pages"];
  activePage: number;
}

const sheetSidenav: React.FC<sheetSidenavProperties> = ({
  pages,
  activePage,
}) => {
  if (activePage === 0) return null;
  return (
    <div className="fixed left-0  top-0 ml-4 flex h-full flex-col justify-center">
      {pages.map((page) => (
        <a
          key={page.id}
          href={`#${page.title}`}
          className="flex flex-row items-center"
        >
          <NavTitle title={page.title} active={page.index + 1 === activePage} />
        </a>
      ))}
    </div>
  );
};

interface navTitleProperties {
  title: string;
  active: boolean;
}

const NavTitle: React.FC<navTitleProperties> = ({ title, active }) => {
  return active ? (
    <div className="my-2 w-64 overflow-hidden rounded-md bg-secondary p-1 px-2 text-lg text-background">
      {title}
    </div>
  ) : (
    <div className="my-2 w-64 overflow-hidden rounded-md bg-secondary/5 p-1 px-2 text-lg text-secondary">
      {title}
    </div>
  );
};

export default sheetSidenav;
