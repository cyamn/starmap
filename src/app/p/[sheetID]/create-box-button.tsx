"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { api } from "@/utils/api";

import BoxEditor from "./box-editor";

interface createBoxButtonProperties {
  setDialogComponent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  pageID: string;
  boxes: number;
  sheetID: string;
}

const createBoxButton: React.FC<createBoxButtonProperties> = ({
  setDialogComponent,
  pageID,
  boxes,
  sheetID,
}) => {
  function closeDialog() {
    setDialogComponent(null);
  }

  const { mutate: createBlock } = api.blocks.add.useMutation({
    onSuccess: (data) => {
      setDialogComponent(
        <BoxEditor block={data} closeDialog={closeDialog} sheetID={sheetID} />,
      );
    },
  });

  function addBox() {
    createBlock({
      pageID,
      index: boxes,
    });
  }

  return (
    <button
      onClick={addBox}
      className="w-1/2 rounded-xl bg-primary/5 text-2xl print:hidden"
    >
      <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
    </button>
  );
};

export default createBoxButton;
