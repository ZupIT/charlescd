import styled from 'styled-components'

const Wrapper = styled.div`
  display: block;
  width: 100%;

  textarea {
    box-sizing: border-box;
    font-family: Roboto, sans-serif;
    font-size: 14px;
    font-weight: 400;
    width: 100%;
    padding: 12px;
    resize: none;
    border: none;
    color: ${({ theme }) => theme.COLORS.SURFACE};
    background: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};

    :focus {
      background: ${({ theme }) => theme.COLORS.COLOR_GREY_PAYNE};
      padding-left: 15px;
    }
  }
`

export default {
  Wrapper,
}
