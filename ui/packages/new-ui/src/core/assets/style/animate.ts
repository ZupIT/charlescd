import { keyframes } from 'styled-components';

export const slideInLeft = keyframes`
  from {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 0.9;
  }
`;

export const slideDown = keyframes`
  0% {
    transform: translate(0, -500px);
  }

  100% {
    transform: translate(0, 0);
  }
`;
