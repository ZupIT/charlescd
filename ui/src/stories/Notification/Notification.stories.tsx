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
import Notification, { Props } from 'core/components/Notification';
import Styled from './styled';

export default {
  title: 'Components/Notification',
  component: Notification,
};

const Template: Story<Props> = (props: Props) => (
  <Styled.Outside>
    <Notification {...props} />
  </Styled.Outside>
);
export const notification = Template.bind({});
notification.args = {
  notification: {
    isVisible: true,
    text: 'success message',
    status: 'success',
  },
};
