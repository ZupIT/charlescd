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

import React, { useState, useRef, Fragment } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import isEqual from 'lodash/isEqual';
import includes from 'lodash/includes';
import map from 'lodash/map';
import xor from 'lodash/xor';
import isEmpty from 'lodash/isEmpty';
import Column from 'modules/Hypotheses/Board/Column';
import CardBoard from 'modules/Hypotheses/Board/Card';
import { Column as ColumnProps } from 'modules/Hypotheses/Board/interfaces';
import useOutsideClick from 'core/hooks/useClickOutside';
import GenerateRelease from './GenerateRelease';
import { useBoard } from 'modules/Hypotheses/Board/hooks';
import Actions from './Actions';
import Caption from './Caption';
import { Status } from './interfaces';
import { STATUS_DEFAULT, STATUS_HOVERING, STATUS_SELECTING } from './constants';

interface Props {
  hypothesisId: string;
  column: ColumnProps;
}

const ReadyToGo = ({ hypothesisId, column }: Props) => {
  const ref = useRef<HTMLDivElement>();
  const { getAll } = useBoard();
  const [features, setFeatures] = useState<string[]>();
  const [status, setStatus] = useState<Status>(STATUS_DEFAULT);
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const hasCards = !isEmpty(column?.cards);
  const isSelecting = isEqual(status, STATUS_SELECTING);
  const isDefault = isEqual(status, STATUS_DEFAULT);
  const isReadyToGo = isDefault || (isSelecting && !isEmpty(features));

  useOutsideClick(ref, () => setStatus(STATUS_DEFAULT));

  const reset = () => {
    setStatus(STATUS_DEFAULT);
    setFeatures(null);
  };

  const handleClose = () => {
    getAll(hypothesisId);
    setToggleModal(false);
    reset();
  };

  const handleAction = () => {
    if (isDefault) {
      setStatus(STATUS_HOVERING);
    } else {
      setToggleModal(true);
    }
  };

  const handleSelect = (cardId: string) => {
    if (isSelecting) {
      setFeatures(xor(features, [cardId]));
    }
  };

  const renderCaption = () => {
    if (isSelecting) {
      return <Caption />;
    }
  };

  const renderModal = () =>
    toggleModal && (
      <GenerateRelease
        hypothesisId={hypothesisId}
        features={features || map(column?.cards, 'feature.id')}
        onClose={handleClose}
      />
    );

  const renderAction = () => (
    <Actions
      status={status}
      setStatus={setStatus}
      toggleModal={setToggleModal}
      isReady={isReadyToGo && hasCards}
      onAction={handleAction}
      onCancel={reset}
    />
  );

  return (
    <Fragment>
      {renderModal()}
      <Droppable key={column.name} droppableId={column.id}>
        {dropProvided => (
          <Column
            name={column.name}
            ref={dropProvided.innerRef}
            caption={renderCaption()}
            action={renderAction()}
            {...dropProvided.droppableProps}
          >
            {map(column.cards, (card, cardIndex) => (
              <Draggable
                key={card.id}
                draggableId={card.id}
                index={cardIndex}
                isDragDisabled={isSelecting}
              >
                {dragProvided => (
                  <CardBoard
                    key={card.name}
                    onSelect={() => handleSelect(card?.feature?.id)}
                    isSelected={includes(features, card?.feature?.id)}
                    isSelectable={isSelecting}
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
    </Fragment>
  );
};

export default ReadyToGo;
