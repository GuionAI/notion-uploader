import { ElementType } from '../elements/index.js';
import { ElementConverter } from './types.js';

const converterRegistry = new Map<ElementType, ElementConverter>();

export function registerConverter(
  elementType: ElementType,
  converter: ElementConverter
): void {
  converterRegistry.set(elementType, converter);
}

export function getConverter(elementType: ElementType): ElementConverter | null {
  return converterRegistry.get(elementType) || null;
}
