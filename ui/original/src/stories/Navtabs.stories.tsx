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

import { Story } from '@storybook/react';
import NavTabs, { Props } from 'core/components/NavTabs';

export default {
  title: 'Components/NavTabs',
  component: NavTabs,
  argTypes: {
    children: {
      type: { required: true },
      description: 'must be a list of `<NavTabs.Tab/>`',
    },
  },
};

const Template: Story<Props> = (props: Props) => (
  <NavTabs {...props}>
    <NavTabs.Tab title="Tab 1">tab content 1</NavTabs.Tab>
    <NavTabs.Tab title="Tab 2">tab content 2</NavTabs.Tab>
  </NavTabs>
);
export const navtabs = Template.bind({});
navtabs.parameters = {
  docs: {
    source: {
      type: 'code',
    },
  },
};

navtabs.storyName = 'NavTabs';
