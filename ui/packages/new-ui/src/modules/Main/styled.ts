import styled from 'styled-components';

const Main = styled.main<{ isSidebarExpanded: boolean }>`
  display: grid;
  grid-template-areas:
    'nav content'
    'footer footer';
  grid-template-rows: calc(100vh - 35px);
  grid-template-columns: ${({ isSidebarExpanded }) =>
    isSidebarExpanded ? '135px' : '60px'};
`;

const Content = styled.section`
  grid-area: content;
  background-color: ${({ theme }) => theme.main.background};
`;

export default {
  Main,
  Content
};
