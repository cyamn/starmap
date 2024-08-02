import {
  faStar,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface sheetPreviewProperties {
  title: string;
  pages: { title: string }[];
  id: string;
}

const sheetPreview: React.FC<sheetPreviewProperties> = ({
  title,
  pages,
  id,
}) => {
  return (
    <a href={`/p/${id}`}>
      <div className="flex w-full flex-row bg-secondary/25 backdrop-blur-sm">
        <h2 className="w-64 rounded-l-md bg-secondary/50 p-1 px-4 text-2xl  text-primary">
          {title}
        </h2>
        <div className="flex w-full flex-row flex-wrap gap-1 border-2 border-secondary/50 p-1 px-4">
          {pages.map((page) => (
            <div
              className="rounded-md bg-primary p-1 text-background"
              key={page.title}
            >
              {page.title}
            </div>
          ))}
        </div>
        <h2 className="flex w-80 flex-row items-center justify-around gap-1 rounded-r-md bg-secondary/50  p-1 px-4 text-base text-primary">
          <span className="text-success">
            <FontAwesomeIcon icon={faThumbsUp} /> 9999
          </span>
          <div className="h-full w-1 bg-background"></div>
          <span className="text-danger">
            <FontAwesomeIcon icon={faThumbsDown} /> 9999
          </span>
          <div className="h-full w-1 bg-background"></div>
          <span className="text-warning">
            <FontAwesomeIcon icon={faStar} /> 9999
          </span>
        </h2>
      </div>
    </a>
  );
};

export default sheetPreview;
