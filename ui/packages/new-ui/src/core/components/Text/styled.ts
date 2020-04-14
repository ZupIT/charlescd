import styled from 'styled-components';
import { HEADINGS } from './enums';

interface Props {
  fontSize?: string;
  weight?: string;
  align?: string;
  type?: HEADINGS;
}

const Text = styled.span<Props>`
  display: block;
  font-size: ${({ fontSize }) => fontSize};
  font-weight: ${({ weight }) => weight};
  color: ${({ theme, color }) => theme.text[color]};
  text-align: ${({ align }) => align};
  line-height: ${({ fontSize }) => fontSize};
`;

export default {
  Text
};
