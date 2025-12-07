import { Element } from './Element.js';
import { ElementType } from './types.js';

export class DividerElement extends Element {
  constructor() {
    super(ElementType.Divider);
  }
}
