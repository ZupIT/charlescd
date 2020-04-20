import styled from 'styled-components';

const Footer = styled.footer`
  grid-area: footer;
  height: 35px;
  background-color: ${({ theme }) => theme.footer.background};
  z-index: ${({ theme }) => theme.zIndex.OVER_2};
`;

export default {
  Footer
};
