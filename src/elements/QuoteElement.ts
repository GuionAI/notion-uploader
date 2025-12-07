import { Element } from './Element.js';
import { ElementType } from './types.js';

export class QuoteElement extends Element {
  public text: string;

  constructor({ text }: { text: string }) {
    super(ElementType.Quote);
    this.text = text;
  }
}
