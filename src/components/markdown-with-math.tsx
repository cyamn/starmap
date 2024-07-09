// MarkdownWithMath.tsx
import "katex/dist/katex.min.css";

import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

interface MarkdownWithMathProperties {
  content: string;
}

const MarkdownWithMath: React.FC<MarkdownWithMathProperties> = ({
  content,
}) => {
  return (
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownWithMath;
