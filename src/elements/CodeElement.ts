import { Element } from './Element.js';
import { ElementCodeLanguage, ElementType } from './types.js';

export class CodeElement extends Element {
  public language: ElementCodeLanguage;
  public text: string;

  constructor({
    language,
    text,
  }: {
    language: ElementCodeLanguage;
    text: string;
  }) {
    super(ElementType.Code);
    this.language = language;
    this.text = text;
  }
}
