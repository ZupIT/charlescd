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
import { ArrayField } from 'react-hook-form';
import Icon from 'core/components/Icon';
import { Component } from 'modules/Circles/interfaces/Circle';
import { component } from './constants';
import Styled from './styled';
import ComponentForm from './ComponentForm';

interface Props {
  fieldArray: {
    append: (value: Partial<ArrayField> | Partial<ArrayField>[]) => void;
    remove: (index?: number | number[] | undefined) => void;
    fields: Partial<ArrayField>;
  };
}

const Components = ({ fieldArray }: Props) => {
  const { fields, append, remove } = fieldArray;

  return (
    <>
      <Styled.Subtitle color="dark">
        Add components and enter SLO metrics:
      </Styled.Subtitle>
      {fields.map((field: Component, index: number) => (
        <ComponentForm
          key={index}
          field={field}
          fields={fields}
          remove={remove}
          index={index}
        />
      ))}
      <Styled.Components.Button
        size="EXTRA_SMALL"
        id="add-component"
        onClick={() => append(component)}
      >
        <Icon name="add" size="15px" />
        Add component
      </Styled.Components.Button>
    </>
  );
};

export default Components;
