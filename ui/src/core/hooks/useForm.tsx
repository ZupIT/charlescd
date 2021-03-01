import { isNotBlank, trimValue } from 'core/utils/validations';
import {
  useForm as useHookForm,
  RegisterOptions,
  UseFormOptions,
  UseFormMethods,
  FieldValues,
  FieldName
} from 'react-hook-form';

function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext extends object = object
>(params?: UseFormOptions<TFieldValues, TContext>) {
  const formMethods: UseFormMethods<TFieldValues> = useHookForm<
    TFieldValues,
    TContext
  >(params);

  function customRegisterFieldRef(registerOptions?: RegisterOptions) {
    const customRules: RegisterOptions = {
      ...registerOptions,
      validate: {
        ...registerOptions?.validate,
        notBlank: isNotBlank
      },
      setValueAs: trimValue
    };

    return formMethods.register(customRules);
  }

  function customRegisterManual(
    fieldName?: FieldName<TFieldValues>,
    options?: RegisterOptions
  ) {
    return formMethods.register(fieldName, options);
  }

  return {
    ...formMethods,
    register: customRegisterFieldRef,
    registerManual: customRegisterManual
  };
}

export default useForm;
