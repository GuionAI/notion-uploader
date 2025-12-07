import { Element, ElementType, QuoteElement } from '../../elements/index.js';
import { ElementConverter, QuoteBlock } from '../types.js';
import { TextConverter } from './TextConverter.js';

export class QuoteConverter implements ElementConverter {
  convert(element: Element): QuoteBlock {
    if (element.type !== ElementType.Quote) {
      throw new Error(`QuoteConverter received wrong element type: ${element.type}`);
    }
    const quoteElement = element as QuoteElement;
    return {
      type: 'quote',
      object: 'block',
      quote: {
        rich_text: TextConverter.convertRichText(quoteElement.text),
      },
    };
  }
}


