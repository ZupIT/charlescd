import styled, { css } from 'styled-components'
import { Button as ComponentButton } from 'components/Button'
import ComponentAvatar from 'components/Avatar'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: ${({ theme }) => theme.COLORS.PRIMARY};
  box-shadow: 5px 7px 15px 0px ${({ theme }) => theme.COLORS.COLOR_BLACK_SMOKE};
`

const Button = styled(ComponentButton)`
  align-items: center;
  background-color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  border: solid 1px ${({ theme }) => theme.COLORS.COLOR_BLACK};
  border-radius: 2px;
  box-sizing: border-box;
  color: ${({ theme }) => theme.COLORS.COLOR_BLACK};
  cursor: pointer;
  display: flex;
  height: 40px;
  justify-content: center;
  width: 134px;

  &:hover {
    box-shadow: inset 0px 0px 0px 64px ${({ theme }) => theme.COLORS.COLOR_BLACK_ALPHA};
  }

  ${({ primary }) => primary && css`
    background-color: ${({ theme }) => theme.COLORS.COLOR_ROYAL_BLUE};
    border: none;
    color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  `}
`

const Action = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 50px;
  width: 300px;
`

const Item = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`

const Preview = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 150px;

  img {
    border-radius: 50%;
    height: 100px;
    margin: 0;
    width: 100px;
  }
`

const Avatar = styled.div`
  height: 50px;
  margin-right: 20px;
  width: 45px;

  &:hover {
    transform: scale(1.2);
    cursor: pointer;
  }
`

const Members = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
  width: 455px;
`

const Member = styled(ComponentAvatar)`
  border: 3px solid transparent;
  border-radius: 50%;
  box-sizing: border-box;
  height: 40px;
  opacity: 0.3;
  width: 40px;

  ${({ big }) => big && css`
    opacity: 1;
  `}

  ${({ checked }) => checked && css`
    opacity: 1;
  `}
`

const Check = styled.div`
  border-bottom: 7px solid ${({ theme }) => theme.COLORS.COLOR_MEDIUM_AQUAMARINE};
  border-right: 7px solid ${({ theme }) => theme.COLORS.COLOR_MEDIUM_AQUAMARINE};
  display: inline-block;
  height: 12px;
  margin: 15px 0px 0px -15px;
  position: absolute;
  transform: rotate(45deg);
  width: 6px;
`

export default {
  Action,
  Button,
  Item,
  Avatar,
  Members,
  Member,
  Preview,
  Wrapper,
  Check,
}
