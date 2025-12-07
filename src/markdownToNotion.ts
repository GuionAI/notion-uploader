import { NotionClient } from './client/index.js';
import { NotionConverter } from './converter/index.js';
import { MarkdownParser } from './parser/index.js';

export interface MarkdownToNotionOptions {
  /**
   * The markdown content to convert
   */
  markdown: string;

  /**
   * The Notion page ID to update
   */
  notionPageId: string;

  /**
   * Your Notion API key (integration token)
   */
  notionApiKey: string;

  /**
   * Update mode:
   * - 'replace': Delete existing content, then add new content (default)
   * - 'append': Keep existing content, add new content at the end
   */
  mode?: 'replace' | 'append';
}

/**
 * Convert markdown to Notion blocks and update a Notion page
 *
 * @example
 * ```typescript
 * import { markdownToNotion } from '@flicknote/notion-converter';
 *
 * await markdownToNotion({
 *   markdown: '# Hello\n\nSome **bold** text',
 *   notionPageId: 'abc123...',
 *   notionApiKey: 'secret_xxx',
 *   mode: 'replace',
 * });
 * ```
 */
export async function markdownToNotion(
  options: MarkdownToNotionOptions
): Promise<void> {
  const { markdown, notionPageId, notionApiKey, mode = 'replace' } = options;

  // Initialize components
  const client = new NotionClient(notionApiKey);
  const parser = new MarkdownParser();
  const converter = new NotionConverter();

  // Check page accessibility
  const isAccessible = await client.isPageAccessible(notionPageId);
  if (!isAccessible) {
    throw new Error(
      `Cannot access Notion page ${notionPageId}. Make sure the page exists and your integration has access.`
    );
  }

  // Parse markdown to elements
  const elements = parser.parse(markdown);

  // Convert elements to Notion blocks
  const blocks = converter.convert(elements);

  // Update page
  if (mode === 'replace') {
    await client.deleteChildBlocks(notionPageId);
  }

  await client.appendBlocks(notionPageId, blocks);
}
