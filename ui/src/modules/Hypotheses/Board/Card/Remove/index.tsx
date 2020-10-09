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

import React, { useEffect } from 'react';
import Layer from 'core/components/Layer';
import Radio from 'core/components/Radio';
import { useCard } from '../../hooks';
import { radios } from './constants';
import Styled from './styled';

interface Props {
  id: string;
  onClose: () => void;
  onRemove: () => void;
}

const CardRemove = ({ id, onClose }: Props) => {
  console.log('id', id);
  const { removeById, responseRemove } = useCard();

  useEffect(() => {
    if (responseRemove) {
      onClose();
    }
  }, [onClose, responseRemove]);

  // const onRemove = () => {
  //   removeById(id);
  // };

  const renderLoader = () => <Layer>Loading..</Layer>;

  // const renderContent = () => <Layer>Loading..</Layer>;

  return (
    <Styled.Modal
      title="Choose what you want to delete"
      dismissLabel="Cancel"
      continueLabel="Delete"
      onContinue={() => console.log('Continue')}
      onDismiss={() => console.log('Dismiss')}
    >
      <Radio.Cards name={`radio-cards-remove-${id}`} items={radios} />
    </Styled.Modal>
  );

  // return <Styled.Modal onClose={onClose}>{renderLoader()}</Styled.Modal>;
};

export default CardRemove;
