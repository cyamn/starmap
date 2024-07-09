"use client";

import React from "react";

import { api } from "@/utils/api";

interface createSheetButtonProperties {}

const createSheetButton: React.FC<createSheetButtonProperties> = () => {
  const { mutate } = api.sheets.create.useMutation({
    onSuccess: (data) => {
      alert(JSON.stringify(data, null, 2));
    },
  });
  return (
    <button
      className="m-5 rounded-md bg-primary p-2 text-2xl text-background"
      onClick={() => {
        mutate();
      }}
    >
      Create
    </button>
  );
};

export default createSheetButton;
