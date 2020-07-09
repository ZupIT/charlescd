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
import { render, fireEvent, wait } from "unit-test/testUtils";
import ButtonIconRounded from "..";

test("render ButtonIconRounded default component", async () => {
  const click = jest.fn();
  const props = {
    name: "add",
    icon: "add",
    children: "button"
  };
  const { getByTestId } = render(
    <ButtonIconRounded onClick={click} name={props.name} icon={props.name}>
      {props.children}
    </ButtonIconRounded>
  );
  const Button = getByTestId(`button-iconRounded-${props.name}`);
  const IconAdd = getByTestId(`icon-${props.name}`);
  expect(Button && IconAdd).toBeInTheDocument();
  fireEvent.click(Button);
  wait(() => expect(click).toBeCalled());
});

test("render ButtonIconRounded default component without default props", async () => {
  const click = jest.fn();
  const props = {
    name: "add",
    icon: "add",
    children: "button"
  };
  const { getByTestId } = render(
    <ButtonIconRounded
      onClick={click}
      name={props.name}
      icon={props.name}
      size="small"
      backgroundColor="primary"
    >
      {props.children}
    </ButtonIconRounded>
  );
  const Button = getByTestId(`button-iconRounded-${props.name}`);
  const IconAdd = getByTestId(`icon-${props.name}`);
  expect(Button && IconAdd).toBeInTheDocument();
  fireEvent.click(Button);
  wait(() => expect(click).toBeCalled());
});

test("render ButtonIconRounded on loading mode", async () => {
  const click = jest.fn();
  const props = {
    name: "add",
    icon: "add",
    children: "button"
  };
  const { getByTestId } = render(
    <ButtonIconRounded
      onClick={click}
      name={props.name}
      icon={props.name}
      isLoading={true}
    >
      {props.children}
    </ButtonIconRounded>
  );
  const Button = getByTestId(`button-iconRounded-${props.name}`);
  const IconLoading = getByTestId("icon-loading");
  expect(Button && IconLoading).toBeInTheDocument();
});
