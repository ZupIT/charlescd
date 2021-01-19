import Icon from 'core/components/Icon';
import { components } from 'react-select';
import styled from 'styled-components';

const IconSelect = styled(Icon)`
  margin-right: 10px;
`;

const SingleValue = styled(components.SingleValue)`
  display: flex;
  align-items: center;
  > i {
    margin-right: 10px;
  }
`;

export default {
  IconSelect,
  SingleValue
};
