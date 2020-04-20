import styled, { css } from 'styled-components'
import { heartBeat } from 'core/assets/style/keyframes'
import { RELEASE_TYPES } from 'containers/Moove/constants'


const Badge = styled.div`
  align-items: center;
  animation: 1s ease-in-out 0s 1 ${heartBeat};
  background: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border-radius: 14.4px;
  color: ${({ theme }) => theme.COLORS.COLOR_BLACK};
  display: flex;
  font-size: 11px;
  height: 15px;
  justify-content: center;
  text-transform: capitalize;
  width: auto;
  padding: 0 10px;

  ${({ status, theme }) => status === RELEASE_TYPES.DEPRECATED && css`
    color: ${theme.COLORS.COLOR_SILVER};
  `}
  
  ${({ status, theme }) => status === RELEASE_TYPES.BUILT && css`
    color: ${theme.COLORS.COLOR_PURPLE_HEART};
  `}
  
  ${({ status, theme }) => status === RELEASE_TYPES.BUILDING && css`
    color: ${theme.COLORS.COLOR_PURPLE_HEART};
  `}

  ${({ status, theme }) => status === RELEASE_TYPES.BUILD_FAILED && css`
    color: ${theme.COLORS.COLOR_VENETIAN_RED};
  `}

  ${({ status, theme }) => status === RELEASE_TYPES.DEPLOYED && css`
    color: ${theme.COLORS.COLOR_MOUNTAIN_MEADOW};
  `}

  ${({ status, theme }) => status === RELEASE_TYPES.VALIDATED && css`
    color: ${theme.COLORS.COLOR_MOUNTAIN_MEADOW};
  `}
`

export default {
  Badge,
}
