import { FieldError, ValidateResult } from '../types';
declare const _default: (error: FieldError | undefined, { type, types, message, }: {
    type: string;
    types?: Record<string, ValidateResult> | undefined;
    message: ValidateResult;
}) => boolean;
export default _default;
