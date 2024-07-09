import "./dots.css";

import React from "react";

export const DottedBackground = () => {
  return (
    <div className="pointer-events-none absolute -z-10 flex h-screen w-screen flex-col justify-center overflow-hidden bg-background align-middle">
      <div className="dots -z-10 h-[200vh] w-[200vw]"></div>
    </div>
  );
};
