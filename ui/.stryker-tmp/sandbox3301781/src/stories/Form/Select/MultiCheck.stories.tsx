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
import Select, { Props } from 'core/components/Form/Select/MultiCheck/Select';
import CustomOption from 'core/components/Form/Select/CustomOptions';
import styled from '../styled';

export default {
  title: 'Components/Form/Select/Select Multi',
  component: Select
};

const Template: Story<Props> = (props: Props) => {
  return (
    <styled.Form>
      <Select {...props} />
    </styled.Form>
  );
};

export const selectMulti = Template.bind({});
selectMulti.args = {
  customOption: CustomOption.Check,
  options: [
    { value: 'apple', label: 'apple' },
    { value: 'orange', label: 'orange' },
    { value: 'banana', label: 'banana' }
  ]
};
