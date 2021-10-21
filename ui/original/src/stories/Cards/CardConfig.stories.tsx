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
import CardConfig, { Props } from 'core/components/Card/Config';

export default {
  title: 'Components/Cards/Config',
  component: CardConfig,
  argTypes: {
    icon: {
      description:
        'You should use an svg name (cores/assests/svg) e.g. **workspace**',
    },
  },
};

const Template: Story<Props> = (props: Props) => <CardConfig {...props} />;
export const config = Template.bind({});
config.args = {
  children: '...',
  icon: 'workspace',
};
