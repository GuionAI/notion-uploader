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
import { BlockObjectRequest, ElementConverter } from './types.js';

export class NotionConverter {
  private registry = new Map<ElementType, ElementConverter>();

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

    const converter = this.registry.get(element.type);
    if (!converter) {
      throw new UnsupportedElementError(element.type);
    }

    return converter.convert(element);
  }

  private registerConverters() {
    const convertElement = (element: Element) => this.convertElement(element);

    this.registry.set(ElementType.Text, new TextConverter());
    this.registry.set(ElementType.Quote, new QuoteConverter());
    this.registry.set(ElementType.Callout, new CalloutConverter());
    this.registry.set(
      ElementType.ListItem,
      new ListItemConverter(convertElement)
    );
    this.registry.set(ElementType.Table, new TableConverter());
    this.registry.set(
      ElementType.Toggle,
      new ToggleConverter(convertElement)
    );
    this.registry.set(ElementType.Link, new LinkConverter());
    this.registry.set(ElementType.Divider, new DividerConverter());
    this.registry.set(ElementType.Code, new CodeConverter());
    this.registry.set(ElementType.Image, new ImageConverter());
    this.registry.set(ElementType.Equation, new EquationConverter());
    this.registry.set(ElementType.Todo, new TodoConverter());
  }
}
