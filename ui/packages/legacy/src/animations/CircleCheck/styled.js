import styled from 'styled-components'
import { dash, dashCheck } from 'core/assets/style/keyframes'

const Wrapper = styled.div`
  svg {
    width: 20px;
    display: block;
    margin: auto;

    .path {
      stroke-dasharray: 1000;
      stroke-dashoffset: 0;

      &.circle {
        animation: ${dash} .9s ease-in-out;
      }

      &.line {
        stroke-dashoffset: 1000;
        animation: ${dash} .9s .35s ease-in-out forwards;
      }

      &.check {
        stroke-dashoffset: -100;
        animation: ${dashCheck} .9s .35s ease-in-out forwards;
      }
    }
  }
`

export default {
  Wrapper,
}
