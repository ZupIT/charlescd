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
import Page, { Props } from 'core/components/Page';
import Text from 'core/components/Text';

export default {
  title: 'Components/Page',
  component: Page,
};

const Template: Story<Props> = (props: Props) => {
  return (
    <Page {...props}>
      <Page.Menu>
        <Text tag="H4" color="light">
          Item 1
        </Text>
        <Text tag="H4" color="light">
          Item 2
        </Text>
      </Page.Menu>
      <Page.Content>
        <Page.Placeholder
          icon="empty-workspaces"
          title={`Hi!`}
          subtitle="Subtitle here."
        />
      </Page.Content>
    </Page>
  );
};

export const page = Template.bind({});
page.parameters = {
  docs: {
    source: {
      type: 'code',
    },
  },
};
page.args = {};
