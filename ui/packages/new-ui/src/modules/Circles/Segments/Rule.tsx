import React from 'react';
import {
  ArrayField,
  Control,
  FieldElement,
  ValidationOptions
} from 'react-hook-form';
import Styled from './styled';
import { getCondition } from './helpers';
import options from './conditional.options';

interface Props {
  register: <Element extends FieldElement = FieldElement>(
    ref: Element,
    validationOptions?: ValidationOptions
  ) => void;
  control: Control;
  prefixName: string;
  viewMode: boolean;
  rule: Partial<
    ArrayField<
      Record<string, { condition: string; key: string; value: string }>,
      'id'
    >
  >;
}

const Rule = ({ register, control, prefixName, rule, viewMode }: Props) => {
  return (
    <Styled.Rule>
      <Styled.Input
        type="hidden"
        ref={register}
        name={`${prefixName}.type`}
        defaultValue="RULE"
      />
      <Styled.Input
        label="Key"
        ref={register}
        disabled={viewMode}
        name={`${prefixName}.content.key`}
        defaultValue={rule?.content?.key}
      />
      <Styled.Select
        options={options}
        control={control}
        label="Conditional"
        isDisabled={viewMode}
        defaultValue={getCondition(rule?.content?.condition)}
        name={`${prefixName}.content.condition`}
      />
      <Styled.Input
        label="Value"
        ref={register}
        disabled={viewMode}
        name={`${prefixName}.content.value`}
        defaultValue={rule?.content?.value}
      />
    </Styled.Rule>
  );
};

export default Rule;
