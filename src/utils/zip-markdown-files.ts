// utils/zipMarkdownFiles.ts

import archiver from 'archiver';

export const createZipFromMarkdown = async (names: string[], markdownFiles: string[]): Promise<Buffer> => {
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  const zipBuffer: Buffer[] = [];

  archive.on('data', (chunk) => zipBuffer.push(chunk));
  archive.on('error', (error) => { throw error; });

  for (const [index, content] of markdownFiles.entries()) {
    archive.append(content, { name: `${names[index]}.md` });
  }

  await archive.finalize();

  return Buffer.concat(zipBuffer);
};
