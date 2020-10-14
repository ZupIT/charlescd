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

import React, { useEffect, useState } from 'react';
import Radio from 'core/components/Radio';
import { ChangeInputEvent } from 'core/interfaces/InputEvents';
import { useCard } from '../../hooks';
import { radios } from './constants';
import Styled from './styled';

interface Props {
  id: string;
  onClose: () => void;
  onRemove: () => void;
}

const CardRemove = ({ id, onClose }: Props) => {
  const [isReady, setIsReady] = useState(false);
  const [isDeleteBranch, setIsDeleteBranch] = useState(false);
  const { removeById, responseRemove, loadingRemove } = useCard();

  useEffect(() => {
    if (responseRemove) {
      onClose();
    }
  }, [onClose, responseRemove]);

  const onChange = (value: string) => {
    setIsReady(true);
    setIsDeleteBranch(value === 'card-branch');
  };

  const onRemove = () => {
    removeById(id, isDeleteBranch);
  };

  return (
    <Styled.Modal
      title="Choose what you want to delete"
      dismissLabel="Cancel"
      continueLabel="Delete"
      onContinue={onRemove}
      onDismiss={onClose}
      isDisabled={!isReady}
      isLoading={loadingRemove}
    >
      <Radio.Cards
        name={`radio-cards-remove-${id}`}
        items={radios}
        onChange={(event: ChangeInputEvent) =>
          onChange(event.currentTarget.value)
        }
      />
    </Styled.Modal>
  );
};

export default CardRemove;
