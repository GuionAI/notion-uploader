import { Client } from '@notionhq/client';
import { BlockObjectRequest, getBlockChildren, stripBlockChildren } from '../converter/types.js';

const NOTION_BLOCK_LIMIT = 100;

export class NotionClient {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client({
      auth: apiKey,
      fetch: (...args) => fetch(...args),
    });
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
   * Append blocks to a page (handles chunking and deep nesting)
   */
  async appendBlocks(pageId: string, blocks: BlockObjectRequest[]): Promise<void> {
    if (blocks.length === 0) return;

    const maxDepth = this.getMaxDepth(blocks);

    if (maxDepth <= 2) {
      // Simple: send blocks as-is with inline children
      await this.appendBlocksSimple(pageId, blocks);
    } else {
      // Recursive: strip children, upload parents first, then children
      await this.appendBlocksRecursive(pageId, blocks);
    }
  }

  /**
   * Calculate the maximum nesting depth of blocks
   */
  private getMaxDepth(blocks: BlockObjectRequest[], depth = 1): number {
    let max = depth;
    for (const block of blocks) {
      const children = getBlockChildren(block);
      if (children?.length) {
        max = Math.max(max, this.getMaxDepth(children, depth + 1));
      }
    }
    return max;
  }

  /**
   * Simple append: send blocks with inline children (for depth ≤ 2)
   */
  private async appendBlocksSimple(parentId: string, blocks: BlockObjectRequest[]): Promise<void> {
    for (let i = 0; i < blocks.length; i += NOTION_BLOCK_LIMIT) {
      const chunk = blocks.slice(i, i + NOTION_BLOCK_LIMIT);
      await this.client.blocks.children.append({
        block_id: parentId,
        children: chunk as Parameters<typeof this.client.blocks.children.append>[0]['children'],
      });
    }
  }

  /**
   * Recursive append: strip children, upload parents, then upload children separately
   * This handles Notion's ~2 level nesting limit per request
   */
  private async appendBlocksRecursive(parentId: string, blocks: BlockObjectRequest[]): Promise<void> {
    for (let i = 0; i < blocks.length; i += NOTION_BLOCK_LIMIT) {
      const chunk = blocks.slice(i, i + NOTION_BLOCK_LIMIT);

      // Strip children from blocks
      const parentsOnly = chunk.map(stripBlockChildren);

      // Upload parents
      const response = await this.client.blocks.children.append({
        block_id: parentId,
        children: parentsOnly as Parameters<typeof this.client.blocks.children.append>[0]['children'],
      });

      // Recursively upload children to the newly created blocks
      for (let j = 0; j < response.results.length; j++) {
        const originalChildren = getBlockChildren(chunk[j]);

        if (originalChildren?.length) {
          await this.appendBlocksRecursive(response.results[j].id, originalChildren);
        }
      }
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
