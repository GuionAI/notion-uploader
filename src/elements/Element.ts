import { ElementType } from './types.js';

export class Element {
  public type: ElementType;

  constructor(type: ElementType) {
    this.type = type;
  }
}
