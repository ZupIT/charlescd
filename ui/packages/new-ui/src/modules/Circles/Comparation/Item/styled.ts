import styled from 'styled-components';
import { ReactComponent as SortSVG } from 'core/assets/svg/sort-left.svg';
import { slideInLeft, fadeIn } from 'core/assets/style/animate';

const Wrapper = styled.div`
  animation: 0.2s ${slideInLeft} linear;
`;

const Actions = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;

  > :last-child {
    margin-left: 36px;
  }
`;

const Release = styled.div`
  position: relative;
  height: 61px;
  z-index: ${({ theme }) => theme.zIndex.OVER_2};

  > {
    position: absolute;
  }
`;

const Layer = styled.div`
  margin-top: 40px;

  :last-child {
    padding-bottom: 85px;
  }
`;

const Content = styled.div`
  animation: 0.5s ${fadeIn} linear;
  margin-top: 15px;
  margin-left: 45px;
`;

const A = styled.a`
  text-decoration: none;
`;

const MetricsControl = styled.div`
  display: flex;
  align-content: center;
  font-size: 12px;
`;

const MetricsLabel = styled.div`
  margin-right: 10px;
`;

const SortLeft = styled(SortSVG)`
  cursor: pointer;
  margin-right: 10px;
  transform: rotate(90deg);
`;

const SortRight = styled(SortSVG)`
  cursor: pointer;
  transform: rotate(-90deg);
`;

const MetricsTitle = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default {
  A,
  Actions,
  Content,
  Layer,
  Release,
  Wrapper,
  MetricsControl,
  MetricsLabel,
  SortLeft,
  SortRight,
  MetricsTitle
};
