import styled from 'styled-components';

const Header = styled.div`
  height: 41px;
  background-color: ${({ theme }) => theme.tabPanel.header.background};
  padding-right: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Panel = styled.div`
  width: 660px;
  box-sizing: border-box;
  border-right: 1px solid ${({ theme }) => theme.tabPanel.border};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  padding-right: 32px;
  padding-left: 32px;
  overflow: auto;
  height: calc(100vh - 90px);
`;

const Actions = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: row;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > * + * {
    margin-left: 8px;
  }
`;

const Tab = styled.div`
  color: ${({ theme }) => theme.tabPanel.color};
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 233px;
  height: 41px;
  box-sizing: border-box;
  padding-left: 31px;
  background-color: ${({ theme }) => theme.tabPanel.background};

  > * + * {
    margin-left: auto;
    margin-right: 12px;
  }
`;

export default {
  Content,
  Header,
  Panel,
  Tab,
  Title,
  Actions
};
