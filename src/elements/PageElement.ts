import { Element } from './Element.js';
import { ElementType } from './types.js';

export class PageElement extends Element {
  public title: string;
  public icon?: string;
  public content: Element[];

  constructor({
    title,
    icon,
    content = [],
  }: {
    title: string;
    icon?: string;
    content?: Element[];
  }) {
    super(ElementType.Page);
    this.title = title;
    this.icon = icon;
    this.content = content;
  }

  public getIcon(): string | undefined {
    return this.icon;
  }

  public addElementToBeginning(element: Element): void {
    this.content.unshift(element);
  }

  public addElementToEnd(element: Element): void {
    this.content.push(element);
  }
}
