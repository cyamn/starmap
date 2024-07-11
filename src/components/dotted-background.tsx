import "./dots.css";

import React from "react";

export const DottedBackground = () => {
  return (
    <div className="pointer-events-none fixed -z-10 flex h-screen w-screen flex-col justify-center overflow-hidden bg-background align-middle">
      <div className="dots -z-10 h-[200vh] w-[200vw] print:hidden"></div>
    </div>
  );
};
