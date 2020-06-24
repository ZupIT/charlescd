import React, { useEffect } from 'react';
import Styled from './styled';
import { Control } from 'react-hook-form';
import CustomOption from 'core/components/Form/Select/CustomOptions';
import useCircles, { CIRCLE_TYPES, CIRCLE_STATUS } from 'modules/Circles/hooks';
import { allOption } from 'core/components/Form/Select/MultiCheck/constants';

export const colourOptions = [
  { value: 'ocean1', label: 'Ocean', color: '#00B8D9' },
  { value: 'blue', label: 'Blue', color: '#0052CC' },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630' },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' }
];

type Props = {
  control: Control<unknown>;
};

const CircleFilter = ({ control }: Props) => {
  const [loading, filterCircles] = useCircles(CIRCLE_TYPES.list);

  useEffect(() => {
    filterCircles('', CIRCLE_STATUS.active);
  }, [filterCircles]);

  return (
    <Styled.MultiSelect
      control={control}
      name="circles"
      isLoading={loading}
      customOption={CustomOption.Check}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      options={colourOptions}
      label="Select Circles"
      isMulti
      defaultValue={[allOption, ...colourOptions]}
    />
  );
};

export default CircleFilter;
