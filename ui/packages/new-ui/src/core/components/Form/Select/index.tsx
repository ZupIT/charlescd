import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Select, { optionType } from './Select';

interface Props {
  name: string;
  control: Control<Record<string, unknown>>;
  options: optionType[];
  rules?: Partial<{ required: boolean | string }>;
  defaultValue?: optionType;
  className?: string;
  label?: string;
  isDisabled?: boolean;
}

const FormSelect = ({
  name,
  control,
  options,
  rules,
  defaultValue,
  className,
  label,
  isDisabled = false
}: Props) => (
  <div data-testid={`select-${name}`}>
    <Controller
      as={
        <Select
          placeholder={label}
          className={className}
          isDisabled={isDisabled}
          defaultValue={defaultValue}
        />
      }
      onChange={([selected]) => selected?.value}
      rules={rules}
      defaultValue={defaultValue?.value}
      control={control}
      options={options}
      name={name}
    />
  </div>
);

export default FormSelect;
