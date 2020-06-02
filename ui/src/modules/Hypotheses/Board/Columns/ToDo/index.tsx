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

import React, { useEffect, useState, useRef } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import useOutsideClick from 'core/hooks/useClickOutside';
import { createCardPayload } from 'modules/Hypotheses/Board/helpers';
import Column from 'modules/Hypotheses/Board/Column';
import CardBoard from 'modules/Hypotheses/Board/Card';
import { Column as ColumnProps } from 'modules/Hypotheses/Board/interfaces';
import { useCreateCard, useBoard } from 'modules/Hypotheses/Board/hooks';
import FakeCard from './FakeCard';
import Styled from './styled';

interface Props {
  hypothesisId: string;
  column: ColumnProps;
}

const ToDo = ({ hypothesisId, column }: Props) => {
  const { getAll } = useBoard();
  const fakeCardRef = useRef<HTMLDivElement>();
  const [showNewCard, setShowNewCard] = useState(false);
  const { response: newCardResponse, create } = useCreateCard();

  useOutsideClick(fakeCardRef, () => setShowNewCard(!showNewCard));

  const handleCreateCard = (cardName: string) => {
    const newCardPayload = createCardPayload({
      name: cardName,
      hypothesisId
    });

    create(newCardPayload);
  };

  const createNewCard = (cardName: string) => {
    handleCreateCard(cardName);
    setShowNewCard(false);
  };

  const renderAction = () => (
    <Styled.Button
      name="card"
      color="dark"
      onClick={() => setShowNewCard(true)}
    >
      Create card
    </Styled.Button>
  );

  useEffect(() => {
    if (newCardResponse) {
      getAll(hypothesisId);
    }
  }, [newCardResponse, getAll, hypothesisId]);

  return (
    <Droppable key={column.name} droppableId={column.id}>
      {dropProvided => (
        <Column
          name={column.name}
          action={renderAction()}
          ref={dropProvided.innerRef}
          {...dropProvided.droppableProps}
        >
          <>
            {column.cards.map((card, cardIndex) => (
              <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                {dragProvided => (
                  <CardBoard
                    key={card.name}
                    card={card}
                    columnId={column.id}
                    ref={dragProvided.innerRef}
                    draggableProps={dragProvided.draggableProps}
                    dragHandleProps={dragProvided.dragHandleProps}
                  />
                )}
              </Draggable>
            ))}
            {showNewCard && (
              <FakeCard ref={fakeCardRef} onSave={createNewCard} />
            )}
          </>
          {dropProvided.placeholder}
        </Column>
      )}
    </Droppable>
  );
};

export default ToDo;
