export enum ElementType {
  Page = 'page',
  Text = 'text',
  Quote = 'quote',
  Code = 'code',
  Callout = 'callout',
  Divider = 'divider',
  Image = 'image',
  Link = 'link',
  Table = 'table',
  ListItem = 'list-item',
  Html = 'html',
  Toggle = 'toggle',
  Equation = 'equation',
}

export type TextElementStyles = {
  italic: boolean;
  bold: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
};

export enum ElementCodeLanguage {
  JavaScript = 'javascript',
  TypeScript = 'typescript',
  Python = 'python',
  Java = 'java',
  CSharp = 'csharp',
  CPlusPlus = 'c++',
  Go = 'go',
  Ruby = 'ruby',
  Swift = 'swift',
  Kotlin = 'kotlin',
  Rust = 'rust',
  Shell = 'shell',
  Scala = 'scala',
  SQL = 'sql',
  HTML = 'html',
  CSS = 'css',
  JSON = 'json',
  YAML = 'yaml',
  Markdown = 'markdown',
  Mermaid = 'mermaid',
  PlainText = 'plaintext',
}

export const isElementCodeLanguage = (
  value: string
): value is ElementCodeLanguage => {
  return Object.values(ElementCodeLanguage).includes(
    value as ElementCodeLanguage
  );
};

export enum SpecialCalloutType {
  Note = 'note',
  Tip = 'tip',
  Important = 'important',
  Warning = 'warning',
  Caution = 'caution',
}
