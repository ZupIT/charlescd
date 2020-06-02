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
import { ArrayField, FieldElement, ValidationOptions } from 'react-hook-form';
import Icon from 'core/components/Icon';
import { Component } from 'modules/Circles/interfaces/Circle';
import { component } from './constants';
import Styled from './styled';

interface Props {
  fieldArray: {
    prepend: (value: Partial<ArrayField> | Partial<ArrayField>[]) => void;
    append: (value: Partial<ArrayField> | Partial<ArrayField>[]) => void;
    remove: (index?: number | number[] | undefined) => void;
    fields: Partial<ArrayField>;
  };
  register: <Element extends FieldElement = FieldElement>(
    validationOptions: ValidationOptions
  ) => (ref: Element | null) => void;
}

const Components = ({ fieldArray, register }: Props) => {
  const { fields, append, remove } = fieldArray;
  const one = 1;

  return (
    <>
      <Styled.Subtitle color="dark">
        Add components and enter SLO metrics:
      </Styled.Subtitle>
      {fields.map((field: Component, index: number) => (
        <Styled.Components.Wrapper key={field.id}>
          {fields.length > one && (
            <Styled.Components.Trash
              name="trash"
              size="15px"
              color="light"
              onClick={() => remove(index)}
            />
          )}
          <Styled.Components.Input
            label="Enter name"
            name={`components[${index}].name`}
            ref={register({ required: true })}
          />
          <Styled.Components.Number
            name={`components[${index}].latencyThreshold`}
            label="Latency Threshold (ms)"
            ref={register({ required: true })}
          />
          <Styled.Components.Number
            name={`components[${index}].errorThreshold`}
            label="Http Error Threshold (%)"
            ref={register({ required: true })}
          />
        </Styled.Components.Wrapper>
      ))}
      <Styled.Components.Button
        size="EXTRA_SMALL"
        onClick={() => append(component)}
      >
        <Icon name="add" size="15px" />
        Add component
      </Styled.Components.Button>
    </>
  );
};

export default Components;
