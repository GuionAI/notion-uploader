import { Element, ElementType, ToggleElement } from '../../elements/index.js';
import {
  BlockObjectRequest,
  BlockObjectRequestWithoutChildren,
  ElementConverter,
  ToggleBlock,
} from '../types.js';
import { TextConverter } from './TextConverter.js';

export class ToggleConverter implements ElementConverter {
  private convertElement: (element: Element) => BlockObjectRequest | null;

  constructor(
    convertElement: (element: Element) => BlockObjectRequest | null
  ) {
    this.convertElement = convertElement;
  }

  convert(element: Element): ToggleBlock {
    if (element.type !== ElementType.Toggle) {
      throw new Error(`ToggleConverter received wrong element type: ${element.type}`);
    }
    const toggleElement = element as ToggleElement;
    const children: BlockObjectRequestWithoutChildren[] = [];

    for (const contentElement of toggleElement.children) {
      const convertedElement = this.convertElement(contentElement);
      if (convertedElement) {
        children.push(convertedElement as BlockObjectRequestWithoutChildren);
      }
    }

    return {
      type: 'toggle',
      object: 'block',
      toggle: {
        rich_text: TextConverter.convertRichText(toggleElement.title),
        children,
      },
    };
  }
}



