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

import ContentLoader from 'react-content-loader';

const ListLoader = () => (
  <div>
    <ContentLoader
      speed={1}
      width={543}
      height={300}
      backgroundColor="#3a393c"
      foregroundColor="#2c2b2e"
      data-testid='modal-list-loader'
    >
      <rect x="0" y="0" rx="2" ry="2" width="543" height="72" />
      <rect x="0" y="74" rx="2" ry="2" width="543" height="72" />
      <rect x="0" y="148" rx="2" ry="2" width="543" height="72" />
      <rect x="0" y="222" rx="2" ry="2" width="543" height="72" />
    </ContentLoader>
  </div>
);

export default ListLoader;
