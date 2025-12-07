import { Element } from './Element.js';
import { ElementType } from './types.js';
import { RichTextElement } from './TextElement.js';

export class TodoElement extends Element {
  text: string | RichTextElement;
  checked: boolean;

  constructor(text: string | RichTextElement, checked: boolean) {
    super(ElementType.Todo);
    this.text = text;
    this.checked = checked;
  }
}
