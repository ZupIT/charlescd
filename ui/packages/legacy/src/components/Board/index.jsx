import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { StyledBoard } from './styled'

const Board = ({ children, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StyledBoard.Wrapper>
        { children }
      </StyledBoard.Wrapper>
    </DragDropContext>
  )
}

export default Board
