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
import Content, { Props } from 'core/components/Panel/Content';
import Styled from './Styled';

export default {
  title: 'Components/Panel/Content',
  component: Content,
  argTypes:{
    children: {
      control: false
    },
    size: {
      control: false
    },
  }
};

const Template: Story<Props> = (props: Props) => {
  return(
    <Content>
      <Styled.Text>panel content...</Styled.Text>
    </Content>
  );
};
export const content = Template.bind({});

content.args = {
  children: ''
};