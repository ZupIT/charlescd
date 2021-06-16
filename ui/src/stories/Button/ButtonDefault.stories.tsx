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
import ButtonDefault, { Props } from 'core/components/Button/ButtonDefault';

export default {
  title: 'Components/Button/Default',
  component: ButtonDefault,
  parameters: {
    docs: {
      description: {
        component: 'To create a new customized button, you should extend ButtonDefault component',
      },
    },
  },
};

const Template: Story<Props> = (props: Props) => <ButtonDefault {...props} />;
export const buttonDefault = Template.bind({});
buttonDefault.args = {
  children: 'text',
};

buttonDefault.storyName = 'Default';