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
import isEmpty from 'lodash/isEmpty';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { setBoard } from '../state/actions';
import { COLUMN } from './Column/constants';
import { useBoard } from './hooks';
import { Column } from './interfaces';
import { moving, getColumn, isAllowedToMove } from './helpers';
import Loader from './loader';
import Columns from './Columns';
import Styled from './styled';
import { useGlobalState, useDispatch } from 'core/state/hooks';

interface Props {
  id: string;
  name: string;
}

const Board = ({ id, name }: Props) => {
  const { getAll, loadingAll, movingCard, reorderColumn } = useBoard();
  const { columns } = useGlobalState(({ hypothesis }) => hypothesis);
  const dispatch = useDispatch();
  const isLoading = isEmpty(columns) || loadingAll;

  useEffect(() => {
    getAll(id);
  }, [id, getAll]);

  const setColumns = (columns: Column[]) => {
    dispatch(setBoard(columns));
  };

  const handleDragEnd = (result: DropResult) => {
    const { draggableId: cardId, destination, source } = result;
    const isAllowed = isAllowedToMove(columns, cardId, destination, source);

    if (destination && source && isAllowed)
      moving(
        result,
        destination,
        source,
        columns,
        cardId,
        id,
        setColumns,
        movingCard,
        reorderColumn
      );
  };

  const renderLoading = () => <Loader />;

  const renderColumns = () => (
    <Styled.Board data-testid={`board-hypothesis-${id}`}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Columns.ToDo
          hypothesisId={id}
          column={getColumn(columns, COLUMN.TO_DO)}
        />
        <Columns.Doing column={getColumn(columns, COLUMN.DOING)} />
        <Columns.ReadyToGo
          hypothesisId={id}
          column={getColumn(columns, COLUMN.READY_TO_GO)}
        />
        <Columns.Builds
          hypothesisId={id}
          column={getColumn(columns, COLUMN.BUILDS)}
        />
        <Columns.DeployedReleases
          column={getColumn(columns, COLUMN.DEPLOYED_RELEASES)}
        />
      </DragDropContext>
    </Styled.Board>
  );

  return (
    <Styled.Tab title={name} name="hypotheses" size="15px">
      {isLoading ? renderLoading() : renderColumns()}
    </Styled.Tab>
  );
};

export default Board;
