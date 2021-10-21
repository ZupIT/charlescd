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

import userEvent from "@testing-library/user-event";
import React from "react";
import { render, screen, waitFor } from "unit-test/testUtils";
import LayerSegments from "../Segments";
import { circle, regularCircle } from "./fixtures";

test("render Layer Segments without release", async () => {
  const setActiveSection = jest.fn();
  const onClickCreate = jest.fn();

  render(
    <LayerSegments
      circle={circle}
      onClickCreate={onClickCreate}
      isEditing={false}
      setActiveSection={setActiveSection}
    />
  );

  const CreateSegments = screen.getByText("Create segments");
  expect(CreateSegments).toBeInTheDocument();
});

test("render Layer Segments with release", async () => {
  const setActiveSection = jest.fn();
  const onClickCreate = jest.fn();

  render(
    <LayerSegments
      circle={circle}
      onClickCreate={onClickCreate}
      isEditing={true}
      setActiveSection={setActiveSection}
    />
  );

  const EditSegments = screen.getByText("Edit segments");
  expect(EditSegments).toBeInTheDocument();

  const EditSegmentsButton = screen.getByTestId('button-iconRounded-add')
  userEvent.click(EditSegmentsButton)

  await waitFor(() => {
    expect(setActiveSection).toBeCalled()
  })
});

test("render Layer Segments with regular circle", async () => {
  const setActiveSection = jest.fn();
  const onClickCreate = jest.fn();

  render(
    <LayerSegments
      circle={regularCircle}
      onClickCreate={onClickCreate}
      isEditing={true}
      setActiveSection={setActiveSection}
    />
  );

  const RulesSegments = screen.getByTestId("segments-rules");
  expect(RulesSegments).toBeInTheDocument();
});

