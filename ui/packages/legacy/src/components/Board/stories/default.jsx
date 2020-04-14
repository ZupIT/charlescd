import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import map from 'lodash/map'
import { BOARD_MOCK } from './mock'
import Board from '..'
import Column from '../Column'
import Card from '../Card'

const BoardDefault = () => {
  const [board, setBoard] = useState(BOARD_MOCK)
  const { backlog, todo } = board

  const handleDragEnd = (result) => {
    const { cards } = result

    setBoard(cards)
    action(result)
  }

  return (
    <Board
      cards={board}
      onDragEnd={handleDragEnd}
    >
      <Column.Default
        id="backlog"
        type="LIST"
        title="Backlog"
      >
        { map(backlog, ({ id, description }, i) => (
          <Card
            key={i}
            id={id}
            index={i}
          >
            { description }
          </Card>
        ))}
      </Column.Default>
      <Column.Default
        id="todo"
        type="LIST"
        title="To do"
      >
        { map(todo, ({ id, description }, i) => (
          <Card
            key={i}
            id={id}
            index={i}
          >
            { description }
          </Card>
        ))}
      </Column.Default>
    </Board>
  )
}

export default BoardDefault
