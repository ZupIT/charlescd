import styled from 'styled-components';
import SearchInputComponent from 'core/components/Form/SearchInput';
import Page from 'core/components/Page';
import IconComponent from 'core/components/Icon';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 15px;
  > * {
    margin: 15px;
  }
`;

const Scrollable = styled(Page.Content)`
  overflow: auto;
`;

const ScrollableX = styled(Page.Content)`
  overflow-y: hidden;
  overflow-x: auto;
`;

const Header = styled.div`
  margin: 48px 30px 18px 30px;
`;

const SearchInput = styled(SearchInputComponent)`
  margin: 15px 0;
`;

const Actions = styled.div`
  > * + * {
    margin-left: 20px;
  }
`;

const Icon = styled(IconComponent)`
  cursor: pointer;
`;

const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;
`;

const ListItem = styled.li`
  padding: 15px 0;
  cursor: pointer;
`;

const Link = styled.a`
  text-decoration: none;
`;

export default {
  Actions,
  Scrollable,
  ScrollableX,
  Header,
  Icon,
  SearchInput,
  List,
  ListItem,
  Link,
  Wrapper
};
