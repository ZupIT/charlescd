import styled, { css } from 'styled-components'
import { lineAnimation } from 'core/assets/style/keyframes'
import { TOAST_TYPES } from 'containers/Toaster/state/actions'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 1em;
  right: 1em;
  box-sizing: border-box;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_5};

  div + div {
    margin-bottom: 5px;
  }
`

const Line = styled.div`
  border-bottom: solid 3px ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border-top-width: 0px;
  animation-name: ${lineAnimation};
  animation-duration: 8s;
  animation-timing-function: linear;
`

const Text = styled.div`
  margin-left: 10px;
`

const Toast = styled.div`
  position: relative;
  min-height: 64px;
  max-height: 800px;
  width: 200px;
  margin-bottom: 1rem;
  padding: 8px;
  border-radius: 6px;
  box-shadow: 0 1px 10px 0 rgba(0,0,0,.1), 0 2px 15px 0 rgba(0,0,0,.05);
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  background: ${({ theme }) => theme.COLORS.COLOR_WHITE};

  ${({ toast, theme }) => toast === TOAST_TYPES.SUCCESS && css`
    background: ${theme.COLORS.COLOR_ISLAMIC_GREEN};
  `}

  ${({ toast, theme }) => toast === TOAST_TYPES.FAILED && css`
    background: ${theme.COLORS.COLOR_CINNABAR};
  `}

  ${({ toast, theme }) => toast === TOAST_TYPES.WARNING && css`
    background: ${theme.COLORS.COLOR_MOON_YELLOW};
  `}

  ${({ toast, theme }) => toast === TOAST_TYPES.INFO && css`
    background: ${theme.COLORS.COLOR_SUMMER_SKY};
  `}
`

export const Body = styled.div`
  align-items: center;
  display: flex;
  margin: 20px 0;
`

export default {
  Body,
  Line,
  Text,
  Toast,
  Wrapper,
}
