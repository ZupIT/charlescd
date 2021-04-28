/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
          name="slider"
          max={100}
          placeholder="Value"
          disabled={isDisabled}
          ref={register({
            required: 'Percentage is required.',
            validate: value => validatePercentage(Number(value), limitValue)
          })}
        />
      </Styled.SliderInputContainer>
      <Text.h5 color="error">{errors?.slider?.message}</Text.h5>
    </Styled.SliderContainer>
  );
};

export default SliderPercentage;
