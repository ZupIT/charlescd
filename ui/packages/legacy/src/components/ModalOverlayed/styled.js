import styled, { css } from 'styled-components'
import { slideDown } from 'core/assets/style/keyframes'

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_5};
  background: ${({ theme }) => theme.COLORS.COLOR_BLACK_MARLIN_60};
  overflow-y: auto;
  overflow-x: hidden;
`

const CloseIcon = styled.div`
  position: absolute;
  min-width: 843px;
  display: flex;
  justify-content: flex-end;
  font-size: 20px; 
  top: -25px;
  right: 0;
  color: ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};
  text-align: center;

  svg {
    cursor: pointer;
    fill: ${({ theme }) => theme.COLORS.COLOR_GREY_COMET};
    stroke: white;
    stroke-width: 2px;
  }
`

const Modal = styled.div`
  position: relative;
  max-width: 500px;
  margin: 5rem auto;
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREY_BASTILLE};
  border-radius: 6px;
  box-sizing: border-box;
  opacity: 1;
  animation: ${slideDown} 0.3s ease 0s 1 normal none running;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_5};

  ${({ size }) => size === 'large' && css`
    max-width: 1140px;
  `}

  ${({ size }) => size === 'medium' && css`
    max-width: 843px;
  `}

  ${({ size }) => size === 'small' && css`
    max-width: 500px;
  `}
`

const Content = styled.div`
  position: relative;
  display: flex;
  padding: 50px 84px;
`

export const Styled = {
  CloseIcon,
  Modal,
  Content,
  Wrapper,
}
