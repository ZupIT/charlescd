import React, { Ref } from 'react';
import Styled from './styled';
import { Control } from 'react-hook-form';
import { Option } from 'core/components/Form/Select/interfaces';

type Props = {
  control: Control<unknown>;
  metrics: Option[];
  onRemoveFilter?: Function;
  register?: Ref<HTMLInputElement>;
};

const BasicQueryForm = ({
  control,
  metrics,
  onRemoveFilter,
  register
}: Props) => {
  return (
    <>
      <Styled.ProviderSelect
        control={control}
        name="metric"
        label="Select a metric"
        options={metrics}
      />
    </>
  );
};

export default BasicQueryForm;
