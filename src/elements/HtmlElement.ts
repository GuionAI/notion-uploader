import { Element } from './Element.js';
import { ElementType } from './types.js';

export class HtmlElement extends Element {
  public html: string;

  constructor({ html }: { html: string }) {
    super(ElementType.Html);
    this.html = html;
  }
}
