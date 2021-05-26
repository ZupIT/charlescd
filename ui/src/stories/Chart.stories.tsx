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
        y: 10,
        x: 1000
      }
    ]
    }, {
    name: 'test 2',
    data: [
      {
        y: 5,
        x: 500
      }
    ]
  }],
  type: 'bar',
  width: 500,
  height: 200
};
