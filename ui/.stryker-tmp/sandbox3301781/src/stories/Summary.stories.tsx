/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// @ts-nocheck


import { Story } from '@storybook/react';
import Summary, { Props } from 'core/components/Summary';

export default {
  title: 'Components/Summary',
  component: Summary,
};

const Template: Story<Props> = (props: Props) => (
  <Summary>
    <Summary.Item name="Executed" color="green" />
    <Summary.Item name="Executing" color="darkBlue" />
    <Summary.Item name="Not executed" color="lightBlue" />
    <Summary.Item name="Failed" color="red" />
  </Summary>
);
export const summary = Template.bind({});
summary.args = {};
summary.parameters = {
  docs: {
    source: {
      type: 'code',
    },
  },
};
