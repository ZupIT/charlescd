import { Story } from '@storybook/react';
import Chart, { Props } from 'core/components/Chart';
import areaChartOption from 'modules/Circles/Comparation/Item/MetricsGroups/MetricsGroupCard/areaChart.options';

export default {
  title: 'Components/Chart',
  component: Chart,
};

const Template: Story<Props> = (props: Props) => <Chart {...props} />;
export const chart = Template.bind({});
chart.args = {
  series: [{
    name: 'test 1',
    data: [
      {
        x: 1623074400000,
        y: 50
      },
      {
        x: 1623074700000,
        y: 50
      },
      {
        x: 1623075000000,
        y: 30
      },
      {
        x: 1623075300000,
        y: 50
      },
      {
        x: 1623075600000,
        y: 50
      },
      {
        x: 1623075900000,
        y: 40
      },
      {
        x: 1623076200000,
        y: 50
      },
      {
        x: 1623076500000,
        y: 50
      },
      {
        x: 1623076800000,
        y: 50
      },
      {
        x: 1623077100000,
        y: 50
      },
      {
        x: 1623077400000,
        y: 50
      },
      {
        x: 1623077700000,
        y: 50
      }
    ]
  }],
  type: 'area',
  width: 500,
  height: 200,
  options: {...areaChartOption, chart: {background: '#2c2c2e'}}
};