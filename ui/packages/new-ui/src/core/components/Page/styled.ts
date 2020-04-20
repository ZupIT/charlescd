import styled from 'styled-components';

const Page = styled.div`
  display: grid;
  grid-template-areas: 'menu content';
  grid-template-columns: 300px;
  grid-template-rows: 100vh;
`;

const Menu = styled.div`
  grid-area: menu;
  padding-top: 70px;
  background-color: ${({ theme }) => theme.menuPage.background};
`;

const Content = styled.div`
  grid-area: content;
  overflow-y: auto;
  margin-bottom: 35px;
`;

export default {
  Page,
  Menu,
  Content
};
