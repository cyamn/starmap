import React from "react";

interface optionsProperties {}

const options: React.FC<optionsProperties> = () => {
  return (
    <div className="flex w-full flex-row justify-center">
      <button className="mx-2 rounded-md border-2 border-secondary bg-secondary/5 p-1 px-4 text-xl">
        Download
      </button>
      <button className="mx-2 rounded-md border-2 border-secondary bg-secondary/5 p-1 px-4 text-xl">
        Edit
      </button>
    </div>
  );
};

export default options;
