import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import Clause from './Clause';
import Rule from './Rule';
import Styled from './styled';

export type Rule = {
  type: string;
  content: {
    key: string;
    value: number[] | string[];
    condition: string;
  };
};

type Clause = {
  type: string;
  clauses:
    | Rule[]
    | {
        type: string;
        clauses: Rule[];
        logicalOperator: string;
      }[];
};

export type Rules = {
  type: string;
  clauses: (
    | {
        type: string;
        clauses: Rule[];
        logicalOperator: string;
      }
    | Rule
  )[];
  logicalOperator: string;
};

export interface Props {
  viewMode?: boolean;
  rules?: Rules;
}

const Segments = ({ rules, viewMode = true }: Props) => {
  const { register, control } = useForm({
    defaultValues: { clauses: rules?.clauses }
  });
  const { fields } = useFieldArray({ control, name: 'clauses' });

  return (
    <Styled.Form>
      {fields.map((item, index) => {
        if (item.type === 'CLAUSE') {
          return (
            <Clause
              key={item.id}
              clauses={item}
              control={control}
              register={register}
              viewMode={viewMode}
              prefixName={`clauses[${index}]`}
            />
          );
        }

        return (
          <Rule
            rule={item}
            key={item.id}
            control={control}
            register={register}
            viewMode={viewMode}
            prefixName={`clauses[${index}]`}
          />
        );
      })}
    </Styled.Form>
  );
};

export default Segments;
