import React from 'react';
import Styled from './styled';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Option } from 'core/components/Form/Select/interfaces';
import StyledRule from 'modules/Circles/Segments/styled';
import { thresholdOptions, FILTER } from './constants';
import Icon from 'core/components/Icon';

type Props = {
  metrics: Option[];
};

const BasicQueryForm = ({ metrics }: Props) => {
  const { register, control } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'filters'
  });

  return (
    <>
      <Styled.ProviderSelect
        control={control}
        name="metric"
        label="Select a metric"
        options={metrics}
      />
      {fields.map((item, index) => (
        <StyledRule.Rule data-testid="segments-rules" key={item.id}>
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
            options={thresholdOptions}
            control={control}
            rules={{ required: true }}
            label="Conditional"
            name={`filters.${index}.condition`}
          />
          <StyledRule.Input
            label="Value"
            ref={register}
            name={`filters.${index}.value`}
          />
        </StyledRule.Rule>
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
