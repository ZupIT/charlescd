import React from 'react';
import Styled from './styled';
import { useFormContext, useFieldArray } from 'react-hook-form';
import StyledRule from 'modules/Circles/Segments/styled';
import { operatorsOptions, FILTER } from './constants';
import Icon from 'core/components/Icon';
import { getOperator } from './helpers';
import { MetricFilter } from './types';

type Props = {
  filters: MetricFilter[];
};

const BasicQueryForm = ({ filters }: Props) => {
  const { register, control } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'filters'
  });

  return (
    <>
      {fields.map((item, index) => (
        <Styled.RuleWrapper key={item.id}>
          <StyledRule.Rule data-testid="segments-rules">
            <StyledRule.RuleTrash>
              <StyledRule.Button.Icon
                name="trash"
                size="15px"
                color="light"
                onClick={() => remove(index)}
              />
            </StyledRule.RuleTrash>
            <StyledRule.Input
              label="Filter"
              ref={register({ required: true })}
              name={`filters.${index}.field`}
            />
            <StyledRule.Select
              options={operatorsOptions}
              control={control}
              rules={{ required: true }}
              label="Conditional"
              name={`filters.${index}.operator`}
              defaultValue={getOperator(filters?.[index]?.operator)}
            />
            <StyledRule.Input
              label="Value"
              ref={register}
              name={`filters.${index}.value`}
            />
          </StyledRule.Rule>
        </Styled.RuleWrapper>
      ))}
      <StyledRule.Button.Clause
        id="add-clause"
        size="EXTRA_SMALL"
        onClick={() => append(FILTER)}
      >
        <Icon name="add" size="16px" color="light" /> Rule
      </StyledRule.Button.Clause>
    </>
  );
};

export default BasicQueryForm;
