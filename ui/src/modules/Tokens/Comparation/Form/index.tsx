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

import { Fragment, useState, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Token, TokenCreate } from 'modules/Tokens/interfaces';
import { useSave } from 'modules/Tokens/hooks';
import ContentIcon from 'core/components/ContentIcon';
import map from 'lodash/map';
import Form from 'core/components/Form';
import { isRequiredAndNotBlank } from 'core/utils/validations';
import { Mode } from '../helpers';
import Workspaces from './Workspaces';
import Scopes from './Scopes';
import ModalCopy from './Modal';
import Styled from './styled';
import { isEmpty } from 'lodash';
import { updateParam } from 'core/utils/path';
import routes from 'core/constants/routes';
import { useHistory } from 'react-router';
import { NEW_TAB } from 'core/components/TabPanel/constants';

interface Props {
  mode?: Mode;
  data?: Token;
}

const FormToken = ({ mode, data }: Props) => {
  const { save, response, status } = useSave();
  const [isModalCopy, setIsModalCopy] = useState<boolean>();
  const methods = useForm<TokenCreate>({ mode: 'onChange', defaultValues: data });
  const history = useHistory();
  const {
    register, handleSubmit, watch,
    errors, formState: { isValid }
  } = methods;
  const nameRef = useRef<HTMLInputElement>(null);

  const name = watch('name') as string;
  const workspaces = watch('workspaces') as string[];
  const allWorkspaces = watch('allWorkspaces') as boolean;

  const onSubmit = (token: TokenCreate) => {
    const ws = !token.allWorkspaces ? map(token?.workspaces, 'id') : [];
    const { subjects, ...rest } = token;

    save({ ...rest, workspaces: ws });
  };

  useEffect(() => {
    if (mode === 'create') {
      nameRef.current?.focus();
    }
  }, [mode, nameRef]);
  
  useEffect(() => {
    if (response?.token) {
      updateParam(
        'token',
        routes.tokensComparation,
        history,
        NEW_TAB,
        `${response?.id}`
      );
    }
  }, [response, history]);

  const ModalNewToken = () => (
    <ModalCopy
      title="Your token has been registered!"
      description="You can now use the token according to the settings you have created."
      token={response?.token}
      onClose={() => setIsModalCopy(false)}
    />
  )

  return (
    <Styled.Content>
      {isModalCopy && <ModalNewToken />}
      <FormProvider {...methods}>
        <Styled.Form onSubmit={handleSubmit(onSubmit)}>
          <ContentIcon icon="token">
            <Form.InputTitle
              name="name"
              ref={self => {
                nameRef.current = self;
                return register(self, isRequiredAndNotBlank);
              }}
              defaultValue={data?.name}
              readOnly={!isEmpty(data)}
              error={errors?.name?.message}
            />
          </ContentIcon>
          {name && <Workspaces mode={mode} />}
          {(workspaces || allWorkspaces) && (
            <Fragment>
              <Scopes mode={mode} />
              {mode === 'create' && (
                <Styled.Button
                  type="submit"
                  size="EXTRA_SMALL"
                  isDisabled={!isValid}
                  isLoading={status === 'pending'}
                >
                  Generate token
                </Styled.Button>
              )}
            </Fragment>
          )}
        </Styled.Form>
      </FormProvider>
    </Styled.Content>
  );
};

export default FormToken;
