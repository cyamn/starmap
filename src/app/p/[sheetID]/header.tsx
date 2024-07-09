"use client";

import React from "react";
import toast from "react-hot-toast";

import { api } from "@/utils/api";

interface headerProperties {
  title: string;
  id: string;
}

const header: React.FC<headerProperties> = ({ title, id }) => {
  const context = api.useUtils();
  const { mutate } = api.sheets.update.useMutation({
    onSuccess: () => {
      void context.sheets.list.invalidate();
      void context.sheets.get.invalidate({ id: id });
      toast.success("Sheet updated");
    },
  });

  function updateTitle(event: React.FocusEvent<HTMLHeadingElement>) {
    mutate({ title: event.currentTarget.textContent ?? "", id: id });
  }

  return (
    <h1
      className="text-6xl font-bold"
      onBlur={updateTitle}
      onSubmit={updateTitle}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    >
      {title}
    </h1>
  );
};

export default header;
