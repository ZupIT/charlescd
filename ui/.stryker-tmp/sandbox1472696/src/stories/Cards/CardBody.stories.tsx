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
import CardBase from 'core/components/Card/Base';
import CardBody, { Props as CardBodyProps } from 'core/components/Card/Body';

export default {
  title: 'Components/Cards/Body',
  component: CardBody,
  parameters: {
    docs: {
      description: {
        component:
          'This component is used to wrap the main content of the card',
      },
    },
  },
};

const Template: Story<CardBodyProps> = (props: CardBodyProps) => {
  return (
    <CardBase color="gray">
      <CardBody {...props}>body</CardBody>
    </CardBase>
  );
};
export const body = Template.bind({});
body.args = {
  children: '...',
};
