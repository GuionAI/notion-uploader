import { marked, Tokens } from 'marked';
import markedKatex from 'marked-katex-extension';

import {
  BookmarkElement,
  CalloutElement,
  CodeElement,
  DividerElement,
  Element,
  ElementCodeLanguage,
  EmbedElement,
  EquationElement,
  ImageElement,
  isElementCodeLanguage,
  LinkElement,
  ListItemElement,
  QuoteElement,
  RichTextElement,
  TableElement,
  TextElement,
  TextElementLevel,
  TodoElement,
} from '../elements/index.js';
import { EquationToken, ExtendedToken } from './types.js';

export class MarkdownParser {
  constructor() {
    marked.use(markedKatex({ throwOnError: false, nonStandard: true }));
  }

  private preParseMarkdown(src: string): ExtendedToken[] {
    return marked.lexer(src);
  }

  private getTextLevelFromDepth(depth: number): TextElementLevel {
    const mapping: Record<number, TextElementLevel> = {
      1: TextElementLevel.Heading1,
      2: TextElementLevel.Heading2,
      3: TextElementLevel.Heading3,
      4: TextElementLevel.Heading4,
      5: TextElementLevel.Heading5,
      6: TextElementLevel.Heading6,
    };

    if (depth < 1 || depth > 6) {
      return TextElementLevel.Paragraph;
    }

    return mapping[depth];
  }

  private parseHeadingToken(token: Tokens.Heading): TextElement {
    const level = this.getTextLevelFromDepth(token.depth);
    return new TextElement({
      text: token.text,
      level,
    });
  }

  private parseListToken(token: Tokens.List): (ListItemElement | TodoElement)[] {
    return token.items.map((item) => {
      let text: RichTextElement = [];
      const children: Element[] = [];

      const paragraph = item.tokens.shift();

      if (paragraph && paragraph.type === 'text') {
        text = this.parseParagraphToken(paragraph as Tokens.Paragraph);
      }

      if (item.tokens) {
        for (const nestedToken of item.tokens) {
          const contentItem = this.parseToken(nestedToken);
          children.push(...contentItem);
        }
      }

      if (item.task) {
        return new TodoElement(text, item.checked || false);
      }

      return new ListItemElement({
        listType: token.ordered ? 'ordered' : 'unordered',
        text,
        children: children.length > 0 ? children : undefined,
      });
    });
  }

  private parseBlockQuoteToken(
    token: Tokens.Blockquote
  ): QuoteElement | CalloutElement {
    const text = token.text.trim();
    if (text.startsWith('[!NOTE]')) {
      return new CalloutElement({
        text: text.replace('[!NOTE]', '').trim(),
        icon: '💡',
      });
    }
    return new QuoteElement({
      text: text,
    });
  }

  private parseCodeToken(token: Tokens.Code): CodeElement {
    const language = token.lang || ElementCodeLanguage.PlainText;

    if (language === 'js') {
      return new CodeElement({
        text: token.text,
        language: ElementCodeLanguage.JavaScript,
      });
    }

    const isSupportedLanguage = isElementCodeLanguage(language);

    if (!isSupportedLanguage) {
      return new CodeElement({
        text: token.text,
        language: ElementCodeLanguage.PlainText,
      });
    }

    return new CodeElement({
      text: token.text,
      language,
    });
  }

  private parseCalloutToken(token: Tokens.Generic): CalloutElement {
    if (!token.callout || typeof token.callout !== 'string') {
      throw new Error('Callout token does not have a callout property');
    }

    return new CalloutElement({
      text: token.callout,
      icon: '💡',
    });
  }

  private parseTableToken(token: Tokens.Table): TableElement {
    const headers = token.header.map((cell) => cell.text);
    const rows = token.rows.map((row) => row.map((cell) => cell.text));

    return new TableElement({
      rows: [headers, ...rows],
    });
  }

  private parseImageToken(token: Tokens.Image): ImageElement {
    return new ImageElement({
      url: token.href,
      caption: token.text,
    });
  }

  private parseLinkToken(token: Tokens.Link): LinkElement {
    return new LinkElement({
      text: token.text,
      url: token.href,
    });
  }

  private parseTextToken(
    token:
      | Tokens.Text
      | Tokens.Strong
      | Tokens.Em
      | Tokens.Del
      | Tokens.Codespan
  ): TextElement {
    if (token.type === 'strong') {
      return new TextElement({
        text: token.text,
        styles: {
          bold: true,
          italic: false,
          strikethrough: false,
          underline: false,
          code: false,
        },
      });
    }

    if (token.type === 'em') {
      return new TextElement({
        text: token.text,
        styles: {
          bold: false,
          italic: true,
          strikethrough: false,
          underline: false,
          code: false,
        },
      });
    }

    if (token.type === 'del') {
      return new TextElement({
        text: token.text,
        styles: {
          bold: false,
          italic: false,
          strikethrough: true,
          underline: false,
          code: false,
        },
      });
    }

    if (token.type === 'codespan') {
      return new TextElement({
        text: token.text,
        styles: {
          bold: false,
          italic: false,
          strikethrough: false,
          underline: false,
          code: true,
        },
      });
    }

    return new TextElement({
      text: token.text,
    });
  }

  private parseBlockKatexToken(token: EquationToken): EquationElement {
    return new EquationElement({
      equation: token.text,
      styles: {
        italic: false,
        bold: false,
        strikethrough: false,
        underline: false,
      },
    });
  }

  private parseParagraphToken(token: Tokens.Paragraph): RichTextElement {
    const elements: RichTextElement = [];

    token.tokens.forEach((t) => {
      switch (t.type) {
        case 'text':
          elements.push(this.parseTextToken(t as Tokens.Text));
          break;
        case 'inlineKatex':
          elements.push(this.parseBlockKatexToken(t as unknown as EquationToken));
          break;
        case 'strong':
          elements.push(this.parseTextToken(t as Tokens.Strong));
          break;
        case 'em':
          elements.push(this.parseTextToken(t as Tokens.Em));
          break;
        case 'del':
          elements.push(this.parseTextToken(t as Tokens.Del));
          break;
        case 'codespan':
          elements.push(this.parseTextToken(t as Tokens.Codespan));
          break;
        case 'link':
          elements.push(this.parseLinkToken(t as Tokens.Link));
          break;
        case 'image':
          elements.push(this.parseImageToken(t as Tokens.Image));
          break;
      }
    });

    return elements;
  }

  private parseToken(token: ExtendedToken): Element[] {
    const elements: Element[] = [];

    switch (token.type) {
      case 'heading': {
        elements.push(this.parseHeadingToken(token as Tokens.Heading));
        break;
      }
      case 'paragraph': {
        if (token.tokens?.length === 1 && token.tokens[0].type === 'image') {
          elements.push(this.parseImageToken(token.tokens[0] as Tokens.Image));
        } else if (token.tokens?.length === 1 && token.tokens[0].type === 'link') {
          const linkToken = token.tokens[0] as Tokens.Link;
          if (linkToken.text === '!bookmark') {
            elements.push(new BookmarkElement({ url: linkToken.href }));
          } else if (linkToken.text === '!embed') {
            elements.push(new EmbedElement({ url: linkToken.href }));
          } else {
            elements.push(
              new TextElement({
                text: this.parseParagraphToken(token as Tokens.Paragraph),
                level: TextElementLevel.Paragraph,
              })
            );
          }
        } else {
          elements.push(
            new TextElement({
              text: this.parseParagraphToken(token as Tokens.Paragraph),
              level: TextElementLevel.Paragraph,
            })
          );
        }

        break;
      }
      case 'text': {
        elements.push(this.parseTextToken(token as Tokens.Text));
        break;
      }
      case 'list':
        const listItems = this.parseListToken(token as Tokens.List);
        elements.push(...listItems);
        break;
      case 'blockquote': {
        elements.push(this.parseBlockQuoteToken(token as Tokens.Blockquote));
        break;
      }
      case 'code':
        elements.push(this.parseCodeToken(token as Tokens.Code));
        break;
      case 'callout':
        elements.push(this.parseCalloutToken(token));
        break;
      case 'table': {
        elements.push(this.parseTableToken(token as Tokens.Table));
        break;
      }
      case 'hr':
        elements.push(new DividerElement());
        break;
      case 'image':
        elements.push(this.parseImageToken(token as Tokens.Image));
        break;
      case 'link':
        elements.push(this.parseLinkToken(token as Tokens.Link));
        break;
      case 'strong':
      case 'em':
      case 'del':
        elements.push(this.parseTextToken(token as Tokens.Strong | Tokens.Em));
        break;
      case 'blockKatex':
        elements.push(this.parseBlockKatexToken(token as EquationToken));
        break;
      case 'inlineKatex':
        elements.push(this.parseBlockKatexToken(token as EquationToken));
        break;
      default:
        break;
    }

    return elements;
  }

  parse(markdown: string): Element[] {
    const tokens = this.preParseMarkdown(markdown);

    const elements: Element[] = [];

    for (const token of tokens) {
      elements.push(...this.parseToken(token));
    }

    return elements;
  }
}
