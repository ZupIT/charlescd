import styled from 'styled-components'
import DefaultColumn from 'components/Board/Column'

const Wrapper = styled(DefaultColumn.Wrapper)`
  height: 100%;
  min-height: 100%;
`

const Content = styled.div`
  height: 100%;
  overflow-y: auto;
  max-height: calc(100vh - 50px);
`

const ActionContent = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
`

const Header = styled(DefaultColumn.Header)`
  color: ${({ theme }) => theme.COLORS.SURFACE};
  border-bottom: 2px solid ${({ color }) => color};
  display: flex;
  justify-content: space-between;
`

const Inner = styled(DefaultColumn.Inner)`
  height: 100%;
`

export default {
  Wrapper,
  ActionContent,
  Header,
  Inner,
  Content,
}
