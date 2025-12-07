import { CodeElement, Element, ElementCodeLanguage, ElementType } from '../../elements/index.js';
import { BlockObjectRequest, ElementConverter, LanguageRequest } from '../types.js';
import { TextConverter } from './TextConverter.js';

export class CodeConverter implements ElementConverter {
  convert(element: Element): BlockObjectRequest {
    if (element.type !== ElementType.Code) {
      throw new Error(`CodeConverter received wrong element type: ${element.type}`);
    }
    const codeElement = element as CodeElement;
    return {
      type: 'code',
      object: 'block',
      code: {
        rich_text: TextConverter.convertRichText(codeElement.text),
        language: this.getNotionLanguageFromElementLanguage(
          codeElement.language
        ),
      },
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
}

