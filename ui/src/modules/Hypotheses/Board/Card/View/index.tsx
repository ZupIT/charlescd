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

import React, { useEffect, useState, useCallback, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import Layer from 'core/components/Layer';
import Form from 'core/components/Form';
import ContentIcon from 'core/components/ContentIcon';
import { Card } from '../../interfaces';
import { useCard } from '../../hooks';
import Layers from './Layers';
import Styled from './styled';

interface Props {
  id: string;
  onClose: (card: Card) => void;
}

const CardView = ({ id, onClose }: Props) => {
  const { getById, loading, response, update } = useCard();
  const { register, handleSubmit } = useForm();
  const [card, setCard] = useState<Card>();
  const isLoading = isEmpty(card) || loading;

  const getCardById = useCallback((cardId: string) => getById(cardId), [
    getById
  ]);

  useEffect(() => {
    getCardById(id);
  }, [getCardById, id]);

  useEffect(() => {
    if (response) {
      setCard(response as Card);
    }
  }, [response]);

  const handleClose = () => {
    onClose(card);
  };

  const handleSaveCardName = ({ name }: Record<string, string>) => {
    update(card.id, {
      ...card,
      name
    });
  };

  const renderLoader = () => <Layer>Loading..</Layer>;

  const renderContent = () => (
    <Fragment>
      <Layer>
        <ContentIcon icon="card">
          <Form.InputTitle
            name="name"
            readOnly={!isEmpty(card?.feature?.modules)}
            resume
            ref={register({ required: true })}
            defaultValue={card.name}
            onClickSave={handleSubmit(handleSaveCardName)}
          />
        </ContentIcon>
      </Layer>
      <Layers.Members
        cardId={card.id}
        members={card.members}
        onFinish={() => getById(card.id)}
      />
      <Layers.Modules card={card} onFinish={() => getById(card.id)} />
      <Layers.Features card={card} />
    </Fragment>
  );

  return (
    <Styled.Modal onClose={() => handleClose()} isOutsideClick>
      {isLoading ? renderLoader() : renderContent()}
    </Styled.Modal>
  );
};

export default CardView;
