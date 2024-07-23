import { createReactBlockSpec } from "@blocknote/react";

import Box from "../box";

export const BoxBlock = createReactBlockSpec(
  {
    type: "box",
    propSchema: {
      type: {
        values: ["DEFAULT", "INFO", "HINT", "WARNING", "ERROR"],
        default: "DEFAULT",
      },
      title: {
        default: "Your title here",
      },
      markdown: {
        default: "Your content here",
      },
    },
    content: "none",
  },
  {
    render: (properties) => {
      const { type, title, markdown } = properties.block.props;
      return (
        <div className="py-1">
          <Box type={type} id="-1" title={title} markdown={markdown} />
        </div>
      );
    },
  },
);
