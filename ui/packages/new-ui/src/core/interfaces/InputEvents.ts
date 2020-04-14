import { FocusEvent, ChangeEvent } from 'react';

export type ChangeInputEvent = ChangeEvent<HTMLInputElement>;

export interface InputEvents {
  onFocus?: ((event: FocusEvent<HTMLInputElement>) => void) & Function;
  onBlur?: ((event: FocusEvent<HTMLInputElement>) => void) & Function;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
