"use client";

import React from "react";

import { api } from "@/utils/api";

interface RebuildProperties {}

const Rebuild: React.FC<RebuildProperties> = () => {
  const { mutate } = api.graph.rebuild.useMutation({
    onSuccess: () => {
      alert("Rebuilt");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  function rebuild() {
    alert("Rebuilding...");
    mutate();
  }

  return (
    <button
      className="z-20 w-full bg-warning p-1 text-center text-background"
      onClick={() => {
        rebuild();
      }}
    >
      Rebuild
    </button>
  );
};

export default Rebuild;
