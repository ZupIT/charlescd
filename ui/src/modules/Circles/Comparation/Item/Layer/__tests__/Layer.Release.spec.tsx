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

import React from "react";
import { render, screen } from "unit-test/testUtils";
import LayerRelease from "../Release";
import { circle, circleWithoutDeployment } from "./fixtures";

test("render Layer Release without release", async () => {
  const onClickCreate = jest.fn();

  render(
    <LayerRelease
      circle={circleWithoutDeployment}
      onClickCreate={onClickCreate}
      releaseEnabled={true}
    />
  );

  const InsertRelease = screen.getByTestId("button-iconRounded-add");
  expect(InsertRelease).toBeInTheDocument();
});

test("render Layer Release with release", async () => {
  const onClickCreate = jest.fn();

  render(
    <LayerRelease
      circle={circle}
      onClickCreate={onClickCreate}
      releaseEnabled={true}
    />
  );

  const DeployedBadge = screen.getByTestId("badge-Deployed");
  expect(DeployedBadge).toBeInTheDocument();
});

test("render Layer Release with warning if releaseEnabled is false", async () => {
    const onClickCreate = jest.fn();
  
    render(
      <LayerRelease
        circle={circleWithoutDeployment}
        onClickCreate={onClickCreate}
        releaseEnabled={false}
      />
    );
  
    const WarningIcon = screen.getByTestId("icon-alert");
    expect(WarningIcon).toBeInTheDocument();
  });
