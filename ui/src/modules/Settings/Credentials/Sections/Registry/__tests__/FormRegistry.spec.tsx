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

 // TODO dockerhub

import React from 'react';
import { render, screen, act } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import FormRegistry from '../Form';
import MutationObserver from 'mutation-observer';
import { Props as AceEditorprops } from 'core/components/Form/AceEditor';
import { Controller as MockController } from 'react-hook-form';
import { FetchMock } from 'jest-fetch-mock';

(global as any).MutationObserver = MutationObserver;

const mockOnFinish = jest.fn();

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
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

test('render Registry form with azure values', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const radioButton = screen.getByTestId("radio-group-registry-item-AZURE");
  await act(async () => userEvent.click(radioButton));

  const text = screen.getByText('Enter the username');
  expect(text).toBeInTheDocument();
});

test('should render Registry form with AWS values', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const aws = screen.getByTestId("radio-group-registry-item-AWS");
  await act(async () => userEvent.click(aws));

  const text = screen.getByText('Enter the region');
  expect(text).toBeInTheDocument();
});

test('should render Registry form with AWS values and secret input', () => {
    render(<FormRegistry onFinish={mockOnFinish}/>);

    const aws = screen.getByTestId("radio-group-registry-item-AWS");
    userEvent.click(aws);

    const radioAuthButton = screen.getByTestId("switch-aws-auth-handler");
    userEvent.click(radioAuthButton);

    const text = screen.getByText('Enter the access key');
    expect(text).toBeInTheDocument();
});

test('should render Registry form without AWS secret input', async () => {
    render(<FormRegistry onFinish={mockOnFinish}/>);

    const aws = screen.getByTestId("radio-group-registry-item-AWS");
    await act(async () => userEvent.click(aws));

    const text = screen.queryByText('Enter the access key');
    expect(text).not.toBeInTheDocument();
});

test('should enable submit button after fill AWS form', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({}));
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const aws = screen.getByTestId("radio-group-registry-item-AWS");
  await act(async () => userEvent.click(aws));

  const radioAuthButton = screen.getByTestId("switch-aws-auth-handler");
  await act(async () => userEvent.click(radioAuthButton));

  const inputAwsName = screen.getByTestId("input-text-name");
  const inputAwsAddress = screen.getByTestId("input-text-address");
  const inputAwsAccessKey = screen.getByTestId("input-password-accessKey");
  const inputAwsSecretKey = screen.getByTestId("input-text-secretKey");
  const inputAwsRegion = screen.getByTestId("input-text-region");
  const testConnectionButton = screen.getByText('Test connection');
  const submitButton = screen.getByTestId("button-default-submit-registry");

  await act(async () => {
    userEvent.type(inputAwsName, 'fake-name');
    userEvent.type(inputAwsAddress, 'http://fake-host');
    userEvent.type(inputAwsAccessKey, 'fake-access-key');
    userEvent.type(inputAwsSecretKey, 'fake-secret-key');
    userEvent.type(inputAwsRegion, 'fake-region');
  });

  expect(testConnectionButton).not.toBeDisabled();
  await act(async () => userEvent.click(testConnectionButton));
  expect(submitButton).not.toBeDisabled();
});

test('should not enable submit button after partially filled AWS form', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const aws = screen.getByTestId("radio-group-registry-item-AWS");
  await act(async () => userEvent.click(aws));

  const radioAuthButton = screen.getByTestId("switch-aws-auth-handler");
  await act(async () => userEvent.click(radioAuthButton));

  const inputAwsAddress = screen.getByTestId("input-text-address");
  const inputAwsAccessKey = screen.getByTestId("input-password-accessKey");
  const inputAwsSecretKey = screen.getByTestId("input-text-secretKey");
  const inputAwsRegion = screen.getByTestId("input-text-region");
  const testConnectionButton = screen.getByText('Test connection');
  const submitButton = screen.getByTestId("button-default-submit-registry");

  await act(async () => {
    userEvent.type(inputAwsAddress, 'http://fake-host');
    userEvent.type(inputAwsAccessKey, 'fake-access-key');
    userEvent.type(inputAwsSecretKey, 'fake-secret-key');
    userEvent.type(inputAwsRegion, 'fake-region');
  });

  expect(testConnectionButton).toBeDisabled();
  expect(submitButton).toBeDisabled();
});

test('should test AWS registry connection successful', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({ }));

  render(<FormRegistry onFinish={mockOnFinish} />);

  const aws = screen.getByTestId("radio-group-registry-item-AWS");
  userEvent.click(aws);

  const radioAuthButton = screen.getByTestId("switch-aws-auth-handler");
  await act(async () => userEvent.click(radioAuthButton));

  const inputAwsName = screen.getByTestId("input-text-name");
  const inputAwsAddress = screen.getByTestId("input-text-address");
  const inputAwsAccessKey = screen.getByTestId("input-password-accessKey");
  const inputAwsSecretKey = screen.getByTestId("input-text-secretKey");
  const inputAwsRegion = screen.getByTestId("input-text-region");
  const testConnectionButton = screen.getByText('Test connection');

  await act(async () => {
    userEvent.type(inputAwsName, 'fake-name');
    userEvent.type(inputAwsAddress, 'http://fake-host');
    userEvent.type(inputAwsAccessKey, 'fake-access-key');
    userEvent.type(inputAwsSecretKey, 'fake-secret-key');
    userEvent.type(inputAwsRegion, 'fake-region');
  });

  await act(async () => userEvent.click(testConnectionButton));
  const successMessage = screen.getByText('Successful connection.');
  expect(successMessage).toBeInTheDocument();
});

test('should test AWS registry connection error', async () => {
  const error = {
    status: '404',
    message: 'invalid registry'
  };
  (fetch as FetchMock).mockRejectedValueOnce(new Response(JSON.stringify(error)));

  render(<FormRegistry onFinish={mockOnFinish} />);

  const aws = screen.getByTestId("radio-group-registry-item-AWS");
  userEvent.click(aws);

  const radioAuthButton = screen.getByTestId("switch-aws-auth-handler");
  await act(async () => userEvent.click(radioAuthButton));

  const inputAwsName = screen.getByTestId("input-text-name");
  const inputAwsAddress = screen.getByTestId("input-text-address");
  const inputAwsAccessKey = screen.getByTestId("input-password-accessKey");
  const inputAwsSecretKey = screen.getByTestId("input-text-secretKey");
  const inputAwsRegion = screen.getByTestId("input-text-region");
  const testConnectionButton = screen.getByText('Test connection');

  await act(async () => {
    userEvent.type(inputAwsName, 'fake-name');
    userEvent.type(inputAwsAddress, 'http://fake-host');
    userEvent.type(inputAwsAccessKey, 'fake-access-key');
    userEvent.type(inputAwsSecretKey, 'fake-secret-key');
    userEvent.type(inputAwsRegion, 'fake-region');
  });

  userEvent.click(testConnectionButton);

  const errorMessage = await screen.findByText('invalid registry');
  expect(errorMessage).toBeInTheDocument();
});

test('render Registry form with GCP form', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish} />
  );

  const gcp = screen.getByTestId('radio-group-registry-item-GCP');
  await act(async () => userEvent.click(gcp));

  const projectIdInput = screen.getByText('Enter the project id');
  expect(projectIdInput).toBeInTheDocument();
});

test('should not enable submit button after partially filled GCP form', async () => {
  render(<FormRegistry onFinish={mockOnFinish} />);

  const gcp = screen.getByTestId('radio-group-registry-item-GCP');
  userEvent.click(gcp);

  const inputGCPName = screen.getByTestId('input-text-name');
  const inputGCPAddress = screen.getByTestId('input-text-address');
  const inputGCPOrganization = screen.getByTestId('input-text-organization');
  const inputGCPJsonKey = screen.getByTestId('input-text-jsonKey');
  const submitButton = screen.getByText('Save');

  await act(async () => {
    userEvent.type(inputGCPName, 'fake-name');
    userEvent.type(inputGCPAddress, 'http://fake-host');
    userEvent.type(inputGCPOrganization, 'fake-access-key');
    userEvent.type(inputGCPJsonKey, '');
  });

  expect(submitButton).toBeDisabled();
});

test('should enable submit button after fill GCP form', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({}));

  render(<FormRegistry onFinish={mockOnFinish} />);

  const gcp = screen.getByTestId('radio-group-registry-item-GCP');
  await act(async () => userEvent.click(gcp));

  const inputGCPName = screen.getByTestId('input-text-name');
  const inputGCPAddress = screen.getByTestId('input-text-address');
  const inputGCPOrganization = screen.getByTestId('input-text-organization');
  const inputGCPJsonKey = screen.getByTestId('input-text-jsonKey');
  const submitButton = screen.getByText('Save');

  await act(async () => {
    userEvent.type(inputGCPName, 'fake-name');
    userEvent.type(inputGCPAddress, 'http://fake-host');
    userEvent.type(inputGCPOrganization, 'fake-access-key');
    userEvent.type(inputGCPJsonKey, '{ "testKey": "testValue" }');
  });

  expect(submitButton).not.toBeDisabled();
});

test('render Registry form with Docker Hub form', async () => {
  render(<FormRegistry onFinish={mockOnFinish}/>);

  const radioButton = screen.getByTestId('radio-group-registry-item-DOCKER_HUB');
  await act(async () => userEvent.click(radioButton));

  const registryField = screen.getByText('Type a name for Registry');
  const registryURLField = screen.getByText('Enter the registry url');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');
  const submitButton = screen.getByTestId('button-default-submit-registry');
  expect(submitButton).toBeInTheDocument();
}); 