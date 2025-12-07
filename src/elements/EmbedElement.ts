import { Element } from './Element.js';
import { ElementType } from './types.js';

export class EmbedElement extends Element {
  public url: string;

  constructor({ url }: { url: string }) {
    super(ElementType.Embed);
    this.url = url;
  }
}
