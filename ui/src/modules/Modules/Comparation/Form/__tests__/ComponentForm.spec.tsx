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
import { render, act, fireEvent, cleanup, wait } from "@testing-library/react";
import ComponentForm from "../ComponentForm";
import { Component } from "modules/Modules/interfaces/Component";
import { ThemeProviderWrapper } from "unit-test/testUtils";

const fakeComponent: Component = {
  id: "fake-id",
  name: "fake-name",
  latencyThreshold: "30",
  errorThreshold: "30",
  hostValue: "fakeHost",
  gatewayName: "fakeGateway"
};

const mockRemove = jest.fn();

jest.mock("react-hook-form", () => {
  return {
    __esModule: true,
    useFormContext: () => ({
      register: () => {},
      unregister: () => {}
    })
  };
});

test("Test componentForm for one component render", () => {
  const { container } = render(
    <ThemeProviderWrapper>
      <ComponentForm
        remove={mockRemove}
        field={fakeComponent}
        fields={[fakeComponent]}
        index={0}
        key={"fake-key"}
      />
    </ThemeProviderWrapper>
  );

  expect(container.innerHTML).toMatch("input-wrapper-components[0].name");
});

test("Test componentForm for two or more components render and trash", async () => {
  const { container, getByTestId } = render(
    <ThemeProviderWrapper>
      <ComponentForm
        remove={mockRemove}
        field={fakeComponent}
        fields={[fakeComponent, fakeComponent]}
        index={0}
        key={"fake-key"}
      />
    </ThemeProviderWrapper>
  );
  await wait()
  expect(container.innerHTML).toMatch("input-wrapper-components[0].name");
  expect(container.innerHTML).toMatch("icon-trash");
  const trashComponent: any = getByTestId("icon-trash")

  fireEvent.click(trashComponent)
  wait(() => {
    expect(mockRemove).toBeCalledTimes(1)
  })

});

test("Test componentForm for more Options render", () => {
  const { container } = render(
    <ThemeProviderWrapper>
      <ComponentForm
        remove={mockRemove}
        field={fakeComponent}
        fields={[fakeComponent]}
        index={0}
        key={"fake-key"}
      />
    </ThemeProviderWrapper>
  );

  const componentButton: any = container.querySelector("span");
  expect(container.innerHTML).toMatch("Show");
  fireEvent.click(componentButton);
  wait(() => expect(container.innerHTML).toMatch("Hide"));
});

it("renders inputs with values", async () => {
  const { container } = render(
    <ThemeProviderWrapper>
      <ComponentForm
        remove={mockRemove}
        field={fakeComponent}
        fields={[fakeComponent, fakeComponent]}
        index={0}
        key={"fake-key"}
      />
    </ThemeProviderWrapper>
  );
  const componentName: any = container.querySelector(
    "input[name='components[0].name']"
  );

  const componentLatencyThreshold: any = container.querySelector(
    "input[name='components[0].latencyThreshold']"
  );

  const componentErrorThreshold: any = container.querySelector(
    "input[name='components[0].errorThreshold']"
  );

  fireEvent.input(componentLatencyThreshold, {
    target: {
      value: "35"
    }
  });

  fireEvent.input(componentErrorThreshold, {
    target: {
      value: "35"
    }
  });

  fireEvent.input(componentName, {
    target: {
      value: "component-fake"
    }
  });

  wait(() => {
    expect(componentName.value).toEqual("component-fake");
    expect(componentErrorThreshold.value).toEqual("35");
    expect(componentLatencyThreshold.value).toEqual("35");
  });
});
