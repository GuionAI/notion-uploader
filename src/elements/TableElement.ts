import { Element } from './Element.js';
import { ElementType } from './types.js';

export class TableElement extends Element {
  public rows: string[][];

  constructor({ rows }: { rows: string[][] }) {
    super(ElementType.Table);
    this.rows = rows;
  }
}
