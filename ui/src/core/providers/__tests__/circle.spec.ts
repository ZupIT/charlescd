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

import { FetchMock } from 'jest-fetch-mock';
import { CreateCircleManuallyPayload, CreateCircleWithFilePayload } from 'modules/Circles/interfaces/Circle';
import {
  circleMatcherIdentify,
  createCircleManually,
  createCircleWithFile,
  findAllCircles,
  findAllCirclesWithoutActive,
  findCircleById,
  updateCircleManually,
  updateCircleWithFile
} from '../circle';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('login provider request', async () => {
  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ name: 'find all circles' })
  );

  const response = await findAllCircles()({});
  const data = await response.json();

  expect(data).toEqual({ name: 'find all circles' });
});

test('renew token provider request', async () => {
  const id = 'circle-id';

  (fetch as FetchMock).mockResponseOnce(
    JSON.stringify({ name: 'find circle by id' })
  );

  const response = await findCircleById({ id })({});
  const data = await response.json();

  expect(data).toEqual({ name: 'find circle by id' });
});

test('should deleteCircle by id', async () => {
  
});

test('should identify by circle matcher', async () => {
  const id = 'circle-id';
  const responseData = { id: '123', name: 'find circle by id' };
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(responseData));

  const response = await circleMatcherIdentify({ id })({});
  const data = await response.json();

  expect(data).toEqual(responseData);
});

test('should create circle manually', async () => {
  const requestData = { name: 'circle' } as CreateCircleManuallyPayload;
  const responseData = { id: '123'  };
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(responseData));

  const response = await createCircleManually(requestData)({});
  const data = await response.json();

  expect(data).toEqual(responseData);
});

test('should update circle manually', async () => {
  const requestData = { name: 'circle' } as CreateCircleManuallyPayload;
  const responseData = { id: '123'  };
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(responseData));

  const response = await updateCircleManually(requestData, '123')({});
  const data = await response.json();

  expect(data).toEqual(responseData);
});

test('should create circle with file', async () => {
  const requestData = { name: 'circle' } as CreateCircleWithFilePayload;
  const responseData = { id: '123'  };
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(responseData));

  const response = await createCircleWithFile(requestData)({});
  const data = await response.json();

  expect(data).toEqual(responseData);
});

test('should update circle with file', async () => {
  const requestData = { name: 'circle' } as CreateCircleWithFilePayload;
  const responseData = { id: '123'  };
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(responseData));

  const response = await updateCircleWithFile(requestData, '123')({});
  const data = await response.json();

  expect(data).toEqual(responseData);
});

test('should find all circles without active', async () => {
  const responseData = [{ id: '123'  }];
  const filter = { name: 'circle'};
  (fetch as FetchMock).mockResponseOnce(JSON.stringify(responseData));

  const response = await findAllCirclesWithoutActive(filter)({});
  const data = await response.json();

  expect(data).toEqual(responseData);
});