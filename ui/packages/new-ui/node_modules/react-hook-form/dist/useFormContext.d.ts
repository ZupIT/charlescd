import { FieldValues } from './types';
import { FormContextValues, FormProps } from './contextTypes';
export declare function useFormContext<T extends FieldValues>(): FormContextValues<T>;
export declare function FormContext<T extends FieldValues>({ children, formState, errors, ...restMethods }: FormProps<T>): JSX.Element;
