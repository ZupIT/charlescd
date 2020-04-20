import styled from 'styled-components';

const Badge = styled.div`
  border: 1px solid ${({ theme }) => theme.badge.border};
  color: ${({ theme }) => theme.badge.color};
  border-radius: 20px;
  padding: 0px 10px;
  box-sizing: border-box;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: lowercase;

  *:first-letter {
    text-transform: uppercase;
  }
`;

export default {
  Badge
};
