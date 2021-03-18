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

import React, { ReactElement } from "react";
import { act, render, waitFor, screen } from "@testing-library/react";
import Component from "../Component";
import { Component as ComponentInterface } from "modules/Modules/interfaces/Component";
import { AllTheProviders } from "unit-test/testUtils";
import { Module, Author } from "modules/Modules/interfaces/Module";
import { Actions, Subjects } from "core/utils/abilities";
import userEvent from "@testing-library/user-event";
interface fakeCanProps {
  I?: Actions;
  a?: Subjects;
  passThrough?: boolean;
  isDisabled?: boolean;
  allowedRoutes?: boolean;
  children: ReactElement;
}

const fakeAuthor: Author = {
  createdAt: "fake-data",
  email: "pseudonym@gmail.com",
  id: "1",
  name: "pseudonym"
}
const fakeComponent: ComponentInterface = {
  id: "fake-id",
  name: "fake-name",
  latencyThreshold: "30",
  errorThreshold: "30",
  hostValue: "fakeHost",
  gatewayName: "fakeGateway"
};

const fakeComponentWithoutMoreOptions: ComponentInterface = {
  id: "fake-id",
  name: "fake-name",
  latencyThreshold: "30",
  errorThreshold: "30",
};


const fakeModule: Module = {
  gitRepositoryAddress: "fake-github",
  helmRepository: "fake-api",
  id: "1",
  name: "fake-module",
  author: fakeAuthor,
  components: [fakeComponent]
}

const mockOnClose = jest.fn()
const mockOnUpdate = jest.fn()

jest.mock('containers/Can', () => {
  return {
    __esModule: true,
    default:  ({children}: fakeCanProps) => {
      return <div>{children}</div>;
    }
  };
});


test("component for edit mode render", async () => {
  const { container } = render(
    <AllTheProviders>
      <Component
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        component={fakeComponent}
        module={fakeModule}
        key={"fake-key"}
      />
    </AllTheProviders>
  );
  
  await waitFor(() => expect(container.innerHTML).toMatch("Edit component"));
});

test("component for create mode render", async () => {
  const { container } = render(
    <AllTheProviders>
      <Component
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        component={{}}
        module={fakeModule}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  await waitFor(() => expect(container.innerHTML).toMatch("Create component"));
});

test("component for show advanced options", async () => {
  const { container } = render(
    <AllTheProviders>
      <Component
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        component={fakeComponent}
        module={fakeModule}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  const componentButton: any = container.querySelector("span");
  const advancedOptions = screen.getByTestId('button-default-save-edit-module');
  expect(container.innerHTML).toMatch("Show");
  act(() => userEvent.click(componentButton));

  expect(advancedOptions).toBeInTheDocument();
});

test("component to not render more options", async () => {
  const { container } = render(
    <AllTheProviders>
      <Component
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        component={fakeComponent}
        module={fakeModule}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  const advancedOptions = screen.getByTestId('subtitle-advanced-options');
  userEvent.click(advancedOptions);

  const componentHostValue: any = container.querySelector(
    "input[name='hostValue']"
  );

  await waitFor(() => expect(componentHostValue.value).not.toEqual(""));
});

test("component to not render more option", async () => {
  const { container } = render(
    <AllTheProviders>
      <Component
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
        component={fakeComponentWithoutMoreOptions}
        module={fakeModule}
        key={"fake-key"}
      />
    </AllTheProviders>
  );

  const advancedOptions = screen.getByTestId('subtitle-advanced-options');
  userEvent.click(advancedOptions);

  const componentHostValue: any = container.querySelector(
    "input[name='hostValue']"
  );

  await waitFor(() => expect(componentHostValue?.value).toEqual(""));
});
