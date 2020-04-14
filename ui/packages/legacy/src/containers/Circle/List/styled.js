import styled from 'styled-components'
import { CardBox } from 'components/CardBox'

const Wrapper = styled(CardBox)`
  background-color: ${({ theme, isDefault }) => isDefault ? theme.COLORS.PRIMARY : theme.COLORS.PRIMARY_DARK};
  padding: 20px;
  position: relative;
  height: 100%;
`

const Release = styled(CardBox)`
  background-color: ${({ theme }) => theme.COLORS.COLOR_MOUNTAIN_MEADOW};
  display: flex;
  justify-content: space-between;
  padding: 20px 12px;
  border-radius: 2px;
`

const ReleaseItem = styled.div`
  size: 15px;
`

const Content = styled.div`
  display: block;
  margin-left: 20px;
`

const Legend = styled.div`
  font-size: 11px;
`

const Footer = styled.div`
svg {
  margin-right: 5px;
}

div + div {
  margin-top: 10px;

  &:before {
    content: '';
    display: inline-block;
    height: 1px;
    width: 100%;
    margin-bottom: 10px;
    border-top: solid 1px ${({ theme }) => theme.COLORS.COLOR_QUARTZ};
  }
}
`
const Action = styled.section`
  align-items: center;
  display: flex;
  justify-content: flex-start;

  :first-child {
    margin-bottom: 20px;
  }
`

const Metric = styled.span`
  align-items: center;
  display: flex;
  font-size: 11px;
  height: 30px;
  padding-left: 10px;
  width: 100px;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.COLORS.COLOR_GOSTH_WHITE};
  font-size: 16px;
  margin: 5px;

  svg {
    margin-right: 10px;
  }
`

const Title = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  word-break: break-all;
  align-items: center;
  color: ${({ theme }) => theme.COLORS.COLOR_WHITE};
  font-size: 16px;
  margin: 5px;

  svg {
    margin-right: 10px;
  }
`

const Chart = styled.div`
  margin-top: 10px;
  background: rgba(255, 255, 255, .06);
  border-radius: 4.25px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
`

export default {
  Wrapper,
  Chart,
  Content,
  Release: {
    Box: Release,
    Item: ReleaseItem,
  },
  ReleaseItem,
  Footer,
  Item,
  Title,
  Action,
  Metric,
  Legend,
}
