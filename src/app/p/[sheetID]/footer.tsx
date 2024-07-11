"use client";

import React from "react";

import { api } from "@/utils/api";

interface footerProperties {
  id: string;
  pages: number;
}

const footer: React.FC<footerProperties> = ({ id, pages }) => {
  const context = api.useUtils();
  const { mutate } = api.pages.add.useMutation({
    onSuccess: () => {
      void context.sheets.get.invalidate({ id: id });
    },
  });
  return (
    <button
      className="m-5 rounded-md bg-primary p-2 text-2xl text-background print:hidden"
      onClick={() => {
        mutate({
          sheetID: id,
          index: pages,
        });
      }}
    >
      Add Page
    </button>
  );
};

export default footer;
