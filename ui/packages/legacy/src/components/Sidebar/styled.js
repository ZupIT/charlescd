import styled, { css } from 'styled-components'
import Link from 'core/routing/Link'
import ReactTooltip from 'react-tooltip'

const WIDTH = '60px'
const OPEN_WIDTH = '200px'
const HEIGHT = '100vh'

const ItemIcon = styled.div`
  width: ${WIDTH};
  display: flex;
  align-content: center;
  justify-content: center;
  cursor: pointer;
`

const ItemText = styled.div``

const Brand = styled(Link)`
  width: ${WIDTH};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
`

const Item = styled(Link)`
  display: flex;
  width: ${WIDTH};
  margin: 25px 0;
  padding: 10px 0;
  text-decoration: none;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};


  &:hover {
    background: rgba(0, 0, 0, 0.1) none repeat scroll 0% 0%;
  }
`

const Tooltip = styled(ReactTooltip)`
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE} !important;
  color: ${({ theme }) => theme.COLORS.PRIMARY} !important;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_3};

  &.place-right {
    &::after {
    border-right-color: ${({ theme }) => theme.COLORS.COLOR_WHITE} !important;
    border-right-style: solid !important;
    border-right-width: 6px !important;
    }
  }
`

const Wrapper = styled.div`
  height: 100vh;
  width: ${WIDTH};
  position: fixed;

  ${ItemText} {
    display: none;
  }

  ${({ isOpen }) => isOpen && css`
    color: red;
    width: ${OPEN_WIDTH};
    ${Item} {
      width: 95%;
      border-radius: 0px 20px 20px 0px;
    }
    ${ItemText} {
      display: initial;
    }
    ${Tooltip} {
      display: none;
    }
  `}
`

const Back = styled.div`
`

export default {
  Wrapper,
  Brand,
  Item,
  ItemIcon,
  ItemText,
  Tooltip,
  Back,
  WIDTH,
  OPEN_WIDTH,
  HEIGHT,
}
