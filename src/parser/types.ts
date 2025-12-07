import { Token } from 'marked';

export type EquationToken = {
  type: 'blockKatex' | 'inlineKatex';
  raw: string;
  text: string;
  displayMode: boolean;
};

export type ExtendedToken = Token | EquationToken;
