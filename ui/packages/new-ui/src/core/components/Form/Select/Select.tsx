import React from 'react';
import { OptionTypeBase, ValueType } from 'react-select';
import { ReactComponent as DownSVG } from 'core/assets/svg/down.svg';
import customStyles from './customStyle';
import FloatingLabel from './FloatingLabel';
import Styled from './styled';

export type optionType = {
  value: string;
  label: string;
};

interface Props {
  placeholder?: string;
  options?: optionType[];
  defaultValue?: optionType;
  onChange?: (value: ValueType<OptionTypeBase>) => void;
  isDisabled?: boolean;
  className?: string;
}

const Select = ({
  placeholder,
  options,
  defaultValue,
  onChange,
  className,
  isDisabled = false
}: Props) => (
  <div data-testid="react-select">
    <Styled.Select
      className={className}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={onChange}
      isDisabled={isDisabled}
      components={{
        ValueContainer: FloatingLabel,
        IndicatorSeparator: null,
        DropdownIndicator: () => <DownSVG />
      }}
      styles={customStyles}
      options={options}
    />
  </div>
);

export default Select;
