export function normalizeMarkdown(markdown: string): string {
  // 1. we only allow $...$ as inline math
  markdown = markdown.replaceAll('\\(', "$");
  markdown = markdown.replaceAll('\\)', "$");

  // 2. we only allow $$...$$ as block math
  markdown = markdown.replaceAll('\\[', "$$");
  markdown = markdown.replaceAll('\\]', "$$");
  return markdown;
}