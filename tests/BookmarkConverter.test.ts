import { describe, it, expect } from 'vitest';
import { BookmarkConverter } from '../src/converter/converters/BookmarkConverter';
import { BookmarkElement, ElementType } from '../src/elements';

describe('BookmarkConverter', () => {
  const converter = new BookmarkConverter();

  it('should convert BookmarkElement to Notion bookmark block', () => {
    const element = new BookmarkElement({ url: 'https://example.com' });
    const block = converter.convert(element);

    expect(block).toEqual({
      type: 'bookmark',
      object: 'block',
      bookmark: {
        url: 'https://example.com',
      },
    });
  });

  it('should handle URLs with special characters', () => {
    const element = new BookmarkElement({
      url: 'https://example.com/path?query=value&foo=bar',
    });
    const block = converter.convert(element);

    expect(block.type).toBe('bookmark');
    expect((block as any).bookmark.url).toBe(
      'https://example.com/path?query=value&foo=bar'
    );
  });

  it('should throw error for wrong element type', () => {
    const wrongElement = { type: ElementType.Link } as any;
    expect(() => converter.convert(wrongElement)).toThrow(
      'BookmarkConverter received wrong element type'
    );
  });
});
