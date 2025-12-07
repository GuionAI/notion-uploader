import { Element, ElementType } from '../../elements/index.js';
import { BlockObjectRequest, ElementConverter } from '../types.js';

export class DividerConverter implements ElementConverter {
  convert(element: Element): BlockObjectRequest {
    if (element.type !== ElementType.Divider) {
      throw new Error(`DividerConverter received wrong element type: ${element.type}`);
    }
    return {
      type: 'divider',
      object: 'block',
      divider: {},
    };
  }
}

