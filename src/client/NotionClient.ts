import { Client } from '@notionhq/client';
import type { BlockObjectRequest } from '../converter/types.js';

const NOTION_BLOCK_LIMIT = 100;

export class NotionClient {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client({ auth: apiKey });
  }

  /**
   * Delete all child blocks from a page
   */
  async deleteChildBlocks(pageId: string): Promise<void> {
    const blocks = await this.client.blocks.children.list({
      block_id: pageId,
    });

    for (const block of blocks.results) {
      await this.client.blocks.delete({ block_id: block.id });
    }
  }

  /**
   * Append blocks to a page (handles chunking for 100 block limit)
   */
  async appendBlocks(pageId: string, blocks: BlockObjectRequest[]): Promise<void> {
    if (blocks.length === 0) return;

    // Split into chunks of 100 blocks
    for (let i = 0; i < blocks.length; i += NOTION_BLOCK_LIMIT) {
      const chunk = blocks.slice(i, i + NOTION_BLOCK_LIMIT);
      await this.client.blocks.children.append({
        block_id: pageId,
        children: chunk as Parameters<typeof this.client.blocks.children.append>[0]['children'],
      });
    }
  }

  /**
   * Check if a page is accessible
   */
  async isPageAccessible(pageId: string): Promise<boolean> {
    try {
      await this.client.pages.retrieve({ page_id: pageId });
      return true;
    } catch {
      return false;
    }
  }
}
