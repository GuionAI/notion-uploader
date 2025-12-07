import {
  TextElement,
  TextElementLevel,
  RichTextElement,
  ElementType,
  LinkElement,
  EquationElement,
  Element,
} from '../../elements/index.js';
import {
  BlockObjectRequest,
  ElementConverter,
  Heading1Block,
  Heading2Block,
  Heading3Block,
  ParagraphBlock,
  RichTextItemRequest,
} from '../types.js';

export class TextConverter implements ElementConverter {
  convert(element: Element): BlockObjectRequest {
    if (element.type !== ElementType.Text) {
      throw new Error(`TextConverter received wrong element type: ${element.type}`);
    }
    return this.convertText(element as TextElement);
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
            rich_text: TextConverter.convertRichText(element.text),
            color: 'default',
            is_toggleable: false,
          },
        };

      case TextElementLevel.Heading2:
        return {
          type: 'heading_2',
          object: 'block',
          heading_2: {
            rich_text: TextConverter.convertRichText(element.text),
            color: 'default',
            is_toggleable: false,
          },
        };

      case TextElementLevel.Heading3:
        return {
          type: 'heading_3',
          object: 'block',
          heading_3: {
            rich_text: TextConverter.convertRichText(element.text),
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
            rich_text: TextConverter.convertRichText(element.text),
            color: 'default',
          },
        };
    }
  }

  public static convertRichText(
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
