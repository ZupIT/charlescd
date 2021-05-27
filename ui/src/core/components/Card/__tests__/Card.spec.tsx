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

import { render, screen } from 'unit-test/testUtils';
import { base as CardBase } from 'stories/Cards/CardBase.stories';
import { body as CardBody } from 'stories/Cards/CardBody.stories';

test('render Card', () => {
  render(
    <CardBase>
      <CardBody>content</CardBody>
    </CardBase>
  );

  expect(screen.getByText('content')).toBeInTheDocument();
});
