# @flicknote/notion-uploader

Convert markdown to Notion pages.

## Installation

```bash
npm install @flicknote/notion-uploader
```

## Usage

```typescript
import { markdownToNotion } from '@flicknote/notion-uploader';

await markdownToNotion({
  markdown: '# Hello\n\nSome **bold** text',
  notionPageId: 'your-page-id',
  notionApiKey: 'secret_xxx',
  mode: 'replace', // or 'append'
});
```

## Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `markdown` | `string` | Yes | - | The markdown content to convert |
| `notionPageId` | `string` | Yes | - | The Notion page ID to update |
| `notionApiKey` | `string` | Yes | - | Your Notion API key (integration token) |
| `mode` | `'replace' \| 'append'` | No | `'replace'` | Update mode |

## Supported Markdown Features

- Headings (H1-H6)
- Paragraphs
- **Bold**, *italic*, ~~strikethrough~~, `code`
- Lists (ordered and unordered, with nesting)
- Blockquotes
- Code blocks (with language highlighting)
- Tables
- Images (external URLs only)
- Links
- Horizontal rules
- LaTeX equations (inline and block)
- GitHub-style callouts (`> [!NOTE]`, `> [!TIP]`, etc.)

## Limitations

- Only external image URLs are supported (no local file uploads)
- Front-matter is not parsed
- Raw HTML blocks are ignored
