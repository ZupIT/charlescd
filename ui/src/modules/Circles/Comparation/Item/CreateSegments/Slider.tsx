import React from 'react';
import Styled from './styled';
import Text from 'core/components/Text';

interface Props {
  limitValue: number;
  value: number;
  setValue: Function;
}

const SliderPercentage = ({ limitValue, value, setValue }: Props) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  return (
    <Styled.SliderContainer>
      <Text.h4 color="light">0%</Text.h4>
      <Styled.Slider
        type="range"
        value={value}
        onChange={handleSliderChange}
        max={limitValue}
      ></Styled.Slider>
      <Text.h4 color="light">{limitValue}%</Text.h4>
      <Styled.SliderValue valueIsValid={value > 0} color="light">
        {value ? `${value}%` : 'Value'}
      </Styled.SliderValue>
    </Styled.SliderContainer>
  );
};

export default SliderPercentage;
