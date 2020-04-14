import styled, { css } from 'styled-components'

import LinkRoute from 'core/routing/Link'

const defaults = {
  menu: {
    expanded: {
      width: '300px',
    },
    height: '100vh',
    width: '58px',
  },
}

export const StyledWorkspace = styled.div`
  position: relative;
`

export const StyledContent = styled.main`
  height: ${defaults.menu.height};
  left: ${defaults.menu.width};
  position: absolute;
  width: calc(100vw - ${defaults.menu.width});
  overflow-y: auto;
`

const LinkIcon = styled.div`
  align-items: center;
  display: flex;
  margin: 0 27px;
`

const Link = styled(LinkRoute)`
  align-items: center;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  margin: 5px 8px 0 0;
  overflow: hidden;
  padding: 20px 0;
  text-decoration: none;
  height: 0px;

  &.active {
    background: ${({ theme }) => theme.COLORS.COLOR_BLACK_OPACITY};
    border-radius: 0 40px 40px 0;
  }

  &:before {
    border: solid ${({ theme }) => theme.COLORS.COLOR_WHITE};
    border-width: 0 1px 1px 0;
    content: '';
    display: inline-block;
    margin: 0 10px 0 6px;
    padding: 2px;
    transform: rotate(-45deg);
    vertical-align: 7%;
  }

  &:last-of-type {
    margin-bottom: 100px;
  }

  &:hover {
    background: ${({ theme }) => theme.COLORS.COLOR_BLACK_OPACITY};
    border-radius: 0 20px 20px 0;
    transition: background 0s .1s;
  }
`

const Menu = styled.aside`
  position: relative;
  display: flex;
  flex-direction: row;
  background-image: linear-gradient(
    225deg,
    ${({ theme }) => theme.DEFAULT.GRADIENT_START} 0%,
    ${({ theme }) => theme.DEFAULT.GRADIENT_END} 100%
  );
  height: ${defaults.menu.height};
  overflow: none;
  position: relative;
  width: ${defaults.menu.width};
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_3};

  ${({ vertical }) => vertical && css`
    flex-direction: column;

    ${Link} {
      &:before {
        display: none;
      }

      ${LinkIcon} {
        margin: 0 20px;
      }
    }
  `}

  ${({ hasItems }) => hasItems && css`
    transition: all .2s .3s;
    width: ${defaults.menu.expanded.width};

    ${Link} {
      transition: width 0s .4s;
    }
  `}
`

const Primary = styled.div`
  overflow: none;

  a:first-of-type {
    margin-bottom: 23px;
  }

  a {
    margin-bottom: 20px;
  }
`

const Action = styled.div`
  align-items: center;
  margin: 10px 0 23px 5px;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  width: 260px;

  svg {
    margin-left: 5px;
  }

  &:hover {
    background: ${({ theme }) => theme.COLORS.COLOR_BLACK_OPACITY};
  }
`

const Input = styled.input`
  background: none;
  border: none;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  font-size: 14px;
  height: 40px;
  padding-left: 10px;
  padding-right: 10px;
  width: 230px;

  &::placeholder {
    color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
    opacity: 50%;
  }
`

const Logo = styled(LinkRoute)`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
`

const Legend = styled.span`
  align-items: center;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  display: flex;
  font-size: 11px;
  font-variant: small-caps;
  justify-content: center;
`

const Content = styled.div`
  overflow: none;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 300px;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY_DARK}
`

const Items = styled.div`
  overflow: auto;
  display: inline-flex;
  flex-direction: column;
  flex-grow: 1;
`

const Footer = styled.div`
  align-items: center;
  display: flex;
  height: 80px;
  padding-left: 15px;
`

export const StyledMenu = {
  Action,
  Content,
  Footer,
  Items,
  Input,
  Menu,
  Legend,
  Link,
  LinkIcon,
  Logo,
  Primary,
}
