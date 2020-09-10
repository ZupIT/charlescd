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
import { Control, Controller } from 'react-hook-form';
import AceEditor, { Props as AceEditorProps } from 'core/components/AceEditor';

type Props = {
  name: string;
  control: Control<unknown>;
  className?: string;
  mode?: string;
  defaultValue?: string;
  rules?: Partial<{ required: boolean | string }>;
} & AceEditorProps;

const AceEditorForm = ({
  name,
  control,
  className,
  mode,
  defaultValue,
  value,
  onChange,
  height,
  rules
}: Props) => (
  <Controller
    as={
      <AceEditor
        mode={mode}
        onChange={onChange}
        value={value}
        readOnly={false}
        height={height}
      />
    }
    rules={rules}
    name={name}
    control={control}
    className={className}
    defaultValue={defaultValue}
  />
);

export default AceEditorForm;
