import { BlockObjectRequestWithoutChildren as _BlockObjectRequestWithoutChildren } from '@notionhq/client/build/src/api-endpoints.js';

export type BlockObjectRequestWithoutChildren =
  _BlockObjectRequestWithoutChildren;

type EmptyObject = Record<string, never>;

type TextAnnotation = {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';
};

type TextItemRequest = {
  type?: 'text';
  text: {
    content: string;
    link?: { url: string } | null;
  };
  annotations?: TextAnnotation;
};

type EquationItemRequest = {
  type?: 'equation';
  equation: {
    expression: string;
  };
  annotations?: TextAnnotation;
};

export type RichTextItemRequest = TextItemRequest | EquationItemRequest;

export type ApiColor = 'default' | 'gray' | 'brown' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'red';

export type LanguageRequest =
  | 'abap' | 'arduino' | 'bash' | 'basic' | 'c' | 'c#' | 'c++' | 'clojure' | 'coffeescript'
  | 'css' | 'dart' | 'diff' | 'docker' | 'elixir' | 'elm' | 'erlang' | 'flow' | 'fortran'
  | 'f#' | 'gherkin' | 'glsl' | 'go' | 'graphql' | 'groovy' | 'haskell' | 'html' | 'java'
  | 'javascript' | 'json' | 'julia' | 'kotlin' | 'latex' | 'less' | 'lisp' | 'livescript'
  | 'lua' | 'makefile' | 'markdown' | 'markup' | 'matlab' | 'mermaid' | 'nix' | 'objective-c'
  | 'ocaml' | 'pascal' | 'perl' | 'php' | 'plain text' | 'powershell' | 'prolog' | 'protobuf'
  | 'python' | 'r' | 'reason' | 'ruby' | 'rust' | 'sass' | 'scala' | 'scheme' | 'scss'
  | 'shell' | 'sql' | 'swift' | 'typescript' | 'vb.net' | 'verilog' | 'vhdl' | 'visual basic'
  | 'webassembly' | 'xml' | 'yaml' | 'java/c/c++/c#' | 'toml';

// Block types
export interface HeadingBlock {
  rich_text: Array<RichTextItemRequest>;
  color?: ApiColor;
  is_toggleable?: boolean;
  children?: Array<BlockObjectRequestWithoutChildren>;
}

export interface Heading1Block {
  heading_1: HeadingBlock;
  type?: 'heading_1';
  object?: 'block';
}

export interface Heading2Block {
  heading_2: HeadingBlock;
  type?: 'heading_2';
  object?: 'block';
}

export interface Heading3Block {
  heading_3: HeadingBlock;
  type?: 'heading_3';
  object?: 'block';
}

export interface ParagraphBlock {
  paragraph: {
    rich_text: Array<RichTextItemRequest>;
    color?: ApiColor;
    children?: Array<BlockObjectRequestWithoutChildren>;
  };
  type?: 'paragraph';
  object?: 'block';
}

export interface ListItemBlock {
  rich_text: Array<RichTextItemRequest>;
  color?: ApiColor;
  children?: Array<BlockObjectRequestWithoutChildren>;
}

export interface BulletedListItemBlock {
  bulleted_list_item: ListItemBlock;
  type?: 'bulleted_list_item';
  object?: 'block';
}

export interface NumberedListItemBlock {
  numbered_list_item: ListItemBlock;
  type?: 'numbered_list_item';
  object?: 'block';
}

export interface QuoteBlock {
  quote: ListItemBlock;
  type?: 'quote';
  object?: 'block';
}

export interface ToggleBlock {
  toggle: ListItemBlock;
  type?: 'toggle';
  object?: 'block';
}

export interface CalloutBlock {
  callout: ListItemBlock & {
    icon?: { type: 'emoji'; emoji: string };
  };
  type?: 'callout';
  object?: 'block';
}

export interface CodeBlock {
  code: {
    rich_text: Array<RichTextItemRequest>;
    language: LanguageRequest;
    caption?: Array<RichTextItemRequest>;
  };
  type?: 'code';
  object?: 'block';
}

export interface EquationBlock {
  equation: {
    expression: string;
  };
  type?: 'equation';
  object?: 'block';
}

export interface DividerBlock {
  divider: EmptyObject;
  type?: 'divider';
  object?: 'block';
}

export interface TableRowBlock {
  table_row: {
    cells: Array<Array<RichTextItemRequest>>;
  };
  type?: 'table_row';
  object?: 'block';
}

export interface TableBlock {
  table: {
    table_width: number;
    children: Array<TableRowBlock>;
    has_column_header?: boolean;
    has_row_header?: boolean;
  };
  type?: 'table';
  object?: 'block';
}

export interface ImageBlock {
  image: {
    type: 'external';
    external: {
      url: string;
    };
    caption?: Array<RichTextItemRequest>;
  };
  type?: 'image';
  object?: 'block';
}

export type BlockObjectRequest =
  | Heading1Block
  | Heading2Block
  | Heading3Block
  | ParagraphBlock
  | BulletedListItemBlock
  | NumberedListItemBlock
  | QuoteBlock
  | ToggleBlock
  | CalloutBlock
  | CodeBlock
  | EquationBlock
  | DividerBlock
  | TableBlock
  | ImageBlock;
