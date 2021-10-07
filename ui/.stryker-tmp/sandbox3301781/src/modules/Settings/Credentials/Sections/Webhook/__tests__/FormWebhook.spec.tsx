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


import React from 'react';
import { render, screen } from 'unit-test/testUtils';
import FormWebhook from '../Form';
import { Webhook } from '../interfaces';

test('should render form in create mode', async () => {
  const data: Webhook = null;
  const onFinish = jest.fn();

  render(<FormWebhook data={data} onFinish={onFinish} />);

  const textElement = await screen.findByText('Add Webhook');
  expect(textElement).toBeInTheDocument();
});

test('should render form in edit mode', async () => {
  const data: Webhook = {
    id: '123',
    apiKey: 'key',
    events: ['DEPLOY', 'UNDEPLOY'],
    description: 'description',
    url: 'https://charlescd.io/webhook'
  };
  const onFinish = jest.fn();

  render(<FormWebhook data={data} onFinish={onFinish} />);

  const textElement = await screen.findByText('Edit Webhook');
  expect(textElement).toBeInTheDocument();
  
  const inputDescriptionElement = await screen.findByTestId('input-text-description');
  expect(inputDescriptionElement).toBeInTheDocument();
  expect(inputDescriptionElement).toHaveValue(data.description);

  const inputUrlElement = await screen.findByTestId('input-text-url');
  expect(inputUrlElement).toBeInTheDocument();
  expect(inputUrlElement).toHaveValue(data.url);

  const radioEverythingElement = await screen.findByTestId('radio-everything');
  expect(radioEverythingElement).toBeInTheDocument();
  expect(radioEverythingElement).toBeChecked();
});

test('should show text to documentation', () => {
  const data: Webhook = null;
  const onFinish = jest.fn();

  render(<FormWebhook data={data} onFinish={onFinish} />);

  expect(screen.getByText(/See our/i)).toBeInTheDocument();
  expect(screen.getByText(/documentation/i)).toBeInTheDocument();
  expect(screen.getByText(/for further details./i)).toBeInTheDocument();
});

test('should render secret field as optional', () => {
  const data: Webhook = null;
  const onFinish = jest.fn();

  render(<FormWebhook data={data} onFinish={onFinish} />);

  const secretLabel = screen.getByLabelText('Secret (Optional)');
  expect(secretLabel).toBeInTheDocument();
});

test('should render events trigger text', () => {
  const data: Webhook = null;
  const onFinish = jest.fn();

  render(<FormWebhook data={data} onFinish={onFinish} />);

  const eventsText = screen.getByText('Which events would you like to trigger this webhook?');
  expect(eventsText).toBeInTheDocument();
});