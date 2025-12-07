import { Element } from './Element.js';
import { ElementType, SpecialCalloutType } from './types.js';

const specialCalloutRegex =
  /^\s*\[\!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](.*)/ims;

export class CalloutElement extends Element {
  public text: string;
  private readonly icon?: string;
  private readonly calloutType?: SpecialCalloutType;

  public static isSpecialCalloutText(text: string): boolean {
    return specialCalloutRegex.test(text.trim());
  }

  constructor({ icon, text }: { icon?: string; text: string }) {
    super(ElementType.Callout);
    this.icon = icon;
    this.text = text;

    const { text: parsedText, calloutType } =
      this.getSpecialCalloutTypeAndText(text);

    if (calloutType) {
      this.calloutType = calloutType;
      this.text = parsedText;
    }
  }

  private getSpecialCalloutTypeAndText(text: string): {
    calloutType: SpecialCalloutType | null;
    text: string;
  } {
    const textToSpecialCalloutType: Record<string, SpecialCalloutType> = {
      note: SpecialCalloutType.Note,
      tip: SpecialCalloutType.Tip,
      important: SpecialCalloutType.Important,
      warning: SpecialCalloutType.Warning,
      caution: SpecialCalloutType.Caution,
    };

    const match = specialCalloutRegex.exec(text.trim());

    if (match) {
      const typeString = match[1].toLowerCase() as SpecialCalloutType;
      const text = match[2].trim();

      const calloutType = textToSpecialCalloutType[typeString];

      if (calloutType) {
        return { calloutType, text };
      }
    }

    return {
      calloutType: null,
      text,
    };
  }

  public getIcon(): string | undefined {
    const iconMap: Record<SpecialCalloutType, string> = {
      [SpecialCalloutType.Note]: 'ℹ️',
      [SpecialCalloutType.Tip]: '💡',
      [SpecialCalloutType.Important]: '⚠️',
      [SpecialCalloutType.Warning]: '⚠️',
      [SpecialCalloutType.Caution]: '⚠️',
    };

    if (this.calloutType && iconMap[this.calloutType]) {
      return iconMap[this.calloutType];
    }

    return this.icon;
  }
}
