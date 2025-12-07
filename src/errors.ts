export class NotionConverterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotionConverterError';
  }
}

export class PageAccessibilityError extends NotionConverterError {
  constructor(pageId: string) {
    super(
      `Cannot access Notion page ${pageId}. Make sure the page exists and your integration has access.`
    );
    this.name = 'PageAccessibilityError';
  }
}

export class UnsupportedElementError extends NotionConverterError {
  constructor(elementType: string) {
    super(`Unsupported element type: ${elementType}`);
    this.name = 'UnsupportedElementError';
  }
}
