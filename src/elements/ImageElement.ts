import { Element } from './Element.js';
import { ElementType } from './types.js';

/**
 * Image element - URL only (no local file support)
 */
export class ImageElement extends Element {
  public url?: string;
  public caption?: string;

  constructor({
    url,
    caption,
  }: {
    url?: string;
    caption?: string;
  }) {
    super(ElementType.Image);
    this.url = url;
    this.caption = caption;
  }
}
