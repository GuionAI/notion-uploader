import { Element, ElementType, EquationElement } from '../../elements/index.js';
import { ElementConverter, EquationBlock } from '../types.js';

export class EquationConverter implements ElementConverter {
  convert(element: Element): EquationBlock {
    if (element.type !== ElementType.Equation) {
      throw new Error(`EquationConverter received wrong element type: ${element.type}`);
    }
    const equationElement = element as EquationElement;
    return {
      type: 'equation',
      object: 'block',
      equation: { expression: equationElement.equation },
    };
  }
}

