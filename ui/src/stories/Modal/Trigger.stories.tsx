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
import Trigger, { Props } from 'core/components/Modal/Trigger';
import Text from 'core/components/Text';

export default {
  title: 'Components/Modal/Trigger',
  component: Trigger,
};

const Template: Story<Props> = (props: Props) => {
  return (
    <Trigger {...props}>
      <Text tag="H4" color="light">
        This is a text example, this is a text example.
      </Text>
    </Trigger>
  )
};
export const trigger = Template.bind({});
trigger.args = {
  title: 'Would you like to delete this item?',
  dismissLabel: 'cancel',
  continueLabel: 'ok',
  children: 'This is a text example, this is a text example.'
};
