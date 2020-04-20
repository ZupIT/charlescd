import React from 'react';
import defaultsDeep from 'lodash/defaultsDeep';
import defaultConfig from './config';
import Styled from './styled';

export interface Props {
  series: object[];
  options?: object;
  className?: string;
}

const AreaChart = ({ className, options, series }: Props) => (
  <Styled.Chart
    className={className}
    options={defaultsDeep(options, defaultConfig.options)}
    series={series}
    type="area"
    width="100%"
  />
);

export default AreaChart;
