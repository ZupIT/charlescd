import styled from 'styled-components';
import { COLOR_BASTILLE, COLOR_WHITE } from 'core/assets/colors';

const Wrapper = styled.div`
  background-color: ${COLOR_BASTILLE};
  border-radius: 4px;
  padding-bottom: 10px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
`;

interface ControlItem {
  isActive?: boolean;
}

const ControlItem = styled.div<ControlItem>`
  width: 30px;
  padding: 5px;
  margin: 0 10px;
  cursor: pointer;
  border-radius: 14px;
  border: 1px solid
    ${({ isActive }) => (isActive ? COLOR_WHITE : 'transparent')};

  span {
    color: ${COLOR_WHITE};
  }
`;

export default {
  Wrapper,
  Controls,
  ControlItem
};
