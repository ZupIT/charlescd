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

import { act, render, screen } from 'unit-test/testUtils';
import Workspaces from '../';
import { FormProvider, useForm } from 'react-hook-form';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';

test('should open view workspaces modal for specific workspaces', () => {
  const { result } = renderHook(() => useForm());
  const methods = result.current;

  const tokenWorkspaces = ['workspace 1', 'workspace 2'];
  render(
    <FormProvider {...methods}>
      <Workspaces 
        mode='view' 
        tokenWorkspaces={tokenWorkspaces} 
        allWorkspaces={false} 
      />
    </FormProvider>
  );

  expect(screen.getByRole('button')).toHaveTextContent('View workspaces');

  act(() => userEvent.click(screen.getByTestId('button-iconRounded-view')));

  expect(screen.getByTestId('modal-default')).toBeInTheDocument();
});

test('should open view workspaces modal for all workspaces', () => {
  const { result } = renderHook(() => useForm());
  const methods = result.current;

  const tokenWorkspaces: string[] = [];
  render(
    <FormProvider {...methods}>
      <Workspaces 
        mode='view' 
        tokenWorkspaces={tokenWorkspaces} 
        allWorkspaces={true} 
      />
    </FormProvider>
  );

  expect(screen.getByRole('button')).toHaveTextContent('View workspaces');

  act(() => userEvent.click(screen.getByTestId('button-iconRounded-view')));

  expect(screen.getByTestId('modal-default')).toBeInTheDocument();
});

