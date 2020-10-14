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
import { useParams } from 'core/utils/routes';
import { setCard } from 'modules/Hypotheses/state/actions';
import { CARD_TYPE_ACTION } from 'modules/Hypotheses/Board/Card/constants';
import { useDispatch } from 'core/state/hooks';
import { Card as CardProps } from '../interfaces';
import { useCard, useBoard } from '../hooks';
import CardView from './View';
import CardRemove from './Remove';
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

interface Params {
  hypothesisId: string;
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
    const { hypothesisId } = useParams<Params>();
    const dispatch = useDispatch();
    const { getAll } = useBoard();
    const {
      archiveBy,
      responseArchive,
      removeById,
      responseRemove
    } = useCard();
    const [toggleModalView, setToggleModalView] = useState(false);
    const [toggleModalRemove, setToggleModalRemove] = useState(false);

    useEffect(() => {
      if (responseArchive || responseRemove) {
        getAll(hypothesisId);
      }
    }, [responseArchive, responseRemove, getAll, hypothesisId]);

    const onCloseView = (cardUpdated: CardProps) => {
      setToggleModalView(false);
      dispatch(setCard(columnId, cardUpdated));
    };

    const onRemove = () => {
      setToggleModalRemove(false);
      getAll(hypothesisId);
    };

    const handleRemove = () => {
      if (card.type === CARD_TYPE_ACTION) {
        removeById(card.id);
      } else {
        setToggleModalRemove(true);
      }
    };

    const archiveCard = () => {
      archiveBy(card.id);
    };

    const handleClick = () => {
      if (isSelectable) {
        onSelect();
      } else {
        setToggleModalView(true);
      }
    };

    const renderModalView = () => (
      <CardView
        id={card.id}
        onClose={(cardUpdated: CardProps) => onCloseView(cardUpdated)}
      />
    );

    const renderModalRemove = () => (
      <CardRemove
        id={card.id}
        onRemove={onRemove}
        onClose={() => setToggleModalRemove(false)}
      />
    );

    return (
      <Fragment>
        {toggleModalView && renderModalView()}
        {toggleModalRemove && renderModalRemove()}
        <Styled.Card
          ref={ref}
          type={card.type}
          description={card.name}
          members={card.members}
          hideAction={isSelectable}
          isSelected={isSelected}
          isSelectable={isSelectable}
          onClick={() => handleClick()}
          onRemove={() => handleRemove()}
          onArchive={() => archiveCard()}
          {...draggableProps}
          {...dragHandleProps}
        />
      </Fragment>
    );
  }
);

export default CardBoard;
