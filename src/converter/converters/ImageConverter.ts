import { Element, ElementType, ImageElement } from '../../elements/index.js';
import { BlockObjectRequest, ElementConverter } from '../types.js';

const SUPPORTED_IMAGE_URL_EXTENSIONS = [
  '.bmp',
  '.gif',
  '.heic',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.tif',
  '.tiff',
];

export class ImageConverter implements ElementConverter {
  convert(element: Element): BlockObjectRequest {
    if (element.type !== ElementType.Image) {
      throw new Error(`ImageConverter received wrong element type: ${element.type}`);
    }
    const imageElement = element as ImageElement;
    // Only support external URLs
    if (!imageElement.url || !imageElement.url.startsWith('http')) {
      console.warn(`Non-URL image not supported: ${imageElement.url}`);
      return {
        type: 'paragraph',
        object: 'block',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `[Image: ${
                  imageElement.caption || imageElement.url || 'unknown'
                }]`,
              },
            },
          ],
          color: 'default',
        },
      };
    }

    // Check for supported extensions
    if (
      !SUPPORTED_IMAGE_URL_EXTENSIONS.some((ext) =>
        imageElement.url?.toLowerCase().endsWith(ext)
      )
    ) {
      console.warn(`Unsupported image URL extension: ${imageElement.url}`);
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
          url: imageElement.url,
        },
      },
    };
  }
}

