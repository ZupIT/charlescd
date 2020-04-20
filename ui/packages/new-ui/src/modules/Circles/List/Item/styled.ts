import styled from 'styled-components';
import { COLOR_BLACK_MARLIN } from 'core/assets/colors';
import CircleMetrics from 'containers/Metrics';

const Wrapper = styled.div`
  position: relative;
  height: 61px;
  z-index: ${({ theme }) => theme.zIndex.OVER_2};

  > {
    position: absolute;
  }
`;

const Metrics = styled(CircleMetrics)`
  background-color: ${COLOR_BLACK_MARLIN};
`;

export default {
  Wrapper,
  Metrics
};
