import React, { ReactElement } from 'react';
import { components, OptionTypeBase, ValueContainerProps } from 'react-select';

const { Placeholder } = components;

const FloatingLabel = ({
  children,
  ...props
}: ValueContainerProps<OptionTypeBase>) => (
  <components.ValueContainer {...props}>
    <Placeholder {...props} innerProps={null}>
      {props.selectProps.placeholder}
    </Placeholder>
    {React.Children.map(children as ReactElement[], child => {
      return child && child.type !== Placeholder ? child : null;
    })}
  </components.ValueContainer>
);

export default FloatingLabel;
