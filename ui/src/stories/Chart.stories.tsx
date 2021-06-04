import { Story } from '@storybook/react';
import Chart, { Props } from 'core/components/Chart';

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
        x: 1000,
        y: 10
      }
    ]
    }, {
    name: 'test 2',
    data: [
      {
        x: 500,
        y: 5
      }
    ]
  }],
  type: 'bar',
};