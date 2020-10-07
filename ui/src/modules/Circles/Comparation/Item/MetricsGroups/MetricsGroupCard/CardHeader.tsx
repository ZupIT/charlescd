import React from 'react';
import Text from 'core/components/Text';
import Dropdown from 'core/components/Dropdown';
import Styled from './styled';
import { MetricsGroup } from '../types';

type Props = {
  metricGroup: MetricsGroup;
  handleDeleteMetricsGroup: Function;
};

const CardHeader = ({ metricGroup, handleDeleteMetricsGroup }: Props) => (
  <Styled.MetricsGroupsCardHeader>
    <Text.h2 color="light" title={metricGroup.name}>
      {metricGroup.name}
    </Text.h2>
    <Dropdown icon="vertical-dots" size="16px">
      <Dropdown.Item
        icon="delete"
        name="Delete"
        onClick={() => handleDeleteMetricsGroup(metricGroup.id)}
      />
    </Dropdown>
  </Styled.MetricsGroupsCardHeader>
);

export default CardHeader;
