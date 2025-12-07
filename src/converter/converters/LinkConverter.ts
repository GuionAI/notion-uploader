import { Element, ElementType, LinkElement } from '../../elements/index.js';
import { BlockObjectRequest, ElementConverter } from '../types.js';

export class LinkConverter implements ElementConverter {
  convert(element: Element): BlockObjectRequest {
    if (element.type !== ElementType.Link) {
      throw new Error(`LinkConverter received wrong element type: ${element.type}`);
    }
    const linkElement = element as LinkElement;
    return {
      type: 'paragraph',
      object: 'block',
      paragraph: {
        rich_text: [
          {
            text: {
              content: linkElement.text,
              link: linkElement.url.startsWith('http')
                ? { url: linkElement.url }
                : null,
            },
          },
        ],
        color: 'default',
      },
    };
  }
}

