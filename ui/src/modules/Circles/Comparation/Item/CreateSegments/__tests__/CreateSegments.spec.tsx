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

<<<<<<< HEAD
import React from "react";
import MutationObserver from "mutation-observer";
import { render, screen, act, waitFor } from "unit-test/testUtils";
import { FetchMock } from "jest-fetch-mock/types";
import { Circle } from "modules/Circles/interfaces/Circle";
import CreateSegments from "..";
import userEvent from "@testing-library/user-event";
import {
  circle,
  mockPercentageCircles,
  circlePercentage,
  circleManually,
  circleCSV
} from "./fixtures";
import { NEW_TAB } from "core/components/TabPanel/constants";
=======
import React from 'react';
import MutationObserver from 'mutation-observer'
import { render, screen, wait, waitFor } from 'unit-test/testUtils';
import { FetchMock } from 'jest-fetch-mock/types';
import { Circle } from 'modules/Circles/interfaces/Circle';
import { ThemeScheme } from 'core/assets/themes';
import { getTheme } from 'core/utils/themes';
import CreateSegments from '..';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

const theme = getTheme() as ThemeScheme;
>>>>>>> f5817ee5abaccc17d33e77494c6c0a9f8a65cf62

(global as any).MutationObserver = MutationObserver;

const simpleCircle = {
  deployment: {
    status: "DEPLOYED"
  }
};

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test("render CreateSegments default component", async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();
  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id="123"
      circle={simpleCircle as Circle}
    />
  );
  const DefaultText = await screen.findByText("Create manually");

  expect(DefaultText).toBeInTheDocument();
});

test("render CreateSegments with percentage session active", async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();

  (fetch as FetchMock).mockResponseOnce(JSON.stringify(mockPercentageCircles));

  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id={NEW_TAB}
      circle={circle as Circle}
    />
  );

<<<<<<< HEAD
  const PercentageButton = await screen.findByTestId(
    "button-iconRounded-percentage"
  );

  act(() => {
    userEvent.click(PercentageButton);
  });
  await waitFor(() => {
    const PercentageText = screen.getByText(
      "Quantity available for consumption."
    );

    expect(PercentageText).toBeInTheDocument();
  });
});

test("render CreateSegments with manual session active", async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();

  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id={NEW_TAB}
      circle={simpleCircle as Circle}
    />
  );

  const ManuallyButton = await screen.findByTestId(
    "button-iconRounded-manually"
  );

  act(() => {
    userEvent.click(ManuallyButton);
  });
  await waitFor(() => {
    const ManuallyText = screen.getByTestId("segments-rules");

    expect(ManuallyText).toBeInTheDocument();
  });
});

test("render CreateSegments with manual session active", async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();

  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id={NEW_TAB}
      circle={simpleCircle as Circle}
    />
  );

  const ImportCsvButton = await screen.findByTestId(
    "button-iconRounded-upload"
  );

  act(() => {
    userEvent.click(ImportCsvButton);
  });
  await waitFor(() => {
    const ImportCsvText = screen.getByTestId("input-file-inputFileId-file");

    expect(ImportCsvText).toBeInTheDocument();
  });
});

//warning and onContinue section

test("modal change percentage to manually should be rendered", async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();

  (fetch as FetchMock).mockResponseOnce(JSON.stringify(mockPercentageCircles));

  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id={circlePercentage.id}
      circle={circlePercentage as Circle}
    />
  );

  const ManuallyButton = await screen.findByTestId(
    "button-iconRounded-manually"
  );

  userEvent.click(ManuallyButton);

  const ModalText = await screen.findByText(
    "Your current percentage circle will be converted to segmentation circle."
  );

  expect(ModalText).toBeInTheDocument();

  const ContinueButton = screen.getByTestId("button-default-continue");

  userEvent.click(ContinueButton);

  const ManuallyText = await screen.findByTestId("segments-rules");

  expect(ManuallyText).toBeInTheDocument();
});

test("modal change percentage to Import CSV should be rendered", async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();

  (fetch as FetchMock).mockResponseOnce(JSON.stringify(mockPercentageCircles));

=======
  const ButtonGoBack = await screen.findByTestId('icon-arrow-left');
  expect(ButtonGoBack).toBeInTheDocument();

  const ButtonCreateManually = screen.getByTestId('button-iconRounded-edit');
  expect(ButtonCreateManually).toBeInTheDocument();

  const ButtonImportCSV = screen.getByTestId('button-iconRounded-upload');
  expect(ButtonImportCSV).toBeInTheDocument();
});

test('render CreateSegments and try Create manually', async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();
>>>>>>> f5817ee5abaccc17d33e77494c6c0a9f8a65cf62
  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
<<<<<<< HEAD
      id={circlePercentage.id}
      circle={circlePercentage as Circle}
    />
  );

  const UploadButton = await screen.findByTestId("button-iconRounded-upload");

  act(() => {
    userEvent.click(UploadButton);
  });

  const ModalText = await screen.findByText(
    "Your current percentage circle will be converted to segmentation circle."
  );

  expect(ModalText).toBeInTheDocument();

  const ContinueButton = screen.getByTestId("button-default-continue");

  userEvent.click(ContinueButton);

  const ImportCsvText = await screen.findByTestId(
    "input-file-inputFileId-file"
  );

  expect(ImportCsvText).toBeInTheDocument();
});

test("modal change manual to percentage should be rendered", async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();

  (fetch as FetchMock).mockResponseOnce(JSON.stringify(mockPercentageCircles));

=======
      id="123"
      circle={circle as Circle}
    />
  );

  const ButtonCreateManually = screen.getByTestId('button-iconRounded-edit');
  expect(ButtonCreateManually).toBeInTheDocument();

  const ButtonImportCSV = screen.getByTestId('button-iconRounded-upload');
  expect(ButtonImportCSV).toBeInTheDocument();
  
  act(() => userEvent.click(ButtonCreateManually));

  expect(ButtonCreateManually).toHaveStyle(`background-color: ${theme.radio.button.checked.background}`);
  expect(ButtonImportCSV).not.toHaveStyle(`background-color: ${theme.radio.button.checked.background}`);
});

test('render CreateSegments and try Import CSV', async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();
>>>>>>> f5817ee5abaccc17d33e77494c6c0a9f8a65cf62
  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
<<<<<<< HEAD
      id={circleManually.id}
      circle={circleManually as Circle}
    />
  );

  const PercentageButton = await screen.findByTestId(
    "button-iconRounded-percentage"
  );

  userEvent.click(PercentageButton);

  const ModalText = screen.getByText(
    "Your current segmentation will be deleted and replaced with percentage rules."
  );

  expect(ModalText).toBeInTheDocument();

  const ContinueButton = screen.getByTestId("button-default-continue");

  userEvent.click(ContinueButton);

  const PercentageText = await screen.findByText(
    "Quantity available for consumption."
  );

  expect(PercentageText).toBeInTheDocument();
});

test("modal change manual to import csv should be rendered", async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();

  (fetch as FetchMock).mockResponseOnce(JSON.stringify(mockPercentageCircles));

  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id={circleManually.id}
      circle={circleManually as Circle}
    />
  );

  const UploadButton = await screen.findByTestId("button-iconRounded-upload");

  userEvent.click(UploadButton);

  const ModalText = screen.getByText(
    "Your current segmentation was created using manual rules, this rules will be replaced by the CSV content."
  );

  expect(ModalText).toBeInTheDocument();

  const ContinueButton = screen.getByTestId("button-default-continue");

  userEvent.click(ContinueButton);

  const ImportCsvText = await screen.findByTestId(
    "input-file-inputFileId-file"
  );

  expect(ImportCsvText).toBeInTheDocument();
});

test("modal change import csv to manually should be rendered", async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();

  (fetch as FetchMock).mockResponseOnce(JSON.stringify(mockPercentageCircles));

  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id={circleCSV.id}
      circle={circleCSV as Circle}
    />
  );

  const ManuallyButton = await screen.findByTestId(
    "button-iconRounded-manually"
  );

  userEvent.click(ManuallyButton);

  const ModalText = screen.getByText(
    "Your current base was imported using a .CSV file, manually creating your entire circle segmentation will be deleted and replaced."
  );

  expect(ModalText).toBeInTheDocument();

  const ContinueButton = screen.getByTestId("button-default-continue");

  userEvent.click(ContinueButton);

  const ManuallyText = await screen.findByTestId("segments-rules");

  expect(ManuallyText).toBeInTheDocument();
});

test("modal change import csv to percentage should be rendered", async () => {
  const onGoBack = jest.fn();
  const onSaveCircle = jest.fn();

  (fetch as FetchMock).mockResponseOnce(JSON.stringify(mockPercentageCircles));

  render(
    <CreateSegments
      onGoBack={onGoBack}
      onSaveCircle={onSaveCircle}
      id={circleCSV.id}
      circle={circleCSV as Circle}
    />
  );

  const PercentageButton = await screen.findByTestId(
    "button-iconRounded-percentage"
  );

  userEvent.click(PercentageButton);

  const ModalText = screen.getByText(
    "Your current segmentation will be deleted and replaced with percentage rules."
  );

  expect(ModalText).toBeInTheDocument();

  const ContinueButton = screen.getByTestId("button-default-continue");

  userEvent.click(ContinueButton);

  const PercentageText = await screen.findByText(
    "Quantity available for consumption."
  );

  expect(PercentageText).toBeInTheDocument();
=======
      id="123"
      circle={circle as Circle}
    />
  );

  const ButtonImportCSV = screen.getByTestId('button-iconRounded-upload');
  expect(ButtonImportCSV).toBeInTheDocument();

  const ButtonCreateManually = screen.getByTestId('button-iconRounded-edit');
  expect(ButtonCreateManually).toBeInTheDocument();

  act(() => userEvent.click(ButtonImportCSV));

  waitFor(() => expect(ButtonImportCSV).toHaveStyle(`background-color: ${theme.radio.button.checked.background}`));
  expect(ButtonCreateManually).not.toHaveStyle(`background-color: ${theme.radio.button.checked.background}`);
>>>>>>> f5817ee5abaccc17d33e77494c6c0a9f8a65cf62
});
