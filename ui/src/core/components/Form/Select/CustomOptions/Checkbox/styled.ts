import styled from 'styled-components';

type Props = {
  checked?: boolean;
};

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const Icon = styled.svg`
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })<Props>`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const Checkbox = styled.div<Props>`
  display: inline-block;
  width: ${props => (props.checked ? '12px' : '10px')};
  height: ${props => (props.checked ? '12px' : '10px')};
  background: ${({ theme, checked }) =>
    checked
      ? theme.select.checkbox.checked.background
      : theme.select.checkbox.unchecked.background};
  border: ${({ theme, checked }) =>
    checked
      ? 'none'
      : `1px solid ${theme.select.checkbox.unchecked.borderColor}`};
  border-radius: 2px;

  ${Icon} {
    visibility: ${props => (props.checked ? 'visible' : 'hidden')};
  }
`;

export default {
  CheckboxContainer,
  Icon,
  HiddenCheckbox,
  Checkbox
};
