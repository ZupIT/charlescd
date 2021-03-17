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
import { render, screen, waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock/types';
import { Circle } from 'modules/Circles/interfaces/Circle';
import Percentage from '../Percentage';
import { circle, mockEmptyPercentageCircles, mockFullPercentageCircles, mockPercentageCircles } from './fixtures';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test('render Percentage default component', async () => {
  const onSaveCircle = jest.fn();
 
  render(
    <Percentage
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
      isEditing={false}
    />
  );

  expect(screen.getByText('Quantity available for consumption.')).toBeInTheDocument();
});

test('render Percentage with list', async () => {
  const onSaveCircle = jest.fn();

  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify(mockPercentageCircles))
 
  render(
    <Percentage
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
      isEditing={false}
    />
  );

  const listContainerButton = await screen.findByTestId("circle-list-container-button")

  userEvent.click(listContainerButton)


  await waitFor(() => {
    expect(screen.getByText('Quantity available for consumption.')).toBeInTheDocument();
    expect(screen.getByTestId('circle-percentage-list-item-fake-id')).toBeInTheDocument();
  })
});

test('Set limit should return Sum percentage correctly', async () => {
  const onSaveCircle = jest.fn();

  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify(mockPercentageCircles))
 
  render(
    <Percentage
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
      isEditing={false}
    />
  );

  const percentage = await screen.findByTestId('available-percentage-open-sea-value')

  expect(percentage.textContent).toBe("90%");
});

test('Set limit should return Sum percentage correctly if available percentage is 100', async () => {
  const onSaveCircle = jest.fn();

  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify(mockEmptyPercentageCircles))
 
  render(
    <Percentage
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
      isEditing={false}
    />
  );

  const percentage = await screen.findByTestId('available-percentage-open-sea-value')

  expect(percentage.textContent).toBe("100%");
});

test('Set limit should return Sum percentage correctly if deployment already exists and it will be changed', async () => {
  const onSaveCircle = jest.fn();

  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify(mockPercentageCircles))
 
  render(
    <Percentage
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
      isEditing={true}
    />
  );

  const percentage = await screen.findByTestId('slider-limit-value')
  expect(percentage.textContent).toBe("100%");
});

test('If limitPercentage is full slider should not be render', async () => {
  const onSaveCircle = jest.fn();

  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify(mockFullPercentageCircles))
 
  render(
    <Percentage
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
      isEditing={false}
    />
  );
  const SliderInput = await screen.findByTestId("input-number-slider")
    

  await waitFor(() => {
    expect(SliderInput).not.toBeInTheDocument()
  })
});


test('onSaveCircle Should be called', async () => {
  const onSaveCircle = jest.fn();

  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify(mockPercentageCircles))
    .mockResponseOnce(JSON.stringify(circle))
 
  render(
    <Percentage
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
      isEditing={false}
    />
  );
  const SliderInput = await screen.findByTestId("input-number-slider")

  userEvent.type(SliderInput, "35")

  const submitButton = await screen.findByTestId("button-default-percentage")

  userEvent.click(submitButton)
    

  await waitFor(() => {
    expect(onSaveCircle).toBeCalled()
  })
});


test('onSaveCircle Should not be called', async () => {
  const onSaveCircle = jest.fn();

  (fetch as FetchMock)
    .mockResponseOnce(JSON.stringify(mockPercentageCircles))
    .mockResponseOnce(JSON.stringify(circle))
 
  render(
    <Percentage
      onSaveCircle={onSaveCircle}
      id="123"
      circle={circle as Circle}
      isEditing={false}
    />
  );
  const SliderInput = await screen.findByTestId("input-number-slider")

  userEvent.type(SliderInput, "95")

  const submitButton = await screen.findByTestId("button-default-percentage")

  userEvent.click(submitButton)
    

  await waitFor(() => {
    expect(onSaveCircle).not.toBeCalled()
  })
});


