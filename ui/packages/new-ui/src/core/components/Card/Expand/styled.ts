import styled from 'styled-components';

const Expand = styled.div`
  max-height: 145px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  li:nth-child(odd) {
    background: ${({ theme }) => theme.card.expand.background};
  }
`;

const Item = styled.li`
  height: 63px;
  display: flex;
  flex-direction: column;
  padding: 0 15px 10px 15px;
`;

const Action = styled.button`
  border: none;
  background: ${({ theme }) => theme.card.expand.button};
  height: 4px;
  width: 40px;
  border-radius: 5px;
  margin: 9px auto -1px;
`;

const Icon = styled.div`
  margin-top: 5px;
`;

export default {
  Action,
  Expand,
  Item,
  Icon
};
