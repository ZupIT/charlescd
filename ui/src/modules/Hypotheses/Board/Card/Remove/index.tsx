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
import { RadioCard } from 'core/components/Radio/Cards/Item';
import set from 'lodash/set';
import { useCard } from '../../hooks';
import { radios } from './constants';
import Styled from './styled';

interface Props {
  id: string;
  isProtected?: boolean;
  onClose: () => void;
  onRemove: () => void;
}

const CardRemove = ({ id, isProtected, onClose, onRemove }: Props) => {
  const [isDeleteBranch, setIsDeleteBranch] = useState(false);
  const [options, setOptions] = useState<RadioCard[]>(null);
  const { removeById, responseRemove, loadingRemove } = useCard();

  useEffect(() => {
    if (responseRemove) {
      onRemove();
    }
  }, [onRemove, responseRemove]);

  useEffect(() => {
    if (radios) {
      set(radios, '[1].disabled', isProtected);
      setOptions(radios);
    }
  }, [isProtected]);

  const onChange = (value: string) => {
    setIsDeleteBranch(value === 'card-branch');
  };

  const handleRemove = () => {
    removeById(id, isDeleteBranch);
  };

  return (
    <Styled.Modal
      title="Choose what you want to delete"
      dismissLabel="Cancel"
      continueLabel="Delete"
      onContinue={handleRemove}
      onDismiss={onClose}
      isLoading={loadingRemove}
    >
      <Radio.Cards
        name={`remove-${id}`}
        items={options}
        onChange={(event: ChangeInputEvent) =>
          onChange(event.currentTarget.value)
        }
      />
    </Styled.Modal>
  );
};

export default CardRemove;
