import { Element, ElementType, ListItemElement } from '../../elements/index.js';
import {
  BlockObjectRequest,
  BlockObjectRequestWithoutChildren,
  BulletedListItemBlock,
  ElementConverter,
  NumberedListItemBlock,
} from '../types.js';
import { TextConverter } from './TextConverter.js';

export class ListItemConverter implements ElementConverter {
  private convertElement: (element: Element) => BlockObjectRequest | null;

  constructor(
    convertElement: (element: Element) => BlockObjectRequest | null
  ) {
    this.convertElement = convertElement;
  }

  convert(element: Element): BulletedListItemBlock | NumberedListItemBlock {
    if (element.type !== ElementType.ListItem) {
      throw new Error(`ListItemConverter received wrong element type: ${element.type}`);
    }
    const listItemElement = element as ListItemElement;
    if (listItemElement.listType === 'unordered') {
      return this.convertBulletedListItem(listItemElement);
    } else {
      return this.convertNumberedListItem(listItemElement);
    }
  }

  private convertBulletedListItem(
    element: ListItemElement
  ): BulletedListItemBlock {
    return {
      type: 'bulleted_list_item',
      object: 'block',
      bulleted_list_item: {
        rich_text: TextConverter.convertRichText(element.text),
        children: this.convertListItemChildren(element.children),
      },
    };
  }

  private convertNumberedListItem(
    element: ListItemElement
  ): NumberedListItemBlock {
    return {
      type: 'numbered_list_item',
      object: 'block',
      numbered_list_item: {
        rich_text: TextConverter.convertRichText(element.text),
        children: this.convertListItemChildren(element.children),
      },
    };
  }

  private convertListItemChildren(
    children: ListItemElement['children']
  ): BlockObjectRequestWithoutChildren[] | undefined {
    const convertedChildren = (children ?? [])
      .map((child) => this.convertElement(child))
      .filter((child): child is BlockObjectRequest => child !== null) as BlockObjectRequestWithoutChildren[];

    if (convertedChildren.length === 0) {
      return undefined;
    }

    return convertedChildren;
  }
}


