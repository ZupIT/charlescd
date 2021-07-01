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
import TextArea, { Props } from 'core/components/Form/TextArea';
import styled from './styled';

export default {
  title: 'Components/Form/Text Area',
  component: TextArea,
};

const Template: Story<Props> = (props: Props) => {
  return (
    <styled.Form>
      <TextArea {...props} />
    </styled.Form>
  );
};
export const textArea = Template.bind({});
textArea.args = {
  label: 'Text area'
};
