import React, { memo } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { StyledBoard } from './styled'

const Card = ({ className, id, index, children, onClick }) => (
  <Draggable
    key={id}
    draggableId={id}
    index={index}
  >
    {(provided, snapshot) => (
      <StyledBoard.Card
        className={className}
        isDragging={snapshot.isDragging}
        isGroupOver={Boolean(snapshot.combineTargetFor)}
        provided={provided}
        ref={provided.innerRef}
        onClick={onClick}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        { children }
      </StyledBoard.Card>
    )}

  </Draggable>
)

export default memo(Card)
