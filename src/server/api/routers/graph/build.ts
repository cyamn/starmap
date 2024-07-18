import { similarity } from 'ml-distance';
import * as natural from 'natural';
import { prisma } from "src/server/database";
import * as stopword from 'stopword';

import { Link } from './shema';


// German stemmer
const stemmer = natural.PorterStemmerDe;

// German stop words
const germanStopWords = stopword.deu;

function preprocessDocument(document_: string): string {
  document_ = document_.toLowerCase();
  document_ = document_.replaceAll('\n', ' ');

  // Remove italic formatting (e.g., _word_)
  document_ = document_.replaceAll(/_([^_]+)_/g, '$1');

  // Remove bold formatting (e.g., **word**)
  document_ = document_.replaceAll(/\*{2}([^*]+)\*{2}/g, '$1');

  // Tokenize and stem
  const tokens = new natural.WordTokenizer().tokenize(document_);
  const stemmedTokens = tokens.map(token => stemmer.stem(token));

  // Remove stop words
  const filteredTokens = stemmedTokens.filter(token => !germanStopWords.includes(token));

  return filteredTokens.join(' ');
}

// Vectorize documents using term frequency
function termFrequency(documents: string[]): number[][] {
  const termSet = new Set<string>();
  for (const document_ of documents) for (const word of document_.split(' ')) termSet.add(word);
  const terms = [...termSet];

  return documents.map(document_ => {
    const termCounts = new Map<string, number>();
    for (const word of document_.split(' ')) termCounts.set(word, (termCounts.get(word) || 0) + 1);
    return terms.map(term => termCounts.get(term) || 0);
  });
}

function cosineSimilarity(matrix: number[][]): number[][] {
  const similarities: number[][] = [];
  for (let index = 0; index < matrix.length; index++) {
    const row: number[] = [];
    for (let index_ = 0; index_ < matrix.length; index_++) {
      row.push(similarity.cosine(matrix[index], matrix[index_]));
    }
    similarities.push(row);
  }
  return similarities;
}

async function fetchAllDocuments() {
  // get all blocks
  const blocks = await prisma.block.findMany({
    select: {
      id: true,
      title: true,
      markdown: true,
      page: {
        select: {
          title: true,
          id: true,
          sheet: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  const documents = blocks.map((block) => {
    return block.page.id + " " + block.page.sheet.title + " " + block.page.title + " " + block.title + " " + block.markdown;
  });

  const documentIds = blocks.map((block) => {
    return block.id;
  });

  return { documentIds, documents };
}

const proxThreshold = 0;

function valueFromSimilarity(similarity: number): number {
  return similarity ** 4;
  return 1;
}

const maxLinkSumPerNode = 1.5;
const maxLinksPerNode = 5;

function calculateLinksFromSimilarities(documentIds: string[], similarities: number[][]): Link[] {
  const links: Link[] = [];
  for (let index = 0; index < documentIds.length; index++) {
    const nodeLinks = [];
    // add all links with similarity > proxThreshold
    for (let index_ = index + 1; index_ < documentIds.length; index_++) {
      if (similarities[index]![index_] !== undefined && similarities[index]![index_]! > proxThreshold) {
        nodeLinks.push({
          source: documentIds[index]!,
          target: documentIds[index_]!,
          value: valueFromSimilarity(similarities[index]![index_]!),
        });
      }
    }
    // sort links by value descending
    nodeLinks.sort((a, b) => b.value - a.value);
    let cost = 0;
    let count = 0;
    for (const link of nodeLinks) {
      cost += 1 - link.value;
      count++;
      if (cost >= maxLinkSumPerNode || count >= maxLinksPerNode) {
        break;
      }
      links.push(link);
    }
  }

  return links;

}



export async function rebuildGraph() {
  const { documentIds, documents } = await fetchAllDocuments();
  const preprocessDocuments = documents.map((element) => preprocessDocument(element));
  const documentTermMatrix = termFrequency(preprocessDocuments);
  const similarities = cosineSimilarity(documentTermMatrix);

  const links = calculateLinksFromSimilarities(documentIds, similarities);

  await prisma.link.deleteMany();
  await prisma.link.createMany({
    data: links,
  });
}