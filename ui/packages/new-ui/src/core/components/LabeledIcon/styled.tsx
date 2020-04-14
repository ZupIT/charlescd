import styled from 'styled-components';
import Icon from 'core/components/Icon';

interface LabelProps {
  marginContent?: string;
}

const Wrapper = styled.div`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
`;

const Label = styled.div<LabelProps>`
  margin-left: ${({ marginContent }) => marginContent};
`;

const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.labeledIcon.color};
`;

export default {
  Wrapper,
  Icon: StyledIcon,
  Label
};
