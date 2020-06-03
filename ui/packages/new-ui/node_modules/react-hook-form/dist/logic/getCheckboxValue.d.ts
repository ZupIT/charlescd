import { RadioOrCheckboxOption } from '../types';
declare type CheckboxFieldResult = {
    isValid: boolean;
    value: string | string[] | boolean;
};
declare const _default: (options?: RadioOrCheckboxOption[] | undefined) => CheckboxFieldResult;
export default _default;
