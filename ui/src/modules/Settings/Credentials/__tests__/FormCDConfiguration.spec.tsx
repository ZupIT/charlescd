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
import { render, act, screen } from 'unit-test/testUtils';
import FormCDConfiguration from '../Sections/CDConfiguration/Form';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';


test('render CD Configuration form for CharlesCD', async () => {
  const mockOnFinish = jest.fn();
  render(
    <FormCDConfiguration onFinish={mockOnFinish}/>
  );

  const nameCdConfiguration = await screen.findByTestId('input-text-name');
  const namespaceCdConfiguration = await screen.findByTestId('input-text-configurationData.namespace');
  const gitTokenCdConfiguration = await screen.findByTestId('input-text-configurationData.gitToken');

  expect(nameCdConfiguration).toBeInTheDocument();
  expect(namespaceCdConfiguration).toBeInTheDocument();
  expect(gitTokenCdConfiguration).toBeInTheDocument();


  const defaultProvider = await screen.findByTestId('radio-group-cd-configuration-provider-item-DEFAULT')
  await act(async () => {
    userEvent.type(nameCdConfiguration, "test")
    userEvent.type(namespaceCdConfiguration, "test")
    userEvent.type(gitTokenCdConfiguration, "test")
  })

  const gitProvider = await screen.findByText("Git provider")

  await act(async () => selectEvent.select(gitProvider, 'GitHub'));

  await act(async () =>  userEvent.click(defaultProvider))
  
  const buttonProvider = await screen.findByTestId('button-default-cd-configuration-save')
  await act(async () => userEvent.click(buttonProvider))
    

  expect(mockOnFinish).toBeCalled();
});

test('Should not call mockOnFinish with empty fields (gitToken)', async () => {
  const mockOnFinish = jest.fn();
  render(
    <FormCDConfiguration onFinish={mockOnFinish}/>
  );

  const nameCdConfiguration = await screen.findByTestId('input-text-name');
  const namespaceCdConfiguration = await screen.findByTestId('input-text-configurationData.namespace');
  const gitTokenCdConfiguration = await screen.findByTestId('input-text-configurationData.gitToken');

  expect(nameCdConfiguration).toBeInTheDocument();
  expect(namespaceCdConfiguration).toBeInTheDocument();
  expect(gitTokenCdConfiguration).toBeInTheDocument();


  const defaultProvider = await screen.findByTestId('radio-group-cd-configuration-provider-item-DEFAULT')
  await act(async () => {
    userEvent.type(nameCdConfiguration, "test")
    userEvent.type(namespaceCdConfiguration, "test")
  })

  const gitProvider = await screen.findByText("Git provider")

  await act(async () => selectEvent.select(gitProvider, 'GitHub'));

  await act(async () =>  userEvent.click(defaultProvider))
  
  const buttonProvider = await screen.findByTestId('button-default-cd-configuration-save')
  await act(async () => userEvent.click(buttonProvider))
    

  expect(mockOnFinish).not.toBeCalled();
});


test('Should not call mockOnFinish with empty fields (AWS values)', async () => {
  const mockOnFinish = jest.fn();
  render(
    <FormCDConfiguration onFinish={mockOnFinish}/>
  );

  const nameCdConfiguration = await screen.findByTestId('input-text-name');
  const namespaceCdConfiguration = await screen.findByTestId('input-text-configurationData.namespace');
  const gitTokenCdConfiguration = await screen.findByTestId('input-text-configurationData.gitToken');

  expect(nameCdConfiguration).toBeInTheDocument();
  expect(namespaceCdConfiguration).toBeInTheDocument();
  expect(gitTokenCdConfiguration).toBeInTheDocument();


  const defaultProvider = await screen.findByTestId('radio-group-cd-configuration-provider-item-EKS')
  await act(async () => {
    userEvent.type(nameCdConfiguration, "test")
    userEvent.type(namespaceCdConfiguration, "test")
    userEvent.type(gitTokenCdConfiguration, "test")
  })

  const gitProvider = await screen.findByText("Git provider")

  await act(async () => selectEvent.select(gitProvider, 'GitHub'));

  await act(async () =>  userEvent.click(defaultProvider))
  
  const buttonProvider = await screen.findByTestId('button-default-cd-configuration-save')
  await act(async () => userEvent.click(buttonProvider))
    

  expect(mockOnFinish).not.toBeCalled();

  const awsClusterNameCdConfiguration = await screen.findByTestId('input-text-configurationData.awsClusterName');
  const awsRegionCdConfiguration = await screen.findByTestId('input-text-configurationData.awsRegion');

  expect(awsClusterNameCdConfiguration).toBeInTheDocument();
  expect(awsRegionCdConfiguration).toBeInTheDocument();
 
});


test('Should not call mockOnFinish with empty fields (Others values)', async () => {
  const mockOnFinish = jest.fn();
  render(
    <FormCDConfiguration onFinish={mockOnFinish}/>
  );

  const nameCdConfiguration = await screen.findByTestId('input-text-name');
  const namespaceCdConfiguration = await screen.findByTestId('input-text-configurationData.namespace');
  const gitTokenCdConfiguration = await screen.findByTestId('input-text-configurationData.gitToken');

  expect(nameCdConfiguration).toBeInTheDocument();
  expect(namespaceCdConfiguration).toBeInTheDocument();
  expect(gitTokenCdConfiguration).toBeInTheDocument();


  const defaultProvider = await screen.findByTestId('radio-group-cd-configuration-provider-item-GENERIC')
  await act(async () => {
    userEvent.type(nameCdConfiguration, "test")
    userEvent.type(namespaceCdConfiguration, "test")
    userEvent.type(gitTokenCdConfiguration, "test")
  })

  const gitProvider = await screen.findByText("Git provider")

  await act(async () => selectEvent.select(gitProvider, 'GitHub'));

  await act(async () =>  userEvent.click(defaultProvider))
  
  const buttonProvider = await screen.findByTestId('button-default-cd-configuration-save')
  await act(async () => userEvent.click(buttonProvider))
    

  expect(mockOnFinish).not.toBeCalled();

  const genericHostCdConfiguration = await screen.findByTestId('input-text-configurationData.host');

  expect(genericHostCdConfiguration).toBeInTheDocument();
});