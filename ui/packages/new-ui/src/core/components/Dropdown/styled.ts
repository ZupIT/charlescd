import styled from 'styled-components';
import { slideDown } from 'core/assets/style/animate';

const Wrapper = styled.div`
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.dropdown.background};
  border-radius: 4px;
  width: 136px;
  right: 8px;
  top: 27px;
  box-shadow: 0px 2px 10px 0px ${({ theme }) => theme.dropdown.shadow};
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  animation: 0.2s ${slideDown} linear;
  z-index: ${({ theme }) => theme.zIndex.OVER_1};
`;

const Item = styled.button`
  color: ${({ theme }) => theme.dropdown.color};
  cursor: pointer;
  border: none;
  background: transparent;
  height: 34px;
  display: flex;
  flex-direction: row;
  align-items: center;

  > * + * {
    margin-left: 5px;
  }
`;

export default {
  Wrapper,
  Dropdown,
  Item
};
