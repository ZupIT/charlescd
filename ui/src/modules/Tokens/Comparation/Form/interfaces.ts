import { Token } from 'modules/Tokens/interfaces';

export type SetValue = (name: keyof Token, value: unknown, config?: Partial<{
  shouldValidate: boolean;
  shouldDirty: boolean;
}>) => void;
