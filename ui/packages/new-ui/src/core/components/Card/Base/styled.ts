import styled from 'styled-components';

const Card = styled.div`
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  width: 269px;

  > * + * {
    margin-top: 10px;
  }
`;

export default {
  Card
};
