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

import userEvent from '@testing-library/user-event';
import React from 'react';
import { render, screen } from 'unit-test/testUtils';
import Accordion from '..';

test('render Accordion with only one open', async () => {
  render(
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>
          <span>Item 1</span>
        </Accordion.Header>
        <Accordion.Body>
          <div>Content 1</div>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>
          <span>Item 2</span>
        </Accordion.Header>
        <Accordion.Body>
          <div>Content 2</div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  const firstItem = await screen.findByText('Item 1');
  userEvent.click(firstItem);

  const content1 = await screen.findByText('Content 1');
  expect(content1).toBeInTheDocument();

  const secondItem = await screen.findByText('Item 2');
  userEvent.click(secondItem);

  const content2 = await screen.findByText('Content 2');

  expect(content2).toBeInTheDocument();
  expect(content1).not.toBeInTheDocument();
});

test('render Accordion with multiples', async () => {
  render(
    <Accordion multiples>
      <Accordion.Item>
        <Accordion.Header>
          <span>Item 1</span>
        </Accordion.Header>
        <Accordion.Body>
          <div>Content 1</div>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Header>
          <span>Item 2</span>
        </Accordion.Header>
        <Accordion.Body>
          <div>Content 2</div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  const firstItem = await screen.findByText('Item 1');
  userEvent.click(firstItem);

  const content1 = await screen.findByText('Content 1');
  expect(content1).toBeInTheDocument();

  const secondItem = await screen.findByText('Item 2');
  userEvent.click(secondItem);

  const content2 = await screen.findByText('Content 2');

  expect(content2).toBeInTheDocument();
  expect(content1).toBeInTheDocument();
});