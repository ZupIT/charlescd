import styled from 'styled-components'

const Default = styled.div`
  background: ${({ theme }) => theme.COLORS.COLOR_BLACK};
  padding: 80px 30px 50px 30px;
  box-sizing: content-box;
  height: 100%;
  min-height: 100vh;
`

const Dashboard = styled.div`
  padding: 45px;
`

const ContentPage = {
  Default,
  Dashboard,
}

export default ContentPage
