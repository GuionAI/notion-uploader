import {
  CalloutElement,
  CodeElement,
  Element,
  ElementCodeLanguage,
  ElementType,
  EquationElement,
  HtmlElement,
  ImageElement,
  LinkElement,
  ListItemElement,
  QuoteElement,
  RichTextElement,
  TableElement,
  TextElement,
  TextElementLevel,
  ToggleElement,
} from '../elements/index.js';
import {
  BlockObjectRequest,
  BlockObjectRequestWithoutChildren,
  BulletedListItemBlock,
  CalloutBlock,
  EquationBlock,
  Heading1Block,
  Heading2Block,
  Heading3Block,
  LanguageRequest,
  NumberedListItemBlock,
  ParagraphBlock,
  QuoteBlock,
  RichTextItemRequest,
  TableBlock,
  TableRowBlock,
  ToggleBlock,
} from './types.js';

const SUPPORTED_IMAGE_URL_EXTENSIONS = [
  '.bmp', '.gif', '.heic', '.jpeg', '.jpg', '.png', '.svg', '.tif', '.tiff',
];

export class NotionConverter {
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

  private convertElement(element: Element): BlockObjectRequest | null {
    switch (element.type) {
      case ElementType.Page:
        return null;
      case ElementType.Text:
        return this.convertText(element as TextElement);
      case ElementType.Quote:
        return this.convertQuote(element as QuoteElement);
      case ElementType.Callout:
        return this.convertCallout(element as CalloutElement);
      case ElementType.ListItem:
        return this.convertListItem(element as ListItemElement);
      case ElementType.Table:
        return this.convertTable(element as TableElement);
      case ElementType.Toggle:
        return this.convertToggle(element as ToggleElement);
      case ElementType.Link:
        return this.convertLink(element as LinkElement);
      case ElementType.Divider:
        return this.convertDivider();
      case ElementType.Code:
        return this.convertCodeBlock(element as CodeElement);
      case ElementType.Image:
        return this.convertImage(element as ImageElement);
      case ElementType.Html:
        return this.convertHtml(element as HtmlElement);
      case ElementType.Equation:
        return this.convertEquation(element as EquationElement);
      default:
        console.warn(`Unsupported element type: ${element.type}`);
        return null;
    }
  }

  private convertText(
    element: TextElement
  ): ParagraphBlock | Heading1Block | Heading2Block | Heading3Block {
    switch (element.level) {
      case TextElementLevel.Heading1:
        return {
          type: 'heading_1',
          object: 'block',
          heading_1: {
            rich_text: this.convertRichText(element.text),
            color: 'default',
            is_toggleable: false,
          },
        };

      case TextElementLevel.Heading2:
        return {
          type: 'heading_2',
          object: 'block',
          heading_2: {
            rich_text: this.convertRichText(element.text),
            color: 'default',
            is_toggleable: false,
          },
        };

      case TextElementLevel.Heading3:
        return {
          type: 'heading_3',
          object: 'block',
          heading_3: {
            rich_text: this.convertRichText(element.text),
            color: 'default',
            is_toggleable: false,
          },
        };

      case TextElementLevel.Paragraph:
      default:
        return {
          type: 'paragraph',
          object: 'block',
          paragraph: {
            rich_text: this.convertRichText(element.text),
            color: 'default',
          },
        };
    }
  }

  private convertQuote(element: QuoteElement): QuoteBlock {
    return {
      type: 'quote',
      object: 'block',
      quote: {
        rich_text: this.convertRichText(element.text),
      },
    };
  }

  private convertCallout(element: CalloutElement): CalloutBlock {
    const icon = element.getIcon();
    const calloutParams: CalloutBlock['callout'] = {
      rich_text: this.convertRichText(element.text),
    };

    if (icon) {
      calloutParams.icon = { type: 'emoji', emoji: icon };
    }

    return {
      type: 'callout',
      object: 'block',
      callout: calloutParams,
    };
  }

  private convertListItem(
    element: ListItemElement
  ): BulletedListItemBlock | NumberedListItemBlock {
    if (element.listType === 'unordered') {
      return this.convertBulletedListItem(element);
    } else {
      return this.convertNumberedListItem(element);
    }
  }

  private convertBulletedListItem(
    element: ListItemElement
  ): BulletedListItemBlock {
    return {
      type: 'bulleted_list_item',
      object: 'block',
      bulleted_list_item: {
        rich_text: this.convertRichText(element.text),
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
        rich_text: this.convertRichText(element.text),
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

  private convertTable(element: TableElement): TableBlock {
    return {
      type: 'table',
      object: 'block',
      table: {
        table_width: element.rows[0]?.length || 0,
        has_column_header: false,
        has_row_header: false,
        children: element.rows.map((row) => this.convertTableRow(row)),
      },
    };
  }

  private convertTableRow(row: string[]): TableRowBlock {
    return {
      type: 'table_row',
      object: 'block',
      table_row: {
        cells: row.map((cell) => this.convertRichText(cell)),
      },
    };
  }

  private convertToggle(element: ToggleElement): ToggleBlock {
    const children: BlockObjectRequestWithoutChildren[] = [];

    for (const contentElement of element.children) {
      const convertedElement = this.convertElement(contentElement);
      if (convertedElement) {
        children.push(convertedElement as BlockObjectRequestWithoutChildren);
      }
    }

    return {
      type: 'toggle',
      object: 'block',
      toggle: {
        rich_text: this.convertRichText(element.title),
        children,
      },
    };
  }

  private convertLink(element: LinkElement): BlockObjectRequest {
    return {
      type: 'paragraph',
      object: 'block',
      paragraph: {
        rich_text: [
          {
            text: {
              content: element.text,
              link: element.url.startsWith('http')
                ? { url: element.url }
                : null,
            },
          },
        ],
        color: 'default',
      },
    };
  }

  private convertDivider(): BlockObjectRequest {
    return {
      type: 'divider',
      object: 'block',
      divider: {},
    };
  }

  private getNotionLanguageFromElementLanguage(
    language: ElementCodeLanguage
  ): LanguageRequest {
    const languageMap: Record<ElementCodeLanguage, LanguageRequest> = {
      [ElementCodeLanguage.JavaScript]: 'javascript',
      [ElementCodeLanguage.TypeScript]: 'typescript',
      [ElementCodeLanguage.Python]: 'python',
      [ElementCodeLanguage.Java]: 'java',
      [ElementCodeLanguage.CSharp]: 'c#',
      [ElementCodeLanguage.CPlusPlus]: 'c++',
      [ElementCodeLanguage.Go]: 'go',
      [ElementCodeLanguage.Ruby]: 'ruby',
      [ElementCodeLanguage.Swift]: 'swift',
      [ElementCodeLanguage.Kotlin]: 'kotlin',
      [ElementCodeLanguage.Rust]: 'rust',
      [ElementCodeLanguage.Scala]: 'scala',
      [ElementCodeLanguage.Shell]: 'bash',
      [ElementCodeLanguage.SQL]: 'sql',
      [ElementCodeLanguage.HTML]: 'html',
      [ElementCodeLanguage.CSS]: 'css',
      [ElementCodeLanguage.JSON]: 'json',
      [ElementCodeLanguage.YAML]: 'yaml',
      [ElementCodeLanguage.Markdown]: 'markdown',
      [ElementCodeLanguage.Mermaid]: 'mermaid',
      [ElementCodeLanguage.PlainText]: 'plain text',
    };

    return languageMap[language] || 'plain text';
  }

  private convertCodeBlock(element: CodeElement): BlockObjectRequest {
    return {
      type: 'code',
      object: 'block',
      code: {
        rich_text: this.convertRichText(element.text),
        language: this.getNotionLanguageFromElementLanguage(element.language),
      },
    };
  }

  private convertImage(element: ImageElement): BlockObjectRequest {
    // Only support external URLs
    if (!element.url || !element.url.startsWith('http')) {
      console.warn(`Non-URL image not supported: ${element.url}`);
      return {
        type: 'paragraph',
        object: 'block',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `[Image: ${element.caption || element.url || 'unknown'}]`,
              },
            },
          ],
          color: 'default',
        },
      };
    }

    // Check for supported extensions
    if (!SUPPORTED_IMAGE_URL_EXTENSIONS.some((ext) => element.url?.toLowerCase().endsWith(ext))) {
      console.warn(`Unsupported image URL extension: ${element.url}`);
      return {
        type: 'paragraph',
        object: 'block',
        paragraph: {
          rich_text: [],
          color: 'default',
        },
      };
    }

    return {
      type: 'image',
      object: 'block',
      image: {
        type: 'external',
        external: {
          url: element.url,
        },
      },
    };
  }

  private convertHtml(element: HtmlElement): BlockObjectRequest {
    return {
      type: 'code',
      object: 'block',
      code: {
        language: 'html',
        rich_text: this.convertRichText(element.html),
      },
    };
  }

  private convertEquation(element: EquationElement): EquationBlock {
    return {
      type: 'equation',
      object: 'block',
      equation: { expression: element.equation },
    };
  }

  private convertRichText(
    content: undefined | string | RichTextElement
  ): RichTextItemRequest[] {
    if (content === undefined) {
      return [];
    }

    if (typeof content === 'string') {
      // Split string into chunks of 2000 characters (Notion limit)
      const MAX_LENGTH = 2000;
      const chunks: string[] = [];
      for (let i = 0; i < content.length; i += MAX_LENGTH) {
        chunks.push(content.slice(i, i + MAX_LENGTH));
      }
      return chunks.map((chunk) => ({
        type: 'text' as const,
        text: {
          content: chunk,
        },
      }));
    }

    if (Array.isArray(content)) {
      return content.reduce<RichTextItemRequest[]>((acc, element) => {
        if (element.type === ElementType.Text) {
          const textElement = element as TextElement;
          acc.push({
            type: 'text',
            text: {
              content: textElement.text as string,
            },
            annotations: {
              bold: textElement.styles.bold,
              italic: textElement.styles.italic,
              strikethrough: textElement.styles.strikethrough,
              underline: textElement.styles.underline,
              code: textElement.styles.code,
            },
          });
        }

        if (element instanceof LinkElement) {
          acc.push({
            type: 'text',
            text: {
              content: element.text,
              link: element.url.startsWith('http')
                ? { url: element.url }
                : null,
            },
          });
        }

        if (element instanceof EquationElement) {
          acc.push({
            type: 'equation',
            equation: {
              expression: element.equation,
            },
            annotations: {
              bold: element.styles.bold,
              italic: element.styles.italic,
              strikethrough: element.styles.strikethrough,
              underline: element.styles.underline,
              code: element.styles.code,
            },
          });
        }

        return acc;
      }, []);
    }

    throw new Error(`Unsupported content type: ${typeof content}`);
  }
}
