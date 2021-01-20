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

import { renderHook, act } from '@testing-library/react-hooks';
import * as ActionNotification from 'core/components/Notification/state/actions';
import { waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock';
import { useWebhook } from '../hooks';
import { Webhook } from '../interfaces';
 
beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

jest.mock('core/state/hooks', () => ({
  useDispatch: () => jest.fn()
}));

jest.mock('core/components/Notification/state/actions', () => ({
  toogleNotification: () => jest.fn()
}));

test('to save new webhook', async () => {
  const webhook: Webhook = {
    apiKey: '123',
    description: 'webhook',
    url: 'https://charlescd.io',
    events: ['DEPLOY', 'UNDEPLOY']
  };

  (fetch as FetchMock).mockResponse(JSON.stringify({}));

  const { result } = renderHook(() => useWebhook());

  expect(result.current.status).toBe('idle')

  await act(async () => {
    await result.current.save(webhook);
  });

  await waitFor(() => expect(result.current.status).toBe('resolved'));
});

test('to edit webhook', async () => {
  const webhook: Partial<Webhook> = {
    events: ['DEPLOY', 'UNDEPLOY']
  };

  (fetch as FetchMock).mockResponse(JSON.stringify({}));

  const { result } = renderHook(() => useWebhook());

  expect(result.current.status).toBe('idle')

  await act(async () => {
    await result.current.edit(webhook);
  });

  await waitFor(() => expect(result.current.status).toBe('resolved'));
});

test('to get an webhook', async () => {
  const id = '123';

  (fetch as FetchMock).mockResponse(JSON.stringify({}));

  const { result } = renderHook(() => useWebhook());

  expect(result.current.status).toBe('idle')

  await act(async () => {
    await result.current.list(id);
  });

  await waitFor(() => expect(result.current.status).toBe('resolved'));
});

test('to remove an webhook', async () => {
  const id = '123';

  (fetch as FetchMock).mockResponse(JSON.stringify({}));

  const { result } = renderHook(() => useWebhook());

  expect(result.current.status).toBe('idle')

  await act(async () => {
    await result.current.remove(id);
  });

  await waitFor(() => expect(result.current.status).toBe('resolved'));
});
