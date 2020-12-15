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

import React, { useState, useEffect, forwardRef, Ref, Fragment } from 'react';
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps
} from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { setCard } from 'modules/Hypotheses/state/actions';
import { useDispatch } from 'core/state/hooks';
import { Card as CardProps } from '../interfaces';
import { useCard, useBoard } from '../hooks';
import CardView from './View';
import Styled from './styled';

interface Props {
  card: CardProps;
  columnId: string;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps;
  onSelect?: Function;
  isSelected?: boolean;
  isSelectable?: boolean;
}

const CardBoard = forwardRef(
  (
    {
      card,
      columnId,
      draggableProps,
      dragHandleProps,
      onSelect,
      isSelected,
      isSelectable
    }: Props,
    ref: Ref<HTMLDivElement>
  ) => {
    const { hypothesisId } = useParams();
    const dispatch = useDispatch();
    const { getAll } = useBoard();
    const { removeBy, responseRemove, archiveBy, responseArchive } = useCard();
    const [cardId, setCardId] = useState<string>();
    const [toggleModal, setToggleModal] = useState(false);

    useEffect(() => {
      cardId && setToggleModal(true);
    }, [cardId]);

    useEffect(() => {
      if (responseRemove || responseArchive) {
        getAll(hypothesisId);
      }
    }, [responseRemove, responseArchive, getAll, hypothesisId]);

    const handleClose = (updatedCard: CardProps) => {
      setToggleModal(false);
      setCardId(null);
      dispatch(setCard(columnId, updatedCard));
    };

    const removeCard = () => {
      removeBy(card.id);
    };

    const archiveCard = () => {
      archiveBy(card.id);
    };

    const handleClick = () => {
      if (isSelectable) {
        onSelect();
      } else {
        setCardId(card.id);
      }
    };

    const renderModal = () => (
      <CardView
        id={cardId}
        onClose={(updatedCard: CardProps) => handleClose(updatedCard)}
      />
    );

    return (
      <Fragment>
        {toggleModal && renderModal()}
        <Styled.Card
          ref={ref}
          type={card.type}
          description={card.name}
          members={card.members}
          hideAction={isSelectable}
          isSelected={isSelected}
          isSelectable={isSelectable}
          onClick={() => handleClick()}
          onRemove={() => removeCard()}
          onArchive={() => archiveCard()}
          {...draggableProps}
          {...dragHandleProps}
        />
      </Fragment>
    );
  }
);

export default CardBoard;
