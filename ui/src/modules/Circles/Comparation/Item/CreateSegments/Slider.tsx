import React, { useEffect, useState } from 'react';
import Styled from './styled';
import Text from 'core/components/Text';
import { useFormContext } from 'react-hook-form';
import { validatePercentage } from './helpers';

interface Props {
  limitValue: number;
  isDisabled?: boolean;
}

const SliderPercentage = ({ limitValue, isDisabled }: Props) => {
  const { register, setValue, watch, errors } = useFormContext();
  const [sliderValue, setSliderValue] = useState<number>(0);
  const sliderFormValue = watch('slider');

  useEffect(() => {
    if (sliderFormValue) {
      setSliderValue(sliderFormValue);
    }
  }, [sliderFormValue]);

  const handleChange = (value: string) => {
    const convertedValueToNumber = Number(value);
    setValue('slider', convertedValueToNumber, { shouldValidate: true });
    setSliderValue(convertedValueToNumber);
  };

  return (
    <Styled.SliderContainer>
      <Styled.SliderInputContainer>
        <Text.h4 color="light">0%</Text.h4>
        <Styled.Slider
          type="range"
          data-testid="slider-input"
          value={sliderValue}
          onChange={e => handleChange(e.target.value)}
          disabled={isDisabled}
          max={limitValue}
        />
        <Text.h4 data-testid="slider-limit-value" color="light">
          {limitValue}%
        </Text.h4>
        <Styled.SliderNumberInput
          placeholder="Value"
          disabled={isDisabled}
          ref={register({
            required: 'Percentage is required.',
            validate: value => validatePercentage(Number(value), limitValue)
          })}
          name="slider"
        />
      </Styled.SliderInputContainer>
      <Text.h5 color="error">{errors?.slider?.message}</Text.h5>
    </Styled.SliderContainer>
  );
};

export default SliderPercentage;
