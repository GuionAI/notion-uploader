import {
  Element,
  ElementType,
} from '../elements/index.js';
import { UnsupportedElementError } from '../errors.js';
import {
  CalloutConverter,
  CodeConverter,
  DividerConverter,
  EquationConverter,
  ImageConverter,
  LinkConverter,
  ListItemConverter,
  QuoteConverter,
  TableConverter,
  TextConverter,
  ToggleConverter,
  TodoConverter,
} from './converters/index.js';
import { getConverter, registerConverter } from './registry.js';
import { BlockObjectRequest } from './types.js';

export class NotionConverter {
  constructor() {
    this.registerConverters();
  }

  convert(elements: Element[]): BlockObjectRequest[] {
    const blocks: BlockObjectRequest[] = [];

    for (const element of elements) {
      const block = this.convertElement(element);
      if (block) {
        blocks.push(block);
      }
    }

    return blocks;
  }

  convertElement(element: Element): BlockObjectRequest | null {
    if (element.type === ElementType.Page) {
      return null;
    }

    const converter = getConverter(element.type);
    if (!converter) {
      throw new UnsupportedElementError(element.type);
    }

    return converter.convert(element);
  }

  private registerConverters() {
    const convertElement = (element: Element) => this.convertElement(element);

    registerConverter(ElementType.Text, new TextConverter());
    registerConverter(ElementType.Quote, new QuoteConverter());
    registerConverter(ElementType.Callout, new CalloutConverter());
    registerConverter(
      ElementType.ListItem,
      new ListItemConverter(convertElement)
    );
    registerConverter(ElementType.Table, new TableConverter());
    registerConverter(
      ElementType.Toggle,
      new ToggleConverter(convertElement)
    );
    registerConverter(ElementType.Link, new LinkConverter());
    registerConverter(ElementType.Divider, new DividerConverter());
    registerConverter(ElementType.Code, new CodeConverter());
    registerConverter(ElementType.Image, new ImageConverter());
    registerConverter(ElementType.Equation, new EquationConverter());
    registerConverter(ElementType.Todo, new TodoConverter());
  }
}