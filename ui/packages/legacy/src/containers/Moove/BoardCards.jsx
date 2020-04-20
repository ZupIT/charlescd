import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import filter from 'lodash/filter'
import find from 'lodash/find'
import map from 'lodash/map'
import kebabCase from 'lodash/kebabCase'
import { getUserProfileData } from 'core/helpers/profile'
import Board from 'components/Board'
import ReadyToGoColumn from 'containers/Moove/Columns/ReadyToGoColumn'
import ToDoColumn from 'containers/Moove/Columns/ToDoColumn'
import DefaultColumn from 'containers/Moove/Columns/DefaultColumn'
import { mooveActions } from 'containers/Moove/state/actions'
import { reorder } from 'components/Board/helper'
import { TYPES, BOARD_COLUMN } from 'containers/Moove/constants'
import { isSameColumn } from 'containers/Moove/helper'
import ReleaseNameModal from 'containers/Moove/ReleaseNameModal'
import { useParams } from 'core/routing/hooks'

const BoardCards = ({ columns }) => {
  const dispatch = useDispatch()
  const { hypothesisId } = useParams()
  const [openModal, toggleModal] = useState(false)
  const { loading: { generatingRelease } } = useSelector(({ moove }) => moove)
  const [internalColumns, setInternalColumns] = useState(columns)

  useEffect(() => {
    setInternalColumns(columns)
  }, [columns])

  const orderCardInColumn = (destinationColumnId) => {
    const currentColumn = find(internalColumns, ({ id }) => id === destinationColumnId)
    dispatch(mooveActions.orderCardsInColumn(hypothesisId, currentColumn))
  }

  const updateCardOtherColumn = (cardId, sourceColumnId, destinationColumnId) => {
    const source = find(internalColumns, ({ id }) => id === sourceColumnId)
    const destination = find(internalColumns, ({ id }) => id === destinationColumnId)
    const data = {
      source,
      destination,
    }

    dispatch(mooveActions.updateCardColumn(hypothesisId, cardId, data))
  }

  const reorderCards = result => setInternalColumns(reorder(result, internalColumns, 'cards'))

  const movingInBoard = (result, destination, source, cardId) => {
    const { droppableId: destinationColumnId } = destination
    const { droppableId: sourceColumnId } = source

    reorderCards(result)

    return isSameColumn(destinationColumnId, sourceColumnId)
      ? orderCardInColumn(destinationColumnId)
      : updateCardOtherColumn(cardId, sourceColumnId, destinationColumnId)
  }

  const isTodoColumn = (droppableId) => {
    const todoColumnName = BOARD_COLUMN.TO_DO
    const [todoColumn] = filter(columns, ({ name }) => name === todoColumnName)

    return todoColumn?.id === droppableId
  }

  const handleOnDragEnd = (result) => {
    const { draggableId: cardId, destination, source } = result
    const isValidColumn = destination && source

    if (!isTodoColumn(destination?.droppableId) && isValidColumn) {
      movingInBoard(result, destination, source, cardId)
    }
  }

  const handleClickCreateCard = () => {}

  const renderReadyToGoColumn = (cards, rest) => (
    <ReadyToGoColumn
      {...rest}
      list={cards}
      loading={generatingRelease}
      generateReleaseCandidate={() => toggleModal(!openModal)}
    />
  )

  const renderCurrentColumn = ({ cards, builds, ...rest }) => ({
    [BOARD_COLUMN.TO_DO]: (
      <ToDoColumn {...rest} list={cards} onCreateCard={handleClickCreateCard} />
    ),
    [BOARD_COLUMN.DOING]: <DefaultColumn {...rest} list={cards} />,
    [BOARD_COLUMN.READY_TO_GO]: renderReadyToGoColumn(cards, rest),
  }[rest.name])

  const handleOnSubmitReleaseName = (releaseName) => {
    const readyToGoCards = find(internalColumns, ({ name }) => name === BOARD_COLUMN.READY_TO_GO)
    const features = filter(readyToGoCards?.cards, ({ type }) => type === TYPES.FEATURE)
    const data = {
      features: map(features, ({ feature: { id } }) => id),
      hypothesisId,
      tagName: `release-darwin-${kebabCase(releaseName)}`,
      authorId: getUserProfileData('id'),
    }

    toggleModal(!openModal)
    dispatch(mooveActions.generateReleaseCandidate(data))
  }

  return (
    <Fragment>
      <Board
        onDragEnd={handleOnDragEnd}
      >
        { map(internalColumns, (column => renderCurrentColumn({ ...column, key: column.id }))) }
      </Board>
      { openModal && (
        <ReleaseNameModal
          onSubmit={handleOnSubmitReleaseName}
          onClose={() => toggleModal(!openModal)}
        />
      )}
    </Fragment>
  )
}

export default BoardCards
