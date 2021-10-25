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

import { useFormContext } from 'react-hook-form';
import Form from 'core/components/Form';
import Icon from 'core/components/Icon';
import Styled from './styled';
import { isEmpty } from 'lodash';

interface Props {
  remove: (index?: number | number[] | undefined) => void;
  field: { key: string; value: string };
  index: number;
}

const Fields = ({ remove, field, index }: Props) => {
  const { register, errors } = useFormContext();

  return (
    <Styled.Field
      key={`field-${index}`}
      hasErrors={!isEmpty(errors?.metadata?.content[index])}
      data-testid={`metadata.content[${index}]`}
    >
      <Icon
        name="trash"
        size="15px"
        color="light"
        onClick={() => remove(index)}
      />
      <Form.Input
        name={`metadata.content[${index}].key`}
        error={errors?.metadata?.content[index]?.key?.message}
        label="Key"
        ref={register()}
        defaultValue={field.key}
      />
      <Form.Input
        name={`metadata.content[${index}].value`}
        error={errors?.metadata?.content[index]?.value?.message}
        label="Value"
        ref={register()}
        defaultValue={field.value}
      />
    </Styled.Field>
  );
};

export default Fields;
