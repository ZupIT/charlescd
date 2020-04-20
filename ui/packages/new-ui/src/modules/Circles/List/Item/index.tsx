import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'core/components/Card';
import { CIRCLE } from 'modules/Circles/enums';
import { addParamCircle } from 'modules/Circles/helpers';
import { CirclePaginationItem } from 'modules/Circles/interfaces/CirclesPagination';
import { METRICS_TYPE, CHART_TYPE } from 'containers/Metrics/enums';
import Styled from './styled';

const CirclesListItem = ({ id, name, deployment }: CirclePaginationItem) => {
  const history = useHistory();

  const renderMetricsDefault = () => (
    <>
      <Styled.Metrics
        id={id}
        metricType={METRICS_TYPE.REQUESTS_ERRORS_BY_CIRCLE}
        chartType={CHART_TYPE.NORMAL}
      />
      <Styled.Metrics
        id={id}
        metricType={METRICS_TYPE.REQUESTS_LATENCY_BY_CIRCLE}
        chartType={CHART_TYPE.NORMAL}
      />
    </>
  );

  return (
    <div onClick={() => addParamCircle(history, id)}>
      <Card.Circle key={id} circle={name} deployedAt={deployment?.deployedAt}>
        <Styled.Wrapper>
          <Card.Release
            status={deployment?.status}
            description={deployment?.build?.tag}
          />
        </Styled.Wrapper>
        <Styled.Metrics
          id={id}
          metricType={METRICS_TYPE.REQUESTS_BY_CIRCLE}
          chartType={CHART_TYPE.NORMAL}
        />
        {id === CIRCLE.ID_CIRCLE_DEFAULT && renderMetricsDefault()}
      </Card.Circle>
    </div>
  );
};

export default memo(CirclesListItem);
