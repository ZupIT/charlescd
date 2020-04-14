import styled from 'styled-components';
import IconComponent from 'core/components/Icon';
import Text from 'core/components/Text';

const Wrapper = styled.div`
  display: inline-block;
`;

const Content = styled.div``;

const Actions = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.menu.background};
  border-radius: 4px;
  color: ${({ theme }) => theme.menu.color};
  z-index: ${({ theme }) => theme.zIndex.OVER_1};
`;

const Action = styled.div`
  padding: 5px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const WrapperIcon = styled.div`
  position: relative;
  width: 15px;
  padding: 12px 12px 12px 0;
`;

const Icon = styled(IconComponent)`
  position: absolute;
  top: 0;
`;

const H5 = styled(Text.h5)`
  padding-right: 16px;
`;

export default {
  Action,
  Actions,
  Content,
  H5,
  Icon,
  Wrapper,
  WrapperIcon
};
