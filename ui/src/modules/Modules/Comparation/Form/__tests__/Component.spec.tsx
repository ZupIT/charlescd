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
import { render, act, fireEvent, cleanup, wait } from "@testing-library/react";
import Component from "../Component";
import { Component as ComponentInterface } from "modules/Modules/interfaces/Component";
import { AllTheProviders } from "unit-test/testUtils";
import { Module, Author } from "modules/Modules/interfaces/Module";
import { Actions, Subjects } from "core/utils/abilities";
import MutationObserver from 'mutation-observer'

(global as any).MutationObserver = MutationObserver

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
  name: "pseudonym",
  photoUrl: "url-photo"
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

jest.mock('core/components/Can', () => {
  return {
    __esModule: true,
    default:  ({children}: fakeCanProps) => {
      return <div>{children}</div>;
    }
  };
});


test("Test component for edit mode render", async () => {
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
  await wait()
  expect(container.innerHTML).toMatch("Edit component");
});

test("Test component for create mode render", async () => {
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
  await wait()
  expect(container.innerHTML).toMatch("Create component");
});

test("Test component for show advanced options", async () => {
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
  await wait()
  const componentButton: any = container.querySelector("span");
  expect(container.innerHTML).toMatch("Show");
  fireEvent.click(componentButton);
  wait(() => expect(container.innerHTML).toMatch("Hide"))
});

test("Test component to not render more options", async () => {
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
  await wait()

  const componentHostValue: any = container.querySelector(
    "input[name='hostValue']"
  );

  expect(componentHostValue.value).not.toEqual("")
});

test("Test component to not render more options", async () => {
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
  await wait()

  const componentHostValue: any = container.querySelector(
    "input[name='hostValue']"
  );

  expect(componentHostValue.value).toEqual("")
});


