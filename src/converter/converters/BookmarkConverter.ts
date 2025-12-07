import { Element, ElementType, BookmarkElement } from '../../elements/index.js';
import { BlockObjectRequest, ElementConverter } from '../types.js';

export class BookmarkConverter implements ElementConverter {
  convert(element: Element): BlockObjectRequest {
    if (element.type !== ElementType.Bookmark) {
      throw new Error(`BookmarkConverter received wrong element type: ${element.type}`);
    }
    const bookmarkElement = element as BookmarkElement;

    return {
      type: 'bookmark',
      object: 'block',
      bookmark: {
        url: bookmarkElement.url,
      },
    };
  }
}
