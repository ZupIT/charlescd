import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  height: 40px;

  :after {
    position: absolute;
    content: '';
    width: 0; 
    height: 0; 
    top: 18px;
    right: 10px;
    border: none;
  }
`

export const Select = styled.select`
  -webkit-appearance: none;
  border: none;
  background-color: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
  color: ${({ theme }) => theme.COLORS.SURFACE};
  width: 100%;
  height: 40px;
  padding: 0  20px 0 10px;
  border-radius: 0;
  box-sizing: border-box;
`

export const StyledSelect = {
  Wrapper,
  Select,
}
