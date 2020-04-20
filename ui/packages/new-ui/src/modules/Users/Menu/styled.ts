import styled from 'styled-components';
import LabeledIcon from 'core/components/LabeledIcon';
import SearchInputComponent from 'core/components/Form/SearchInput';
import IconComponent from 'core/components/Icon';

const SearchInput = styled(SearchInputComponent)`
  margin: 15px 0;
  padding: 0 16px;
`;

const List = styled.ul`
  padding: 0 16px;
  margin: 0;
  list-style-type: none;
`;

const ListItem = styled(LabeledIcon)`
  padding: 15px 0;
  cursor: pointer;
  display: flex;
`;

const Content = styled.div`
  height: calc(100vh - 200px);
  overflow-y: auto;
`;

const Actions = styled.div`
  > * + * {
    margin-left: 20px;
  }
  padding: 0 16px;
`;

const Icon = styled(IconComponent)`
  cursor: pointer;
`;

const Link = styled.a`
  text-decoration: none;
`;

export default {
  SearchInput,
  List,
  ListItem,
  Content,
  Actions,
  Icon,
  Link
};
