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
import { render, act, screen, waitFor } from 'unit-test/testUtils';
import FormRegistry from '../Form';
import { FetchMock } from 'jest-fetch-mock';
import { Props as AceEditorprops } from 'core/components/Form/AceEditor';
import { Controller as MockController } from 'react-hook-form';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';

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

test('render Registry form default component', () => {
  render(<FormRegistry onFinish={mockOnFinish}/>);

  const addRegistryText = screen.getByText('Add Registry');
  expect(addRegistryText).toBeInTheDocument();

  const chooseRegistryText = screen.getByText('Choose which one you want to add:');
  expect(chooseRegistryText).toBeInTheDocument();
});

test('render Registry form with AZURE values', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Azure');

  const fillInfoText = await screen.findByText('Fill in the fields below with your Azure information:');
  expect(fillInfoText).toBeInTheDocument();

  const text = screen.getByText('Enter the username');
  expect(text).toBeInTheDocument();
});

test('should submit AZURE form', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Azure');

  const registryField = await screen.findByText('Type a name for Registry');
  const registryURLField = screen.getByText('Enter the registry url');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(registryURLField, 'http://fake-host');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar!');
  });

  const testConnectionButton = await screen.findByText('Test connection');
  const submitButton = screen.getByTestId('button-default-submit-registry');

  expect(testConnectionButton).not.toBeDisabled();
  expect(submitButton).not.toBeDisabled();
});

test('should have successful test connection with AZURE registry', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({ }));
  render(<FormRegistry onFinish={mockOnFinish}/>);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Azure');
  
  const registryField = await screen.findByText('Type a name for Registry');
  const registryURLField = screen.getByText('Enter the registry url');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');
  const testConnectionButton = screen.getByText('Test connection');
  const submitButton = screen.getByTestId('button-default-submit-registry');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(registryURLField, 'http://fake-host');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar');
  });

  expect(submitButton).not.toBeDisabled();

  await act(async () => userEvent.click(testConnectionButton));
  const successMessage = await screen.findByText('Successful connection with Azure.');
  expect(successMessage).toBeInTheDocument();
});

test('should have failed test connection with AZURE registry', async () => {
  const error = {
    status: '404',
    message: 'invalid registry'
  };
  (fetch as FetchMock).mockRejectedValueOnce(new Response(JSON.stringify(error)));
  render(<FormRegistry onFinish={mockOnFinish}/>);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Azure');
  
  const registryField = await screen.findByText('Type a name for Registry');
  const registryURLField = screen.getByText('Enter the registry url');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');
  const testConnectionButton = screen.getByText('Test connection');
  let submitButton = screen.getByTestId('button-default-submit-registry');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(registryURLField, 'http://fake-host');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar');
  });


  await act(async () => userEvent.click(testConnectionButton));
  const errorMessage = await screen.findByText('invalid registry');
  expect(errorMessage).toBeInTheDocument();
  expect(submitButton).not.toBeDisabled();
});


test('should render Registry with GCP form', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish} />
  );

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'GCP');

  const fillInfoText = await screen.findByText('Fill in the fields below with your GCP information:');
  expect(fillInfoText).toBeInTheDocument();
  
  const projectIdInput = screen.getByText('Enter the project id');
  expect(projectIdInput).toBeInTheDocument();
});

test('should not trigger onSubmit on json parse error with GCP form', async () => {
  render(<FormRegistry onFinish={mockOnFinish} />);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'GCP');
  
  const inputGCPName = await screen.findByTestId('input-text-name');
  const inputGCPAddress = screen.getByTestId('input-text-address');
  const inputGCPOrganization = screen.getByTestId('input-text-organization');
  const inputGCPJsonKey = screen.getByTestId('input-text-jsonKey');
  const submitButton = screen.getByTestId('button-default-submit-registry');

  await act(async () => {
    userEvent.type(inputGCPName, 'fake-name');
    userEvent.type(inputGCPAddress, 'http://fake-host');
    userEvent.type(inputGCPOrganization, 'fake-access-key');
    userEvent.type(inputGCPJsonKey, 'te');
    userEvent.click(submitButton);

  });

  expect(mockOnFinish).not.toBeCalled();
});

test('should not enable submit button after partially filled GCP form', async () => {
  render(<FormRegistry onFinish={mockOnFinish} />);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'GCP');

  const inputGCPName = await screen.findByTestId('input-text-name');
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

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'GCP');

  const inputGCPName = await screen.findByTestId('input-text-name');
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
  
  const testConnectionButton = screen.getByText('Test connection');
  await act(async () => userEvent.click(testConnectionButton));

  const successMessage = await screen.findByText('Successful connection with GCP.');
  expect(successMessage).toBeInTheDocument();
  expect(submitButton).not.toBeDisabled();
});

test('should test connectivity with GCR successful', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({ }));

  render(<FormRegistry onFinish={mockOnFinish} />);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'GCP');
  
  const inputGCPName = await screen.findByTestId('input-text-name');
  const inputGCPAddress = screen.getByTestId('input-text-address');
  const inputGCPOrganization = screen.getByTestId('input-text-organization');
  const inputGCPJsonKey = screen.getByTestId('input-text-jsonKey');

  await act(async () => {
    userEvent.type(inputGCPName, 'fake-name');
    userEvent.type(inputGCPAddress, 'http://fake-host');
    userEvent.type(inputGCPOrganization, 'fake-access-key');
    userEvent.type(inputGCPJsonKey, '{ "testKey": "testValue" }');
  });
  
  const testConnectionButton = screen.getByText('Test connection');
  await act(async () => userEvent.click(testConnectionButton));

  const successMessage = await screen.findByText('Successful connection with GCP.');
  expect(successMessage).toBeInTheDocument();
});

test('should test connectivity with GCR error', async () => {
  const error = {
    status: '404',
    message: 'invalid registry'
  };
  (fetch as FetchMock).mockRejectedValueOnce(new Response(JSON.stringify(error)));

  render(<FormRegistry onFinish={mockOnFinish} />);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'GCP');
  
  const inputGCPName = await screen.findByTestId('input-text-name');
  const inputGCPAddress = screen.getByTestId('input-text-address');
  const inputGCPOrganization = screen.getByTestId('input-text-organization');
  const inputGCPJsonKey = screen.getByTestId('input-text-jsonKey');
  const testConnectionButton = screen.getByText('Test connection');

  await act(async () => {
    userEvent.type(inputGCPName, 'fake-name');
    userEvent.type(inputGCPAddress, 'http://fake-host');
    userEvent.type(inputGCPOrganization, 'fake-access-key');
    userEvent.type(inputGCPJsonKey, '{ "testKey": "testValue" }');
  });

  userEvent.click(testConnectionButton);

  const errorMessage = await screen.findByText('invalid registry');
  expect(errorMessage).toBeInTheDocument();
});

test('should render Registry form with AWS values', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'AWS');

  const fillInfoText = await screen.findByText('Fill in the fields below with your AWS information:');
  expect(fillInfoText).toBeInTheDocument();
  
  const text = screen.getByText('Enter the region');
  expect(text).toBeInTheDocument();
});

test('should render Registry form with AWS values and secret input', async () => {
    render(<FormRegistry onFinish={mockOnFinish}/>);
  
    const registryLabel = screen.getByText('Choose which one you want to add:');
    selectEvent.select(registryLabel, 'AWS');
    
    const radioAuthButton = await screen.findByTestId("switch-aws-auth-handler");
    userEvent.click(radioAuthButton);

    const text = screen.getByText('Enter the access key');
    expect(text).toBeInTheDocument();
});

test('should render Registry form without AWS secret input', async () => {
    render(<FormRegistry onFinish={mockOnFinish}/>);
  
    const registryLabel = screen.getByText('Choose which one you want to add:');
    await act(() => selectEvent.select(registryLabel, 'AWS'));
        
    const text = screen.queryByText('Enter the access key');
    expect(text).not.toBeInTheDocument();
});

test('should enable submit button after fill AWS form', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({}));
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'AWS');
  
  const radioAuthButton = await screen.findByTestId("switch-aws-auth-handler");
  await act(async () => userEvent.click(radioAuthButton));
  
  const inputAwsName = screen.getByTestId("input-text-name");
  const inputAwsAddress = screen.getByTestId("input-text-address");
  const inputAwsAccessKey = screen.getByTestId("input-password-accessKey");
  const inputAwsSecretKey = screen.getByTestId("input-password-secretKey");
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
  expect(submitButton).not.toBeDisabled();
});

test('should not enable submit button after partially filled AWS form (missing name)', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'AWS');
  
  const radioAuthButton = await screen.findByTestId("switch-aws-auth-handler");
  await act(async () => userEvent.click(radioAuthButton));
  
  const inputAwsAddress = screen.getByTestId("input-text-address");
  const inputAwsAccessKey = screen.getByTestId("input-password-accessKey");
  const inputAwsSecretKey = screen.getByTestId("input-password-secretKey");
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

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'AWS');

  const radioAuthButton = await screen.findByTestId("switch-aws-auth-handler");
  await act(async () => userEvent.click(radioAuthButton));
  
  const inputAwsName = screen.getByTestId("input-text-name");
  const inputAwsAddress = screen.getByTestId("input-text-address");
  const inputAwsAccessKey = screen.getByTestId("input-password-accessKey");
  const inputAwsSecretKey = screen.getByTestId("input-password-secretKey");
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
  const successMessage = screen.getByText('Successful connection with AWS.');
  expect(successMessage).toBeInTheDocument();
});

test('should test AWS registry connection error', async () => {
  const error = {
    status: '404',
    message: 'invalid registry'
  };
  (fetch as FetchMock).mockRejectedValueOnce(new Response(JSON.stringify(error)));

  render(<FormRegistry onFinish={mockOnFinish} />);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'AWS');

  const radioAuthButton = await screen.findByTestId("switch-aws-auth-handler");
  await act(async () => userEvent.click(radioAuthButton));
  
  const inputAwsName = screen.getByTestId("input-text-name");
  const inputAwsAddress = screen.getByTestId("input-text-address");
  const inputAwsAccessKey = screen.getByTestId("input-password-accessKey");
  const inputAwsSecretKey = screen.getByTestId("input-password-secretKey");
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

test('should render Registry form with Docker Hub form', async () => {
  render(<FormRegistry onFinish={mockOnFinish}/>);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Docker Hub');

  const fillInfoText = await screen.findByText('Fill in the fields below with your Docker Hub information:');
  expect(fillInfoText).toBeInTheDocument();
  
  const registryField = screen.getByText('Type a name for Registry');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');
  const submitButton = screen.getByTestId('button-default-submit-registry');
});

test('should submit Docker Hub form', async () => {
  render(<FormRegistry onFinish={mockOnFinish}/>);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Docker Hub');
  
  const registryField = await screen.findByText('Type a name for Registry');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar!');
  });

  const testConnectionButton = screen.getByText('Test connection');
  const submitButton = screen.getByTestId('button-default-submit-registry');

  expect(testConnectionButton).not.toBeDisabled();
  expect(submitButton).not.toBeDisabled();
  await act(async () => userEvent.click(testConnectionButton));
});

test('should test connectivity with Docker Hub successful', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({ }));
  render(<FormRegistry onFinish={mockOnFinish}/>);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Docker Hub');
  
  const registryField = await screen.findByText('Type a name for Registry');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');
  const testConnectionButton = screen.getByText('Test connection');
  const submitButton = screen.getByTestId('button-default-submit-registry');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar');
  });


  await act(async () => userEvent.click(testConnectionButton));
  const successMessage = await screen.findByText('Successful connection with Docker Hub.');
  expect(successMessage).toBeInTheDocument();
  expect(submitButton).not.toBeDisabled();
});

test('should test connectivity with Docker Hub error', async () => {
  const error = {
    status: '404',
    message: 'invalid registry'
  };
  (fetch as FetchMock).mockRejectedValueOnce(new Response(JSON.stringify(error)));
  render(<FormRegistry onFinish={mockOnFinish}/>);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Docker Hub');
  
  const registryField = await screen.findByText('Type a name for Registry');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');
  const testConnectionButton = screen.getByText('Test connection');
  let submitButton = screen.getByTestId('button-default-submit-registry');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar');
  });

  expect(submitButton).not.toBeDisabled();

  await act(async () => userEvent.click(testConnectionButton));
  const errorMessage = await screen.findByText('invalid registry');
  expect(errorMessage).toBeInTheDocument();
});

test('should render Harbor form', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Harbor');

  const fillInfoText = await screen.findByText('Fill in the fields below with your Harbor information:');
  expect(fillInfoText).toBeInTheDocument();

  const input = await screen.findByText('Enter the username');
  expect(input).toBeInTheDocument();
});

test('should submit Harbor form', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Harbor');

  const registryField = await screen.findByText('Type a name for Registry');
  const registryURLField = screen.getByText('Enter the registry url');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(registryURLField, 'http://fake-host');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar!');
  });

  const testConnectionButton = screen.getByText('Test connection');
  const submitButton = screen.getByTestId('button-default-submit-registry');

  expect(testConnectionButton).not.toBeDisabled();
  expect(submitButton).not.toBeDisabled();
});

test('should not submit Harbor form (missing registry url)', async () => {
  render(
    <FormRegistry onFinish={mockOnFinish}/>
  );

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Harbor');

  const registryField = await screen.findByText('Type a name for Registry');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar');
  });

  const testConnectionButton = screen.getByText('Test connection');
  const submitButton = screen.getByTestId('button-default-submit-registry');

  expect(testConnectionButton).toBeDisabled();
  expect(submitButton).toBeDisabled();
});

test('should test connection with Harbor (success)', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({ }));
  render(<FormRegistry onFinish={mockOnFinish}/>);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Harbor');
  
  const registryField = await screen.findByText('Type a name for Registry');
  const registryURLField = screen.getByText('Enter the registry url');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');
  const testConnectionButton = screen.getByText('Test connection');
  const submitButton = screen.getByTestId('button-default-submit-registry');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(registryURLField, 'http://fake-host');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar');
  });


  expect(submitButton).not.toBeDisabled();
  await act(async () => userEvent.click(testConnectionButton));
  const successMessage = await screen.findByText('Successful connection with Harbor.');
  expect(successMessage).toBeInTheDocument();
});

test('should test connection with Harbor (error)', async () => {
  const error = {
    status: '404',
    message: 'invalid registry'
  };
  (fetch as FetchMock).mockRejectedValueOnce(new Response(JSON.stringify(error)));
  render(<FormRegistry onFinish={mockOnFinish}/>);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Harbor');
  
  const registryField = await screen.findByText('Type a name for Registry');
  const registryURLField = screen.getByText('Enter the registry url');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');
  const testConnectionButton = screen.getByText('Test connection');
  let submitButton = screen.getByTestId('button-default-submit-registry');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(registryURLField, 'http://fake-host');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar');
  });


  await act(async () => userEvent.click(testConnectionButton));
  const errorMessage = await screen.findByText('invalid registry');
  expect(errorMessage).toBeInTheDocument();
  expect(submitButton).not.toBeDisabled();
});

test('should clean test connection message after change form', async () => {
  (fetch as FetchMock).mockResponse(JSON.stringify({ }));

  render(<FormRegistry onFinish={mockOnFinish}/>);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Harbor');
  
  const registryField = await screen.findByText('Type a name for Registry');
  const registryURLField = screen.getByText('Enter the registry url');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');
  const testConnectionButton = screen.getByText('Test connection');
  let submitButton = screen.getByTestId('button-default-submit-registry');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(registryURLField, 'http://fake-host');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar');
  });


  await act(async () => userEvent.click(testConnectionButton));

  const successMessage = await screen.findByText('Successful connection with Harbor.');

  expect(successMessage).toBeInTheDocument();
  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(registryURLField, 'http://fake-host');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudaragain');
  });
  expect(successMessage).not.toBeInTheDocument();
});

test('should clean test connection message after change form', async () => {
  const error = {
    status: '404',
    message: 'invalid registry'
  };
  (fetch as FetchMock).mockRejectedValueOnce(new Response(JSON.stringify(error)));

  render(<FormRegistry onFinish={mockOnFinish}/>);

  const registryLabel = screen.getByText('Choose which one you want to add:');
  selectEvent.select(registryLabel, 'Harbor');
  
  const registryField = await screen.findByText('Type a name for Registry');
  const registryURLField = screen.getByText('Enter the registry url');
  const usernameField = screen.getByText('Enter the username');
  const passwordField = screen.getByText('Enter the password');
  const testConnectionButton = screen.getByText('Test connection');
  let submitButton = screen.getByTestId('button-default-submit-registry');

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(registryURLField, 'http://fake-host');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudar');
  });


  await act(async () => userEvent.click(testConnectionButton));

  const errorMessage = await screen.findByText('invalid registry');
  expect(errorMessage).toBeInTheDocument();

  await act(async () => {
    userEvent.type(registryField, 'fake-name');
    userEvent.type(registryURLField, 'http://fake-host');
    userEvent.type(usernameField, 'fake username');
    userEvent.type(passwordField, '123mudaragain');
  });
  expect(errorMessage).not.toBeInTheDocument();
});

