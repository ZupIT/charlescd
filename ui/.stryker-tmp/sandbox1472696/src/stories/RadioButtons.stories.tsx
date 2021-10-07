// @ts-nocheck
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
import RadioButtons, { Props } from 'core/components/RadioButtons';

export default {
  title: 'Components/RadioButtons',
  component: RadioButtons,
};

const Template: Story<Props> = (props: Props) => <RadioButtons {...props} />;
export const radioButtons = Template.bind({});

const radios = [
  { icon: 'edit', name: 'Create Release', value: 'create' },
  { icon: 'search', name: 'Search for existing releases', value: 'search' }
];

radioButtons.args = {
  name: 'type',
  items: radios,
  onChange: () => {},
};

radioButtons.storyName = 'RadioButtons';