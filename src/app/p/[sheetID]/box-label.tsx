import { faEnvira } from "@fortawesome/free-brands-svg-icons";
import {
  faBug,
  faCircleInfo,
  faCube,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BlockType } from "@prisma/client";
import React from "react";

import { cn } from "@/lib/utils";

interface boxLabelProperties {
  title: string;
  type: BlockType;
}

const TypeToBackgroundColor = {
  [BlockType.DEFAULT]: "bg-primary",
  [BlockType.INFO]: "bg-info",
  [BlockType.HINT]: "bg-success",
  [BlockType.WARNING]: "bg-warning",
  [BlockType.ERROR]: "bg-danger",
};

const TypeToIcon = {
  [BlockType.DEFAULT]: faCube,
  [BlockType.INFO]: faCircleInfo,
  [BlockType.HINT]: faEnvira,
  [BlockType.WARNING]: faTriangleExclamation,
  [BlockType.ERROR]: faBug,
};

const boxLabel: React.FC<boxLabelProperties> = ({ title, type }) => {
  const bgColor = TypeToBackgroundColor[type];
  const icon = TypeToIcon[type];
  return (
    <h3
      className={cn(
        "border-md rounded-md bg-primary px-1 text-base text-background",
        bgColor,
      )}
    >
      <FontAwesomeIcon className="pr-1" icon={icon} />
      <span>{title}</span>
    </h3>
  );
};

export default boxLabel;
