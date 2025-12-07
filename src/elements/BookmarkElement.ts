import { Element } from './Element.js';
import { ElementType } from './types.js';

export class BookmarkElement extends Element {
  public url: string;
  public caption?: string;

  constructor({
    url,
    caption,
  }: {
    url: string;
    caption?: string;
  }) {
    super(ElementType.Bookmark);
    this.url = url;
    this.caption = caption;
  }
}
