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
import map from 'lodash/map';
import xor from 'lodash/xor';
import filter from 'lodash/filter';
import capitalize from 'lodash/capitalize';
import includes from 'lodash/includes';
import ContentIcon from 'core/components/ContentIcon';
import Form from 'core/components/Form';
import Text from 'core/components/Text';
import { Actions, Subjects, actions, subjects } from 'core/utils/abilities';
import Styled from './styled';
import { CHARLES_DOC } from 'core/components/Popover';
import { actionTemplate, displayAction, getScopes, subjectTemplate } from './helpers';
import { useFormContext } from 'react-hook-form';
import { Mode } from '../../helpers';
import Icon from 'core/components/Icon';
import Link from 'core/components/Link';
import { atLeastOne } from 'core/utils/validations';

interface Props {
  mode: Mode;
}

const Scopes = ({ mode }: Props) => {
  const { register, setValue, getValues, watch, trigger } = useFormContext();

  const onChangeSubject = (subject: Subjects, checked: boolean) => {
    const values = getValues();
    const rules = displayAction(subject)
      ? [`${subject}_write`, `${subject}_read`]
      : [`${subject}_write`];
    const permissions = checked
      ? [...values.permissions, ...rules]
      : xor(values.permissions, rules);

    setValue('permissions', permissions);
    trigger('permissions');
  }

  const onChangeAction = (action: Actions, subject: Subjects, checked: boolean) => {
    const values = getValues();

    if (action === 'write') {
      setValue(`subjects.${subject}`, checked);

      if (checked) {
        setValue('permissions', [...values.permissions, `${subject}_read`]);
      }

    } else if (!checked) {
      const rules = filter(values.permissions, permission => !includes(permission, subject));
      setValue('permissions', rules);
      setValue(`subjects.${subject}`, false);
    }
  }

  const renderActions = (subject: Subjects) => (
    map(actions, (action: Actions) => (
      <Styled.Content left displayAction={displayAction(subject)} key={`${subject}_${action}`}>
        <Form.Checkbox
          label={capitalize(action)}
          {...register('permissions', { validate: atLeastOne })}
          value={`${subject}_${action}`}
          onChange={(checked: boolean) => onChangeAction(action, subject, checked)}
          description={actionTemplate(action, subject)} />
      </Styled.Content>
    ))
  )

  const renderSubjects = () =>
    map(subjects, (subject: Subjects) => (
      <React.Fragment key={subject}>
        <Form.Checkbox
          name={`subjects.${subject}`}
          label={capitalize(subject)}
          value=""
          onChange={(checked: boolean) => onChangeSubject(subject, checked)}
          description={subjectTemplate(subject)} />
        {renderActions(subject)}
      </React.Fragment>
    ));
  
  const renderView = () => {
    const scopes = getScopes(watch('permissions'));

    return (
      <Styled.View>
        <Styled.ViewHead>
          <Text tag="H5" color="dark">Scopes</Text>
          <Text tag="H5" color="dark">Permissions</Text>
        </Styled.ViewHead>
        {map(scopes, ({ subject, permission }, index)=> (
          <Styled.ViewItem key={index} data-testid={subject}>
            <Styled.ViewScope>
              <Icon name="checkmark" size="12px" color="light" />
              <Text tag="H4" color="light">{capitalize(subject)}</Text>
            </Styled.ViewScope>
            <Text tag="H4" color="light">{capitalize(permission)}</Text>
          </Styled.ViewItem>
        ))}
      </Styled.View>
    )
  }

  return (
    <ContentIcon icon="scopes">
      <Text tag="H2" color="light">Scopes</Text>
      <Styled.Content>
        <Styled.Description>
          <Text tag="H5" color="dark" data-testid="scope-doc">
            Scopes define the actions that a given token can perform. Your access token can be
            created with one or more scopes. Read our  
            <Link href={`${CHARLES_DOC}/get-started/integrating-charles-to-your-ci`}>
              documentation
            </Link>{' '}
            for further details.
          </Text>
        </Styled.Description>
        {mode === 'create' ? renderSubjects() : renderView()}
      </Styled.Content>
    </ContentIcon>
  )
}

export default Scopes;
