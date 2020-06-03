import { UseFieldArrayProps, Control, ArrayField } from './types';
export declare const useFieldArray: <FormArrayValues extends Record<string, any> = Record<string, any>, KeyName extends string = "id", ControlProp extends Control<Record<string, any>> = Control<Record<string, any>>>({ control, name, keyName, }: UseFieldArrayProps<KeyName, ControlProp>) => {
    swap: (indexA: number, indexB: number) => void;
    move: (from: number, to: number) => void;
    prepend: (value: Partial<FormArrayValues> | Partial<FormArrayValues>[]) => void;
    append: (value: Partial<FormArrayValues> | Partial<FormArrayValues>[]) => void;
    remove: (index?: number | number[] | undefined) => void;
    insert: (index: number, value: Partial<FormArrayValues> | Partial<FormArrayValues>[]) => void;
    fields: Partial<ArrayField<FormArrayValues, KeyName>>[];
};
