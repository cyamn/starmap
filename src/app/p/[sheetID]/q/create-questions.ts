import { RouterOutput } from "@/server/api/root";

type Sheet = NonNullable<RouterOutput["sheets"]["get"]>;
type Page = NonNullable<Sheet["pages"]>[0];
type Block = NonNullable<Page["blocks"]>[0];

type Question = {
  question: string;
  answer: string;
};

function disambiguateMathSymbols(markdown: string): string {
  let processed = markdown;
  // replace german with math where applicable (e.g. "genau dann, wenn" -> "\Leftrightarrow)
  processed = processed.replaceAll("genau dann, wenn", "$\\Leftrightarrow$");
  processed = processed.replaceAll("für alle", "$\\forall$");
  processed = processed.replaceAll("existiert", "$\\exists$");
  processed = processed.replaceAll("nicht existiert", "$\\nexists$");
  processed = processed.replaceAll("nicht", "$\\neg$");
  processed = processed.replaceAll("und", "$\\land$");
  processed = processed.replaceAll("oder", "$\\lor$");
  processed = processed.replaceAll("impliziert", "$\\Rightarrow$");
  processed = processed.replaceAll("äquivalent", "$\\Leftrightarrow$");
  processed = processed.replaceAll("widerspruch", "$\\lightning$");

  return processed;
}

function disambiguateGerman(markdown: string): string {
  let processed = markdown;
  // let processed = markdown.toLocaleLowerCase();

  processed = processed.replaceAll("so ist", "z.B. ist");
  processed = processed.replaceAll("So ist", "z.B. ist");

  return processed;
}

function preprocess(markdown: string): string {
  let processed = markdown;
  // replace $$ with $
  processed = processed.replaceAll("$$", "$");

  // disambiguate german
  processed = disambiguateGerman(processed);


  // disambiguate math symbols
  processed = disambiguateMathSymbols(processed);

  // replace ordered list with unordered list (-)
  processed = processed.replaceAll(/^(\d+\.)/gm, "-");
  return processed;
}

function foldPoints(points: string[]): string[] {
  // take the first point string and add it to the beginning of each other point string
  const firstPoint = points[0];
  return points.slice(1).map((point) => firstPoint + " " + point);
}

type SplitRule = {
  regex: RegExp;
  question: string;
  answer: string;
};


const splitRuleTemplateVariable = "<!!!>"
const temporaryReplaceMarker = "<§§§>"

// create split rule
function cs(r: RegExp, q: string, a: string): SplitRule {
  const qt = q.replaceAll(/\$(\d+)/g, `${temporaryReplaceMarker}${splitRuleTemplateVariable}$1${temporaryReplaceMarker}`)
  const at = a.replaceAll(/\$(\d+)/g, `${temporaryReplaceMarker}${splitRuleTemplateVariable}$1${temporaryReplaceMarker}`)

  return { regex: r, question: qt, answer: at };
}

const splitRules: SplitRule[] = [
  cs(/(.+)\$\\Leftrightarrow\$(.+)/, "Wann gilt $0?", "Genau dann, wenn $1"),
  cs(/(.+):=(.+)/, "Wie ist $0 definiert?", "$1"),
];

function replaceLastOccurrence(
  originalString: string,
  searchString: string,
  replaceString: string
): string {
  const lastIndex = originalString.lastIndexOf(searchString);

  if (lastIndex === -1) {
    return originalString;
  }

  const before = originalString.slice(0, Math.max(0, lastIndex));
  const after = originalString.slice(Math.max(0, lastIndex + searchString.length));

  return before + replaceString + after;
}


function splitPoint(markdown: string): Question {

  for (const rule of splitRules) {
    const match = markdown.match(rule.regex);

    if (match && match.length > 1) {
      // Extract all groups
      const groups = match.slice(1).map(group => group.trim());

      // Replace placeholders in the templates with the extracted groups
      let question = rule.question;
      let answer = rule.answer;

      for (const [index, group] of groups.entries()) {
        question = question.replace(`${splitRuleTemplateVariable}${index}`, group);
        answer = answer.replace(`${splitRuleTemplateVariable}${index}`, group);
      }

      // fix broken math blocks (number of $ in question is uneven)
      if (question.split("$").length % 2 === 0) {
        // insert a $ in question after last occurance of the temporaryReplaceMarker (not the first)
        question = replaceLastOccurrence(question, temporaryReplaceMarker, "$" + temporaryReplaceMarker);


        // insert a $ in answer before the first temporaryReplaceMarker
        answer = answer.replace(temporaryReplaceMarker, "$" + temporaryReplaceMarker);
      }


      // remove all temporaryReplaceMarker from question and answer
      question = question.replaceAll(temporaryReplaceMarker, "");
      answer = answer.replaceAll(temporaryReplaceMarker, "");


      return {
        question,
        answer,
      };
    }
  }

  return { question: markdown, answer: "???" };
}

export function createQuestionsFromBlock(block: Block): Question[] {
  const markdown = preprocess(block.markdown);

  let points = markdown.split("\n-")
    .map((point) => point.trim())
    .filter((point) => point.length > 0);

  if (!/^(-|\s*-)/.test(markdown))
    points = foldPoints(points);

  const questions: Question[] = [];
  for (const point of points) {
    questions.push(splitPoint(point));
  }

  return questions;

}