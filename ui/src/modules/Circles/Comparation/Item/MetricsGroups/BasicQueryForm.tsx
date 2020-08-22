import React from 'react';
import Styled from './styled';
import { useFormContext } from 'react-hook-form';
import StyledRule from 'modules/Circles/Segments/styled';
import { operatorsOptions } from './constants';
import Icon from 'core/components/Icon';
import { getOperator } from './helpers';
import { MetricFilter } from './types';

type Props = {
  filters: MetricFilter[];
  onAddFilter: () => void;
  onRemoveFilter: (index: string) => void;
};

const BasicQueryForm = ({ filters, onAddFilter, onRemoveFilter }: Props) => {
  const { register, control } = useFormContext();

  return (
    <>
      {filters.map((item, index) => (
        <Styled.RuleWrapper key={item.id}>
          <StyledRule.Rule data-testid="segments-rules">
            <StyledRule.RuleTrash>
              <StyledRule.Button.Icon
                name="trash"
                size="15px"
                color="light"
                onClick={() => onRemoveFilter(item.id)}
              />
            </StyledRule.RuleTrash>
            <StyledRule.Input
              label="Filter"
              ref={register({ required: true })}
              name={`filters.${index}.field`}
              defaultValue={item.field}
            />
            <StyledRule.Select
              options={operatorsOptions}
              control={control}
              rules={{ required: true }}
              label="Conditional"
              name={`filters.${index}.operator`}
              defaultValue={getOperator(item.operator)}
            />
            <StyledRule.Input
              label="Value"
              ref={register}
              name={`filters.${index}.value`}
              defaultValue={item.value}
            />
          </StyledRule.Rule>
        </Styled.RuleWrapper>
      ))}
      <StyledRule.Button.Clause
        id="add-clause"
        size="EXTRA_SMALL"
        onClick={onAddFilter}
      >
        <Icon name="add" size="16px" color="light" /> Rule
      </StyledRule.Button.Clause>
    </>
  );
};

export default BasicQueryForm;
