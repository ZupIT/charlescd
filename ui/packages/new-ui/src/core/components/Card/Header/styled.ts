import styled from 'styled-components';

const CardHeader = styled.div`
  padding: 0px 8px 0px 17px;
  height: 15px;
  display: flex;
  flex-direction: row;

  > * + * {
    margin-left: 10px;
  }
`;

const Icon = styled.div`
  display: flex;
`;

const Action = styled.div`
  margin-left: auto;
`;

export default {
  CardHeader,
  Icon,
  Action
};
