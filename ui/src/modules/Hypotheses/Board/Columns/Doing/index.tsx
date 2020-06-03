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

import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Column from 'modules/Hypotheses/Board/Column';
import CardBoard from 'modules/Hypotheses/Board/Card';
import { Column as ColumnProps } from 'modules/Hypotheses/Board/interfaces';

export interface Props {
  column: ColumnProps;
}

const Doing = ({ column }: Props) => {
  return (
    <Droppable key={column.name} droppableId={column.id}>
      {dropProvided => (
        <Column
          full
          name={column.name}
          ref={dropProvided.innerRef}
          {...dropProvided.droppableProps}
        >
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
          {dropProvided.placeholder}
        </Column>
      )}
    </Droppable>
  );
};

export default Doing;
