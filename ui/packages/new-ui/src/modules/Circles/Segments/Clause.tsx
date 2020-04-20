import React from 'react';
import map from 'lodash/map';
import {
  ArrayField,
  Control,
  FieldElement,
  ValidationOptions
} from 'react-hook-form';
import Rule from './Rule';
import Styled from './styled';

interface Props {
  control: Control;
  register: <Element extends FieldElement = FieldElement>(
    ref: Element,
    validationOptions?: ValidationOptions
  ) => void;
  prefixName: string;
  viewMode: boolean;
  clauses: Partial<ArrayField<Record<string, object>, 'id'>>;
}

const Clause = ({
  prefixName,
  register,
  control,
  clauses,
  viewMode
}: Props) => (
  <Styled.Clause>
    {map(clauses?.clauses, (rule, index) => (
      <Rule
        rule={rule}
        key={index}
        control={control}
        register={register}
        viewMode={viewMode}
        prefixName={`${prefixName}.clauses`}
      />
    ))}
  </Styled.Clause>
);

export default Clause;
