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

import React from 'react';
import { render, screen } from 'unit-test/testUtils';
import Placeholder from '../';

test('render Placeholder default component', () => {
  const props = {    
    icon: "circles-empty",
    title: "Title",
    subtitle: "Subtitle"
  }

  render(
    <Placeholder icon={props.icon} title={props.title} subtitle={props.subtitle} />
  );

  const titleElement = screen.getByText(props.title);
  const subtitleElement = screen.getByText(props.subtitle);
  
  expect(titleElement).toHaveTextContent(props.title);
  expect(subtitleElement).toHaveTextContent(props.subtitle);
});

test('render Placeholder with description', () => {
  const props = {    
    icon: "circles-empty",
    title: "Title",
    description: "Description"
  }

  render(
    <Placeholder icon={props.icon} title={props.title} description={props.description} />
  );

  const titleElement = screen.getByText(props.title);
  const descriptionElement = screen.getByText(props.description);
  
  expect(titleElement).toHaveTextContent(props.title);
  expect(descriptionElement).toHaveTextContent(props.description);
});