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
import Text from 'core/components/Text';
import map from 'lodash/map';
import { isNotBlank, isRequired, maxLength } from 'core/utils/validations';
import { Mode } from '../helpers';
import Workspaces from './Workspaces';
import Scopes from './Scopes';
import ModalCopy from './Modal';
import { isEmpty } from 'lodash';
import { updateParam } from 'core/utils/path';
import routes from 'core/constants/routes';
import { useHistory } from 'react-router';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import Styled from './styled';
import { dateTimeFormatter } from 'core/utils/date';

interface Props {
  mode?: Mode;
  data?: Token;
}

const FormToken = ({ mode, data }: Props) => {
  const { save, response, status } = useSave();
  const isModeCreate = mode === 'create';
  const isModeView = mode === 'view';
  const [isModalCopy, setIsModalCopy] = useState<boolean>(false);
  const [next, setNext] = useState(mode === 'view');
  const methods = useForm<TokenCreate>({
    mode: 'onChange',
    defaultValues: data,
  });
  const history = useHistory();
  const {
    register,
    handleSubmit,
    watch,
    errors,
    formState: { isValid },
  } = methods;
  const nameRef = useRef<HTMLInputElement>(null);

  const workspaces = watch('workspaces') as string[];
  const allWorkspaces = watch('allWorkspaces') as boolean;

  const onSubmit = (token: TokenCreate) => {
    const ws = !token.allWorkspaces ? map(token?.workspaces, 'id') : [];
    const { subjects, ...rest } = token;

    save({ ...rest, workspaces: ws });
  };

  const onCloseModalCopy = () => {
    updateParam(
      'token',
      routes.tokensComparation,
      history,
      NEW_TAB,
      `${response?.id}`
    );
    setIsModalCopy(true);
  };

  useEffect(() => {
    if (isModeCreate) {
      nameRef.current?.focus();
    }
  }, [mode, nameRef, isModeCreate]);

  useEffect(() => {
    if (response?.token) {
      setIsModalCopy(true);
    }
  }, [response, history]);

  const ModalNewToken = () => (
    <ModalCopy
      title="Your token has been created!"
      description="You have succesfully added a new personal acces token. Copy the token now!"
      token={response?.token}
      onClose={onCloseModalCopy}
    />
  );

  const LastUsed = () =>
    data?.last_used_at ? (
      <Text.h5 color="dark">
        Last used at {dateTimeFormatter(data.last_used_at)}
      </Text.h5>
    ) : (
      <Text.h5 color="dark">This token has not been used yet.</Text.h5>
    );

  const Author = () =>
    data?.author ? (
      <Text.h5 color="dark">Created by {data.author}</Text.h5>
    ) : (
      <></>
    );

  const Info = () => (
    <Styled.Info>
      <Author />
      <LastUsed />
    </Styled.Info>
  );

  return (
    <Styled.Content>
      {isModalCopy && <ModalNewToken />}
      <FormProvider {...methods}>
        <Styled.Form onSubmit={handleSubmit(onSubmit)}>
          <ContentIcon icon="token">
            <Styled.InputTitle
              name="name"
              placeholder="Type a name"
              ref={(self) => {
                nameRef.current = self;
                return register(self, {
                  required: isRequired(),
                  validate: {
                    notBlank: isNotBlank,
                  },
                  maxLength: maxLength(),
                });
              }}
              defaultValue={data?.name}
              readOnly={!isEmpty(data)}
              error={errors?.name?.message}
              buttonText="Next"
              buttonType="submit"
              onClickSave={() => setNext(true)}
            />
            {isModeView && <Info />}
          </ContentIcon>
          {next && <Workspaces mode={mode} />}
          {(workspaces || allWorkspaces) && (
            <Fragment>
              <Scopes mode={mode} />
              {isModeCreate && (
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
