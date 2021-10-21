import styled from 'styled-components';

type Status = {
  status: string;
};

const StatusMessageWrapper = styled.div<Status>`
  margin-bottom: 20px;
  display: flex;

  span {
    margin-left: 10px;
    color: ${({ theme, status }) => theme.metrics.provider[status]};
  }

  svg {
    color: ${({ theme, status }) => theme.metrics.provider[status]};
  }
`;

export default {
  StatusMessageWrapper
};
