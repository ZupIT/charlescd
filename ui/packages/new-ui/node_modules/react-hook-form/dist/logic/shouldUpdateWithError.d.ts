import { FieldValues, FieldName, FieldErrors } from '../types';
export default function shouldUpdateWithError<FormValues extends FieldValues>({ errors, name, error, validFields, fieldsWithValidation, }: {
    errors: FieldErrors<FormValues>;
    error: FieldErrors<FormValues>;
    name: FieldName<FormValues>;
    validFields: Set<FieldName<FormValues>>;
    fieldsWithValidation: Set<FieldName<FormValues>>;
}): boolean;
