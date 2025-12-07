import { Element, ElementType, EmbedElement } from '../../elements/index.js';
import { BlockObjectRequest, ElementConverter } from '../types.js';

export class EmbedConverter implements ElementConverter {
  convert(element: Element): BlockObjectRequest {
    if (element.type !== ElementType.Embed) {
      throw new Error(`EmbedConverter received wrong element type: ${element.type}`);
    }
    const embedElement = element as EmbedElement;

    return {
      type: 'embed',
      object: 'block',
      embed: {
        url: embedElement.url,
      },
    };
  }
}
