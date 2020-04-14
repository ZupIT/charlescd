import styled from 'styled-components';

const Button = styled.button`
  background: none;
  border: none;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;

  > * + * {
    margin-left: 5px;
  }
`;

export default {
  Button
};
