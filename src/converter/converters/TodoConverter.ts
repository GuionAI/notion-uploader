import { Element, ElementType, TodoElement } from '../../elements/index.js';
import { BlockObjectRequest, ElementConverter } from '../types.js';
import { TextConverter } from './TextConverter.js';

export class TodoConverter implements ElementConverter {
  convert(element: Element): BlockObjectRequest {
    if (element.type !== ElementType.Todo) {
      throw new Error(`TodoConverter received wrong element type: ${element.type}`);
    }
    const todoElement = element as TodoElement;
    return {
      type: 'to_do',
      object: 'block',
      to_do: {
        rich_text: TextConverter.convertRichText(todoElement.text),
        checked: todoElement.checked,
      },
    };
  }
}
