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
import { validFields } from "../helpers"

const invalidEmptyStringObject: Record<string, any> = {
  key1: "",
};

const invalidNullObject: Record<string, any> = {
  key1: undefined
};

const validObject: Record<string, any> = {
  key1: "fake-value",
};

test("Test empty strings validFields", () => {
  const objectIsValid = validFields(invalidEmptyStringObject)

  expect(objectIsValid).toBeFalsy()
});

test("Test undefined validFields", () => {
  const objectIsValid = validFields(invalidEmptyStringObject)

  expect(objectIsValid).toBeFalsy()
});

test("Test valid string validFields", () => {
  const objectIsValid = validFields(validObject)

  expect(objectIsValid).toBeTruthy()
});