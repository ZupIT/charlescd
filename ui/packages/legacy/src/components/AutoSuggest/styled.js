import styled from 'styled-components'

const Wrapper = styled.div`
  .react-autosuggest__container {
    position: relative;
  }
  
  .react-autosuggest__input {
    border-radius: 2px;
    border: none;
    background: ${({ theme }) => theme.COLORS.COLOR_PAYNES_GREY};
    color: ${({ theme }) => theme.COLORS.SURFACE};
    box-sizing: border-box;
    padding: 12px;
    font-size: 14px;
    width: 100%;
  }

  .react-autosuggest__input--focused {
    outline: none;
  }

  .react-autosuggest__input--open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .react-autosuggest__suggestions-container {
    display: none;
  }

  .react-autosuggest__suggestions-container--open {
    display: block;
    position: absolute;
    top: 42px;
    width: 100%;
    max-height: 250px;
    overflow-y: auto;
    border-radius: 2px;
    border: none;
    background: ${({ theme }) => theme.COLORS.COLOR_PAYNES_GREY};
    color: ${({ theme }) => theme.COLORS.SURFACE};
    z-index: 2;
  }

  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .react-autosuggest__suggestion {
    cursor: pointer;
    padding: 10px 20px;
  }

  .react-autosuggest__suggestion--highlighted {
    background-color: ${({ theme }) => theme.COLORS.COLOR_ZAMBEZI};
  }
`

export default {
  Wrapper,
}
