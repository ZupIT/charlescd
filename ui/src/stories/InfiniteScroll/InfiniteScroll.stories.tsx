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
import InfiniteScroll, { Props } from 'core/components/InfiniteScroll';
import { useState } from 'react';
import Styled from './Styled';

export default {
  title: 'Components/InfiniteScroll',
  component: InfiniteScroll,
  parameters: { controls: { sort: 'requiredFirst' } },
  argTypes: {
    loadMore: {
      description: 'This function returns new items to be shown in the list.',
    }
  }
};


const Template: Story<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState({
    content: ['item 1', 'item 2'],
    last: false,
  });
  
  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setList({last: true, content: [...list.content, 'item 3', 'item 4']});
      setLoading(false);
    }, 2000);
  };

  const loader = () => (<Styled.Loading>loading...</Styled.Loading>);

  return (
    <InfiniteScroll
      hasMore={!list.last} 
      loadMore={loadMore}
      isLoading={loading}  
      loader={loader()}
    >
      {list.content.map(item => (
        <Styled.Item key={item}>{item}</Styled.Item>
      ))}
    </InfiniteScroll>
  )
};
export const infiniteScroll = Template.bind({});

// infiniteScroll.parameters = {
//   docs: {
//     source: {
//       type: 'code',
//     }
//   }
// };

infiniteScroll.storyName = 'InfiniteScroll';