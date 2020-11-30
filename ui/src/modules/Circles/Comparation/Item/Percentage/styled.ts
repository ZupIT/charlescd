import styled from 'styled-components';

const CirclesListContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  margin-bottom: 10px;
  flex-direction: column;
`;

const CirclesListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow: auto;
`;

const CirclesListButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-bottom: 10px;

  > span {
    margin-left: 10px;
  }
`;

const AvailableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  max-height: 500px;

  > div:first-child:last-child {
    border-radius: 4px 4px 4px 4px;
  }

  > div:first-child {
    border-radius: 4px 4px 0 0;
  }

  > div:last-child {
    border-radius: 0 0 4px 4px;
  }
`;

const AvailableItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: inherit;
  padding: 18px;
  height: 32px;
  background-color: ${({ theme }) => theme.modal.default.background};
`;

export default {
  AvailableContainer,
  AvailableItem,
  CirclesListContainer,
  CirclesListButton,
  CirclesListWrapper
};
