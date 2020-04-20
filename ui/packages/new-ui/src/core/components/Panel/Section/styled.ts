import styled from 'styled-components';

const Section = styled.div`
  background: transparent;
  padding: 15px 0px;

  + * {
    border-top: 1px solid ${({ theme }) => theme.panel.separator};
  }
`;

export default {
  Section
};
