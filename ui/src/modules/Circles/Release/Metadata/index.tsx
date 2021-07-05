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

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import { ArrayField } from 'react-hook-form';
import Fields from './Fields';
import Styled from './styled';

interface Props {
  fieldArray: {
    append: (value: Partial<ArrayField> | Partial<ArrayField>[]) => void;
    remove: (index?: number | number[] | undefined) => void;
    fields: Partial<ArrayField>;
  };
}

const Metadata = ({ fieldArray }: Props) => {
  const { fields, append, remove } = fieldArray;

  return (
    <Styled.Metadata>
      <Styled.Subtitle color="dark">
        You can add metadata for this release:
      </Styled.Subtitle>
      {fields.map((field: any, index: number) => (
        <Fields
          key={`meta-form-${index}`}
          field={field}
          remove={remove}
          index={index}
        />
      ))}
      <Button.Default
        size="EXTRA_SMALL"
        id="add-component"
        onClick={() => append({ content: { '': '' } })}
      >
        <Icon name="add" size="15px" /> Add metadata
      </Button.Default>
    </Styled.Metadata>
  );
}

export default Metadata;
