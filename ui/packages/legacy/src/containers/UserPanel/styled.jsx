import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  display: flex;
  flex-direction: row;
  height: 49px;
  justify-content: space-between;
  position: ${({ toolbarOpen }) => toolbarOpen ? 'fixed' : 'absolute'};
  top: 10px;
  right: 0;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_2};

  ${({ inverted, theme }) => inverted && css`
    color: ${theme.COLORS.COLOR_ECLIPSE};
  `}

  ${({ filled, theme }) => filled && css`
    background-image: linear-gradient(
      45deg,
      ${theme.DEFAULT.GRADIENT_START} 0%,
      ${theme.DEFAULT.GRADIENT_END} 100%
    );
  `}
`

const Column = styled.div`
  align-items: center;
  display: flex;
  margin: 20px 15px;
  transition: all .2s;
`

const VerticalDivider = styled.div`
  content: '';
  display: inline-block;
  height: 25px;
  width: 1px;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_2};
  margin-left: 10px;
  border-right: solid 1px ${({ theme }) => theme.COLORS.COLOR_WHITE};

  ${({ inverted, theme }) => inverted && css`
    border-right: solid 1px ${theme.COLORS.COLOR_ECLIPSE};
  `}
`

const Profile = styled.div`
  align-items: flex-end;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_2};

  ${({ inverted, theme }) => inverted && css`
    color: ${theme.COLORS.COLOR_ECLIPSE};
  `}

  h4, h5 {
    margin: 0;
  }

  h4 {
    font-weight: 400;
  }

  h5 {
    font-weight: lighter;
  }
`

const Thumbnail = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  margin-left: 15px;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_2};
`

const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
`

const AlertCount = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 15px;
  height: 15px;
  background: red;
  border-radius: 50%;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_1};
  bottom: 6px;
  left: 6px;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  font-size: 10px;
`

const AlertCountWrapper = styled.div`
  position: relative;
  align-items: center;
  font-size: 12px;
  display: flex;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_2};
  cursor: pointer;

  svg + span {
    margin-left: 5px;
  }
`

const ArrowWrapper = styled.div`
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_2};
  width: 20px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const ToggleToolbarWrapper = styled.div`
  cursor: pointer;
  display: flex;
`

export default {
  Column,
  Profile,
  Thumbnail,
  VerticalDivider,
  Wrapper,
  UserContainer,
  AlertCount,
  ToggleToolbarWrapper,
  AlertCountWrapper,
  ArrowWrapper,
}
