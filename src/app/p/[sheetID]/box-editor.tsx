"use client";

import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlockType } from "@prisma/client";
import { useLocalStorage } from "@uidotdev/usehooks";
import React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { RouterOutput } from "@/server/api/root";
import { api } from "@/utils/api";
import { normalizeMarkdown } from "@/utils/normalize-markdown";

import Box from "./box";

interface boxEditorProperties {
  block: NonNullable<RouterOutput["sheets"]["get"]>["pages"][0]["blocks"][0];
  closeDialog: () => void;
  sheetID: string;
}

export const TypeToColor = {
  [BlockType.DEFAULT]: "text-primary",
  [BlockType.INFO]: "text-info",
  [BlockType.HINT]: "text-success",
  [BlockType.WARNING]: "text-warning",
  [BlockType.ERROR]: "text-danger",
};

const boxEditor: React.FC<boxEditorProperties> = ({
  block,
  closeDialog,
  sheetID,
}) => {
  const localStorageUUID = "block-editor-" + block.id;

  const [title, setTitle] = useLocalStorage(
    localStorageUUID + "-title",
    block.title,
  );
  const [markdown, setMarkdown] = useLocalStorage(
    localStorageUUID + "-markdown",
    block.markdown,
  );
  const [type, setType] = useLocalStorage<BlockType>(
    localStorageUUID + "-block",
    block.type,
  );

  const context = api.useUtils();

  const { mutate: updateBlock } = api.blocks.update.useMutation({
    onSuccess: () => {
      void context.sheets.get.invalidate({ id: sheetID });
      discardDialog();
    },
  });

  function submitDialog() {
    updateBlock({
      id: block.id,
      title,
      markdown,
      type,
    });
  }

  function discardDialog() {
    // sync to server
    //...
    // delete local storage
    localStorage.removeItem(localStorageUUID + "-title");
    localStorage.removeItem(localStorageUUID + "-markdown");
    localStorage.removeItem(localStorageUUID + "-block");
    closeDialog();
  }

  return (
    <div className="flex h-full w-full flex-col rounded-md border-2 border-primary bg-background/80">
      <div className="flex h-full w-full flex-row">
        <div className="flex h-full w-1/2 flex-col gap-4 border-r border-primary p-4">
          <div className="flex flex-row items-center gap-4">
            <input
              className="rounded-md border border-primary bg-transparent"
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <Select
              value={type}
              onValueChange={(value: BlockType) => {
                setType(value);
              }}
            >
              <SelectTrigger className={cn(TypeToColor[type], "w-[180px]")}>
                <SelectValue
                // placeholder="Select a type"
                />
              </SelectTrigger>
              <SelectContent className="backdrop-blur-sm">
                <SelectGroup>
                  <SelectLabel className="text-primary">Types</SelectLabel>
                  {Object.values(BlockType).map((type) => (
                    <SelectItem
                      className={cn(TypeToColor[type])}
                      key={type}
                      value={type}
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <textarea
            className="h-full w-full rounded-md border border-primary bg-transparent  p-1"
            id=""
            value={markdown}
            onChange={(event) => {
              setMarkdown(normalizeMarkdown(event.target.value));
            }}
          />
        </div>
        <div className="flex h-full w-1/2 flex-row items-center justify-items-center border-l border-primary">
          <div
            className="absolute right-14 top-12 text-3xl"
            onClick={submitDialog}
          >
            <FontAwesomeIcon icon={faClose} />
          </div>
          <div className="flex w-full scale-150 flex-col items-center">
            <div className="h-full w-1/2">
              <Box
                id={block.id}
                markdown={markdown}
                type={type}
                title={title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default boxEditor;
