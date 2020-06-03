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

import React, { Fragment } from 'react';
import isEqual from 'lodash/isEqual';
import { Status } from '../interfaces';
import { STATUS_HOVERING, STATUS_SELECTING } from '../constants';
import Styled from './styled';

interface Props {
  status: Status;
  setStatus: Function;
  toggleModal: (toggle: boolean) => void;
  onAction: Function;
  onCancel: Function;
  isReady: boolean;
}

const Actions = ({
  status,
  setStatus,
  toggleModal,
  onAction,
  onCancel,
  isReady
}: Props) => {
  const renderBackground = () =>
    (isEqual(status, STATUS_HOVERING) || isEqual(status, STATUS_SELECTING)) && (
      <Styled.Background onClick={() => onCancel()} />
    );

  const renderActions = () => (
    <Styled.Action.Content>
      <Styled.Action.Button
        name="release"
        color="light"
        onClick={() => setStatus(STATUS_SELECTING)}
      >
        Select features
      </Styled.Action.Button>
      <Styled.Action.Button
        name="package"
        color="light"
        onClick={() => toggleModal(true)}
      >
        Generate with all features
      </Styled.Action.Button>
    </Styled.Action.Content>
  );

  return (
    <Fragment>
      {renderBackground()}
      {isEqual(status, STATUS_HOVERING) && renderActions()}
      <Styled.Button
        name="package"
        color="light"
        isDisabled={!isReady}
        onClick={() => onAction()}
      >
        Generate release
      </Styled.Button>
    </Fragment>
  );
};

export default Actions;
