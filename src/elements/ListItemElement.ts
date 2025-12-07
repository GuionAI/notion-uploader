import { Element } from './Element.js';
import type { RichTextElement } from './TextElement.js';
import { ElementType } from './types.js';

export class ListItemElement extends Element {
  public listType: 'ordered' | 'unordered';
  public text: RichTextElement;
  public children?: Element[];

  constructor({
    listType,
    text,
    children,
  }: {
    listType: 'ordered' | 'unordered';
    text: RichTextElement;
    children?: Element[];
  }) {
    super(ElementType.ListItem);
    this.listType = listType;
    this.text = text;
    this.children = children;
  }
}
