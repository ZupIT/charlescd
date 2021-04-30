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
import { isRequiredAndNotBlank } from 'core/utils/validations';
import Form from 'core/components/Form';
import Icon from 'core/components/Icon';
import Styled from './styled';

interface Props {
  remove: (index?: number | number[] | undefined) => void;
  field: { key: string, value: string };
  index: number;
}

const Fields = ({ remove, field, index }: Props) => {
  const { register, errors } = useFormContext();

  console.log('errors', errors);

  return (
    <Styled.Field
      key={`field-${index}`}
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
        label="Key"
        ref={register(isRequiredAndNotBlank)}
        defaultValue={field.key}
      />
      <Form.Input
        name={`metadata.content[${index}].value`}
        label="Value"
        ref={register(isRequiredAndNotBlank)}
        defaultValue={field.value}
      />
    </Styled.Field>
  );
}

export default Fields;
