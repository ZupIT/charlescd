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
import SearchInput, { Props } from 'core/components/Form/SearchInput';
import styled from './styled';

export default {
  title: 'Components/Form/Search Input',
  component: SearchInput,
};

const Template: Story<Props> = (props: Props) => {
  return (
    <styled.Form>
      <SearchInput {...props} />
    </styled.Form>
  );
};

export const searchInput = Template.bind({});
searchInput.args = {
  onSearch: () => {},
};
