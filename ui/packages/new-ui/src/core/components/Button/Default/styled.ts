import styled from 'styled-components';

const Button = styled.button`
  border: none;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.button.default.background};
  color: ${({ theme }) => theme.button.default.color};
  height: 30px;
  font-size: 10px;
  padding: 0 22px;
`;

export default {
  Button
};
