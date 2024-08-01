import { Ollama } from "@langchain/community/llms/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const llm = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "zhuhuan/llama-3-sauerkrautlm-8b-instruct:q6_k",
});

const prompt = ChatPromptTemplate.fromTemplate(
  `Du bist ein deutscher chat bot, der Fragen zum Lernen erstellt.
  Du bekommst eine Informationstext und sollst dazu Fragen generieren.
  Schreibe die Fragekarten auf Deutsch. Schreibe im Format:
  F: Frage?
  A: Antwort.
  Du darfst gerne Latex mathe schreiben.
  In der Frage sollen unter anderem die Wörter: {includeWords} vorkommen.
  Stelle die Fragen so, dass zur Beantwortung der Inforationstext nicht vorliegen muss.
  Du kannst zum Beispiel Definitionen, Beispiele, Anwendungen, Zusammenhänge, etc. abfragen. Die Fragen sollen helfen, den Inhalt zu lernen.
  Hier der Informationstext zu dem du Lernfragen erstellen sollst:
  {topic}`
);

const outputParser = new StringOutputParser();

const chain = prompt.pipe(llm).pipe(outputParser);

type Block = {
  markdown: string;
  title: string;
  page: {
    title: string;
    sheet: {
      title: string;
    };
  };
};

type Question = {
  question: string;
  answer: string;
};

export async function createQuestionsFromBlock(block: Block): Promise<Question[]> {

  const markdown = block.markdown;
  const title = block.title;
  const page = block.page.title;
  const sheet = block.page.sheet.title;

  if (markdown === null || markdown === undefined || markdown === "") {
    console.log("SKIPPING EMPTY BLOCK!")
    return [];
  }

  const topic = `Thema: ${sheet} > ${page} > ${title}:\n ${markdown}`;
  const includeWords = `${sheet}, ${page}, ${title}`

  console.log(`GENERATING QUESTIONS FOR: ${topic}`);

  // will return something like:
  // F: ...
  // A: ...

  // F: ...
  // A: ...
  const questionsResponse = await chain.invoke({
    topic,
    includeWords
  });

  console.log(`GENERATED: ${questionsResponse}`);

  const lines = questionsResponse.split("\n");
  const questions: Question[] = [];
  const currentQuestion: Question = { question: "", answer: "" }
  for (const line of lines) {
    if (line.startsWith("F: ")) currentQuestion.question = line.slice(3);
    else if (line.startsWith("A: ")) {
      currentQuestion.answer = line.slice(3);
      questions.push({
        question: currentQuestion.question,
        answer: currentQuestion.answer,
      });
    }
  }

  return questions;
}