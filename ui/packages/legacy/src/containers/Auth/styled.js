import styled from 'styled-components'

const Wrapper = styled.div`
  background: ${({ theme }) => theme.COLORS.PRIMARY};
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Box = styled.div`
  background: ${({ theme }) => theme.COLORS.PRIMARY_DARK};
  height: 450px;
  width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
`

export default {
  Wrapper,
  Box,
}
