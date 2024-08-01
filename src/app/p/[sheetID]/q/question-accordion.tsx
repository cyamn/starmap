import React from "react";

import MarkdownWithMath from "@/components/markdown-with-math";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Question = {
  question: string;
  answer: string;
};

interface questionAccordionProperties {
  questions: Question[];
}

const questionAccordion: React.FC<questionAccordionProperties> = ({
  questions,
}) => {
  return (
    <div className="">
      <div className="my-2 max-h-96 overflow-auto rounded-md border-2 border-secondary bg-secondary/25 p-2 text-sm text-primary backdrop-blur-sm">
        <Accordion type="single" collapsible>
          {questions.map((question, index) => (
            <AccordionItem
              className="border-secondary"
              key={index}
              value={`item-${index}`}
            >
              <AccordionTrigger>
                <MarkdownWithMath content={"**Q**: " + question.question} />
              </AccordionTrigger>
              <AccordionContent>
                <MarkdownWithMath content={"**A**: " + question.answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default questionAccordion;
