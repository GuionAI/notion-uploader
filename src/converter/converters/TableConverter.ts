import { Element, ElementType, TableElement } from '../../elements/index.js';
import {
  ElementConverter,
  TableBlock,
  TableRowBlock,
} from '../types.js';
import { TextConverter } from './TextConverter.js';

export class TableConverter implements ElementConverter {
  convert(element: Element): TableBlock {
    if (element.type !== ElementType.Table) {
      throw new Error(`TableConverter received wrong element type: ${element.type}`);
    }
    const tableElement = element as TableElement;
    return {
      type: 'table',
      object: 'block',
      table: {
        table_width: tableElement.rows[0]?.length || 0,
        has_column_header: false,
        has_row_header: false,
        children: tableElement.rows.map((row) => this.convertTableRow(row)),
      },
    };
  }

  private convertTableRow(row: string[]): TableRowBlock {
    return {
      type: 'table_row',
      object: 'block',
      table_row: {
        cells: row.map((cell) => TextConverter.convertRichText(cell)),
      },
    };
  }
}


