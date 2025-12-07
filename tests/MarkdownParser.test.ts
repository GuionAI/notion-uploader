import { describe, it, expect } from 'vitest';
import { MarkdownParser } from '../src/parser/MarkdownParser';
import {
  CalloutElement,
  CodeElement,
  DividerElement,
  ElementCodeLanguage,
  ElementType,
  EquationElement,
  ImageElement,
  LinkElement,
  ListItemElement,
  QuoteElement,
  TableElement,
  TextElement,
  TextElementLevel,
  TodoElement,
} from '../src/elements';

describe('MarkdownParser', () => {
  const parser = new MarkdownParser();

  it('should parse headings', () => {
    const markdown = '# Hello World';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInstanceOf(TextElement);
    const textElement = elements[0] as TextElement;
    expect(textElement.level).toBe(TextElementLevel.Heading1);
    expect(textElement.text).toBe('Hello World');
  });

  it('should parse paragraphs', () => {
    const markdown = 'This is a paragraph.';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInstanceOf(TextElement);
    const textElement = elements[0] as TextElement;
    expect(textElement.level).toBe(TextElementLevel.Paragraph);
    expect(textElement.text).toEqual([
      expect.objectContaining({
        text: 'This is a paragraph.',
      }),
    ]);
  });

  it('should parse bold text', () => {
    const markdown = '**bold text**';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    const textElement = elements[0] as TextElement;
    const richText = textElement.text as TextElement[];
    expect(richText[0].styles.bold).toBe(true);
    expect(richText[0].text).toBe('bold text');
  });

  it('should parse italic text', () => {
    const markdown = '*italic text*';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    const textElement = elements[0] as TextElement;
    const richText = textElement.text as TextElement[];
    expect(richText[0].styles.italic).toBe(true);
    expect(richText[0].text).toBe('italic text');
  });

  it('should parse strikethrough text', () => {
    const markdown = '~~strikethrough text~~';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    const textElement = elements[0] as TextElement;
    const richText = textElement.text as TextElement[];
    expect(richText[0].styles.strikethrough).toBe(true);
    expect(richText[0].text).toBe('strikethrough text');
  });

  it('should parse links', () => {
    const markdown = '[Google](https://google.com)';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    const textElement = elements[0] as TextElement;
    const richText = textElement.text as LinkElement[];
    expect(richText[0].type).toBe(ElementType.Link);
    expect(richText[0].text).toBe('Google');
    expect(richText[0].url).toBe('https://google.com');
  });

  it('should parse images', () => {
    const markdown = '![alt text](https://link.to/image.png)';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInstanceOf(ImageElement);
    const imageElement = elements[0] as ImageElement;
    expect(imageElement.url).toBe('https://link.to/image.png');
    expect(imageElement.caption).toBe('alt text');
  });

  it('should parse blockquotes', () => {
    const markdown = '> This is a blockquote.';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInstanceOf(QuoteElement);
    const quoteElement = elements[0] as QuoteElement;
    expect(quoteElement.text).toBe('This is a blockquote.');
  });

  it('should parse callouts', () => {
    const markdown = '> [!NOTE]\n> This is a callout.';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInstanceOf(CalloutElement);
    const calloutElement = elements[0] as CalloutElement;
    expect(calloutElement.text).toBe('This is a callout.');
    expect(calloutElement.getIcon()).toBe('💡');
  });

  it('should parse code blocks', () => {
    const markdown = '```javascript\nconst x = 1;\n```';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInstanceOf(CodeElement);
    const codeElement = elements[0] as CodeElement;
    expect(codeElement.language).toBe(ElementCodeLanguage.JavaScript);
    expect(codeElement.text).toBe('const x = 1;');
  });

  it('should parse tables', () => {
    const markdown = "| Head 1 | Head 2 |\n| ------ | ------ |\n| Cell 1 | Cell 2 |";
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInstanceOf(TableElement);
    const tableElement = elements[0] as TableElement;
    expect(tableElement.rows).toEqual([
      ['Head 1', 'Head 2'],
      ['Cell 1', 'Cell 2'],
    ]);
  });

  it('should parse unordered lists', () => {
    const markdown = '- Item 1\n- Item 2';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(2);
    expect(elements[0]).toBeInstanceOf(ListItemElement);
    const listItem1 = elements[0] as ListItemElement;
    expect(listItem1.listType).toBe('unordered');
    expect(listItem1.text).toEqual([
      expect.objectContaining({
        text: 'Item 1',
      }),
    ]);
  });

  it('should parse ordered lists', () => {
    const markdown = '1. Item 1\n2. Item 2';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(2);
    expect(elements[0]).toBeInstanceOf(ListItemElement);
    const listItem1 = elements[0] as ListItemElement;
    expect(listItem1.listType).toBe('ordered');
    expect(listItem1.text).toEqual([
      expect.objectContaining({
        text: 'Item 1',
      }),
    ]);
  });

  it('should parse to-do lists', () => {
    const markdown = '- [ ] Todo 1\n- [x] Todo 2';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(2);
    expect(elements[0]).toBeInstanceOf(TodoElement);
    const todo1 = elements[0] as TodoElement;
    expect(todo1.checked).toBe(false);
    expect(todo1.text).toEqual([
      expect.objectContaining({
        text: 'Todo 1',
      }),
    ]);
    const todo2 = elements[1] as TodoElement;
    expect(todo2.checked).toBe(true);
  });

  it('should parse dividers', () => {
    const markdown = '---\n';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInstanceOf(DividerElement);
  });

  it('should parse equations', () => {
    const markdown = '$$\nE=mc^2\n$$';
    const elements = parser.parse(markdown);
    expect(elements).toHaveLength(1);
    expect(elements[0]).toBeInstanceOf(EquationElement);
    const equationElement = elements[0] as EquationElement;
    expect(equationElement.equation).toBe('E=mc^2');
  });
});
