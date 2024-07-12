import { faMessage, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlockType } from "@prisma/client";
import React from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import Box from "./box";
import BoxEditor from "./box-editor";

interface boxProperties {
  id: string;
  uuid: string;
  title: string;
  type: BlockType;
  markdown: string;
  setDialogComponent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

const box: React.FC<boxProperties> = ({
  title,
  markdown,
  type,
  id,
  uuid,
  setDialogComponent,
}) => {
  function closeDialog() {
    setDialogComponent(null);
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className="w-1/2">
          <Box title={title} markdown={markdown} type={type} id={id} />
        </ContextMenuTrigger>
        <ContextMenuContent className="w-fit border-2 border-primary bg-background/75 text-primary backdrop-blur">
          <ContextMenuItem
            className="cursor-pointer"
            onClick={() => {
              setDialogComponent(
                <BoxEditor
                  block={{
                    id: uuid,
                    title,
                    markdown,
                    type,
                  }}
                  closeDialog={closeDialog}
                />,
              );
            }}
          >
            <FontAwesomeIcon icon={faPen} className="mr-2" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem
            className="cursor-pointer text-warning"
            onClick={() => {
              alert("Comment");
            }}
          >
            <FontAwesomeIcon icon={faMessage} className="mr-2" />
            Add Comment
          </ContextMenuItem>
          <ContextMenuItem className="cursor-pointer text-danger">
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default box;
