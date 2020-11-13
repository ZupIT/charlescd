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
import { render, screen, fireEvent, waitFor, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import FormRegistry from '../Sections/Registry/Form';
import MutationObserver from 'mutation-observer';
import { Props as AceEditorprops } from 'core/components/Form/AceEditor';
import { Controller as MockController } from 'react-hook-form';

(global as any).MutationObserver = MutationObserver;

const mockOnFinish = jest.fn();
const mockSave = jest.fn();

afterEach(() => {
  mockSave.mockClear();
});

jest.mock('../Sections/Registry/hooks', () => {
  return {
    __esModule: true,
    useRegistry: () => ({
      save: mockSave,
    })
  };
});

jest.mock('core/components/Form/AceEditor', () => {
  return {
    __esModule: true,
    A: true,
    default: ({
      control,
      rules,
      name,
      className,
      defaultValue
    }: AceEditorprops) => {
      return (
        <MockController
          as={
            <textarea name={name} data-testid={`input-text-${name}`}></textarea>
          }
          rules={rules}
          name={name}
          control={control}
          className={className}
          defaultValue={defaultValue}
        />
      );
    }
  };
});

test('render Registry form default component', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const azureButton = screen.getByTestId("radio-group-registry-item-AZURE");
  const GCPButton = screen.getByTestId("radio-group-registry-item-GCP");
  const AWSButton = screen.getByTestId("radio-group-registry-item-AWS");
  const dockerHubButton = screen.getByTestId("radio-group-registry-item-DOCKER_HUB");
  
  expect(azureButton).toBeInTheDocument();
  expect(GCPButton).toBeInTheDocument();
  expect(AWSButton).toBeInTheDocument();
  expect(dockerHubButton).toBeInTheDocument();
});

test('render Registry form with azure values', () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const radioButton = screen.getByTestId("radio-group-registry-item-AZURE");
  userEvent.click(radioButton);

  const text = screen.getByText('Enter the username');
  expect(text).toBeInTheDocument();
});

test('render Registry form with AWS values', () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const radioButton = screen.getByTestId("radio-group-registry-item-AWS");
  userEvent.click(radioButton);
  
  const text = screen.getByText('Enter the region');
  expect(text).toBeInTheDocument();
});

test('render Registry form with AWS values and secret input', () => {
    render(<FormRegistry onFinish={mockOnFinish}/>);
  
    const radioButton = screen.getByTestId("radio-group-registry-item-AWS");
    userEvent.click(radioButton);
    
    const radioAuthButton = screen.getByTestId("switch-aws-auth-handler");
    userEvent.click(radioAuthButton);

    const text = screen.getByText('Enter the access key');
    expect(text).toBeInTheDocument();
});

test('render Registry form without AWS values and secret input', () => {
    render(<FormRegistry onFinish={mockOnFinish}/>);
  
    const radioButton = screen.getByTestId("radio-group-registry-item-AWS");
    userEvent.click(radioButton);
    
    const text = screen.queryByText('Enter the access key');
    expect(text).not.toBeInTheDocument();
});

test('render Registry form with GCP form', () => {
  render(
    <FormRegistry onFinish={mockOnFinish} />
  );

  const radioButton = screen.getByTestId('radio-group-registry-item-GCP');
  act(() => userEvent.click(radioButton));
  
  const projectIdInput = screen.getByText('Enter the project id');
  expect(projectIdInput).toBeInTheDocument();
});

test('Not trigger onSubmit on json parse error with GCP form', () => {
  render(<FormRegistry onFinish={mockOnFinish} />);

  const radioButton = screen.getByTestId('radio-group-registry-item-GCP');
  userEvent.click(radioButton);
  
  const inputGCPName = screen.getByTestId('input-text-name');
  expect(inputGCPName).toBeInTheDocument();

  const inputGCPAddress = screen.getByTestId('input-text-address');
  expect(inputGCPAddress).toBeInTheDocument();

  const inputGCPOrganization = screen.getByTestId('input-text-organization');
  expect(inputGCPOrganization).toBeInTheDocument();

  const inputGCPJsonKey = screen.getByTestId('input-text-jsonKey');
  expect(inputGCPJsonKey).toBeInTheDocument();

  const submitButton = screen.getByTestId('button-default-submit-registry');
  expect(submitButton).toBeInTheDocument();

  userEvent.type(inputGCPName, 'fake-name');
  userEvent.type(inputGCPAddress, 'http://fake-host');
  userEvent.type(inputGCPOrganization, 'fake-access-key');
  userEvent.type(inputGCPJsonKey, 'te');
  userEvent.click(submitButton);

  waitFor(() => expect(mockOnFinish).not.toBeCalled());
});

test('Trigger submit on json parse success with GCP form', async () => {
  render(<FormRegistry onFinish={mockOnFinish} />);

  const radioButton = screen.getByTestId('radio-group-registry-item-GCP');
  userEvent.click(radioButton);

  const inputGCPName = screen.getByTestId('input-text-name');
  expect(inputGCPName).toBeInTheDocument();

  const inputGCPAddress = screen.getByTestId('input-text-address');
  expect(inputGCPAddress).toBeInTheDocument();

  const inputGCPOrganization = screen.getByTestId('input-text-organization');
  expect(inputGCPOrganization).toBeInTheDocument();

  const inputGCPJsonKey = screen.getByTestId('input-text-jsonKey');
  expect(inputGCPJsonKey).toBeInTheDocument();

  const submitButton = screen.getByTestId('button-default-submit-registry');
  expect(submitButton).toBeInTheDocument();

  userEvent.type(inputGCPName, 'fake-name');
  userEvent.type(inputGCPAddress, 'http://fake-host');
  userEvent.type(inputGCPOrganization, 'fake-access-key');
  fireEvent.change(inputGCPJsonKey, { target: { value: '{ "testKey": "testValue"}' }});
  userEvent.click(submitButton);
  
  await waitFor(() => expect(mockSave).toHaveBeenCalledTimes(1));
});

test('render Registry form with Docker Hub form', async () => {
  render(<FormRegistry onFinish={mockOnFinish}/>);

  const radioButton = screen.getByTestId('radio-group-registry-item-DOCKER_HUB');
  userEvent.click(radioButton);
  
  const registryField = screen.getByText('Type a name for Registry');
  expect(registryField).toBeInTheDocument();

  const registryURLField = screen.getByText('Enter the registry url');
  expect(registryURLField).toBeInTheDocument();

  const usernameField = screen.getByText('Enter the username');
  expect(usernameField).toBeInTheDocument();

  const passwordField = screen.getByText('Enter the password');
  expect(passwordField).toBeInTheDocument();
  const submitButton = screen.getByTestId('button-default-submit-registry');
  expect(submitButton).toBeInTheDocument();
});

test('execute onSubmit', () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const radioButton = screen.getByTestId("radio-group-registry-item-AWS");
  userEvent.click(radioButton);
  
  const radioAuthButton = screen.getByTestId("switch-aws-auth-handler");
  userEvent.click(radioAuthButton);
  
  const inputAwsName = screen.getByTestId("input-text-name");

  const inputAwsAddress = screen.getByTestId("input-text-address");
  expect(inputAwsName).toBeInTheDocument();

  const inputAwsAccessKey = screen.getByTestId("input-password-accessKey");
  expect(inputAwsAccessKey).toBeInTheDocument();

  const inputAwsSecretKey = screen.getByTestId("input-text-secretKey");
  expect(inputAwsSecretKey).toBeInTheDocument();

  const inputAwsRegion = screen.getByTestId("input-text-region");
  expect(inputAwsRegion).toBeInTheDocument();

  const submitButton = screen.getByTestId("button-default-submit-registry");
  expect(submitButton).toBeInTheDocument();

  userEvent.type(inputAwsName, 'fake-name');
  userEvent.type(inputAwsAddress, 'http://fake-host');
  userEvent.type(inputAwsAccessKey, 'fake-access-key');
  userEvent.type(inputAwsSecretKey, 'fake-secret-key');
  userEvent.type(inputAwsRegion, 'fake-region');
  userEvent.click(submitButton);

  waitFor(() => expect(mockSave).toBeCalledTimes(1));
});

test('should not execute onSubmit because validation (missing name)', () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const radioButton = screen.getByTestId("radio-group-registry-item-AWS");
  userEvent.click(radioButton);
  
  const radioAuthButton = screen.getByTestId("switch-aws-auth-handler");
  userEvent.click(radioAuthButton);
  
  const inputAwsAddress = screen.getByTestId("input-text-address");
  expect(inputAwsAddress).toBeInTheDocument();

  const inputAwsAccessKey = screen.getByTestId("input-password-accessKey");
  expect(inputAwsAccessKey).toBeInTheDocument();

  const inputAwsSecretKey = screen.getByTestId("input-text-secretKey");
  expect(inputAwsSecretKey).toBeInTheDocument();

  const inputAwsRegion = screen.getByTestId("input-text-region");
  expect(inputAwsRegion).toBeInTheDocument();

  const submitButton = screen.getByTestId("button-default-submit-registry");
  expect(submitButton).toBeInTheDocument();

  userEvent.type(inputAwsAddress, 'http://fake-host');
  userEvent.type(inputAwsAccessKey, 'fake-access-key');
  userEvent.type(inputAwsSecretKey, 'fake-secret-key');
  userEvent.type(inputAwsRegion, 'fake-region');
  userEvent.click(submitButton);

  expect(mockOnFinish).not.toBeCalled();
});
