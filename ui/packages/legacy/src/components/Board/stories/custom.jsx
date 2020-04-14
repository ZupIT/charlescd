import React, { useState } from 'react'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import map from 'lodash/map'
import { BOARD_MOCK } from './mock'
import Board from '..'
import Column from '../Column'
import Card from '../Card'

const CustomColumnWrapper = styled(Column.Wrapper)`
  background: #314464;
`

const CustomCard = styled(Card)`
  background: #0ac5ab;
  color: #fff;
  box-shadow: none;
  border: none;
`

const CustomHeader = styled(Column.Header)`
  color: #fff;
  border-bottom: 2px solid #fff;
`

const CustomColumn = ({ id, type, title, color, children }) => (
  <CustomColumnWrapper>
    <CustomHeader
      title={title}
      color={color}
    />
    <Column.Content
      id={id}
      type={type}
    >
      {(provided, snapshot) => (
        <Column.Inner
          provided={provided}
          snapshot={snapshot}
        >
          {children}
          {provided.placeholder}
        </Column.Inner>
      )}
    </Column.Content>
  </CustomColumnWrapper>
)

const BoardCustom = () => {
  const [board, setBoard] = useState(BOARD_MOCK)
  const { backlog, todo } = board

  const handleDragEnd = (result) => {
    const { cards } = result

    setBoard(cards)
    action()(result)
  }

  return (
    <Board
      cards={board}
      onDragEnd={handleDragEnd}
    >
      <CustomColumn
        id="backlog"
        type="LIST"
        title="Backlog"
      >
        { map(backlog, ({ id, description }, i) => (
          <CustomCard
            key={i}
            id={id}
            index={i}
          >
            {description}
          </CustomCard>
        ))}
      </CustomColumn>
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
            {description}
          </Card>
        ))}
      </Column.Default>
    </Board>
  )
}

export default BoardCustom
