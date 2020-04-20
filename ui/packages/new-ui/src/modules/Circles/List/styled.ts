import styled from 'styled-components';
import SearchInputComponent from 'core/components/Form/SearchInput';
import IconComponent from 'core/components/Icon';

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

const Wrapper = styled.div`
  margin: 48px 30px 18px 30px;
`;

const Default = styled.div`
  display: flex;
  margin: 15px 15px 0px 0px;
  align-self: flex-start;
`;

const Items = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  > * {
    margin: 15px;
  }
`;

const Header = styled.div`
  margin-bottom: 18px;
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

export default {
  Actions,
  Content,
  Default,
  Header,
  Icon,
  Items,
  SearchInput,
  Wrapper
};
