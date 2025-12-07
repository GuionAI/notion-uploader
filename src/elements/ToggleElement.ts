import { Element } from './Element.js';
import { ElementType } from './types.js';

export class ToggleElement extends Element {
  public title: string;
  public children: Element[];

  constructor({ title, children }: { title: string; children: Element[] }) {
    super(ElementType.Toggle);
    this.title = title;
    this.children = children;
  }
}
