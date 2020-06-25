import React, { useEffect, memo, useCallback } from 'react';
import Styled from './styled';
import { Control } from 'react-hook-form';
import CustomOption from 'core/components/Form/Select/CustomOptions';
import useCircles, { CIRCLE_TYPES, CIRCLE_STATUS } from 'modules/Circles/hooks';
import { allOption } from 'core/components/Form/Select/MultiCheck/constants';
import { normalizeSelectOptions } from 'core/utils/select';

type Props = {
  control: Control<unknown>;
  setValue: Function;
};

const CircleFilter = ({ control, setValue }: Props) => {
  const [loading, filterCircles, , data] = useCircles(CIRCLE_TYPES.list);
  const circles = useCallback(() => {
    return normalizeSelectOptions(data?.content);
  }, [data]);

  useEffect(() => {
    if (data) {
      setValue('circles', [allOption, ...circles()]);
    }
  }, [data, circles, setValue]);

  useEffect(() => {
    filterCircles('', CIRCLE_STATUS.active);
  }, [filterCircles]);

  return (
    <Styled.MultiSelect
      control={control}
      name="circles"
      isLoading={loading}
      customOption={CustomOption.Check}
      options={circles()}
      label="Select Circles"
      defaultValue={[allOption]}
    />
  );
};

export default memo(CircleFilter);
