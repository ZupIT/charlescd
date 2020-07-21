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