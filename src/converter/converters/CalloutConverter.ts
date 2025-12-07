import { CalloutElement, Element, ElementType } from '../../elements/index.js';
import { CalloutBlock, ElementConverter } from '../types.js';
import { TextConverter } from './TextConverter.js';

export class CalloutConverter implements ElementConverter {
  convert(element: Element): CalloutBlock {
    if (element.type !== ElementType.Callout) {
      throw new Error(`CalloutConverter received wrong element type: ${element.type}`);
    }
    const calloutElement = element as CalloutElement;
    const icon = calloutElement.getIcon();
    const calloutParams: CalloutBlock['callout'] = {
      rich_text: TextConverter.convertRichText(calloutElement.text),
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
}


