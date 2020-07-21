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
import { render, fireEvent, wait, act, cleanup } from 'unit-test/testUtils';
import FormRegistry from '../Sections/Registry/Form';
import MutationObserver from 'mutation-observer'

(global as any).MutationObserver = MutationObserver

const mockOnFinish = jest.fn();
const mockSave = jest.fn()

afterEach(() => {
  mockSave.mockClear()
});

jest.mock('../Sections/Registry/hooks', () => {
  return {
    __esModule: true,
    useRegistry: () => ({
      save: mockSave,
    })
  };
});

test('render Registry form default component', async () => {
  const { container } = render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  await wait();
  expect(container.innerHTML).toMatch("test");
});

test('render Registry form with azure values', async () => {
  const { container, getByTestId } = render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  await wait();
  const radioButton = getByTestId("radio-group-registry-item-AZURE");
  fireEvent.click(radioButton)
  await wait();
  expect(container.innerHTML).toMatch("Enter the username");
});

test('render Registry form with AWS values', async () => {
  const { container, getByTestId } = render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  await wait();
  const radioButton = getByTestId("radio-group-registry-item-AWS");
  fireEvent.click(radioButton)
  await wait();
  expect(container.innerHTML).toMatch("Enter the access key");
});

test('execute onSubmit', async () => {
  const { container, getByTestId } = render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  await wait();
  const radioButton = getByTestId("radio-group-registry-item-AWS");
  fireEvent.click(radioButton)
  await wait();
  const inputAwsName = getByTestId("input-text-name");
  const inputAwsAddress = getByTestId("input-text-address");
  const inputAwsAccessKey = getByTestId("password-password-accessKey");
  const inputAwsSecretKey = getByTestId("input-text-secretKey");
  const inputAwsRegion = getByTestId("input-text-region");
  const submitButton = getByTestId("button-default-submit-registry")

  await act(async () => {
    fireEvent.change(inputAwsName, {target: {value: "fake-name"}})
    fireEvent.change(inputAwsAddress, {target: {value: "http://fake-host"}})
    fireEvent.change(inputAwsAccessKey, {target: {value: "fake-access-key"}})
    fireEvent.change(inputAwsSecretKey, {target: {value: "fake-secret-key"}})
    fireEvent.change(inputAwsRegion, {target: {value: "fake-region"}})
    fireEvent.click(submitButton)
  })

  expect(mockSave).toBeCalledTimes(1);
});

test('should not execute onSubmit because validation (missing name)', async () => {
  const { container, getByTestId } = render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  await wait();
  const radioButton = getByTestId("radio-group-registry-item-AWS");
  fireEvent.click(radioButton)
  await wait();
  const inputAwsAddress = getByTestId("input-text-address");
  const inputAwsAccessKey = getByTestId("password-password-accessKey");
  const inputAwsSecretKey = getByTestId("input-text-secretKey");
  const inputAwsRegion = getByTestId("input-text-region");
  const submitButton = getByTestId("button-default-submit-registry")

  await act(async () => {
    fireEvent.change(inputAwsAddress, {target: {value: "http://fake-host"}})
    fireEvent.change(inputAwsAccessKey, {target: {value: "fake-access-key"}})
    fireEvent.change(inputAwsSecretKey, {target: {value: "fake-secret-key"}})
    fireEvent.change(inputAwsRegion, {target: {value: "fake-region"}})
    fireEvent.click(submitButton)
  })

  expect(mockSave).toBeCalledTimes(0);
});
