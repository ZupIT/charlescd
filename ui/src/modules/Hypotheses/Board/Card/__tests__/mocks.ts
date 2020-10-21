import { DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps } from 'react-beautiful-dnd'
import { Card } from '../../interfaces'
import { CARD_TYPE_ACTION, CARD_TYPE_FEATURE } from '../constants'
import { Props as CardBoardProps } from '..'

const card: Omit<Card, 'type' | 'feature'> = {
  id: '123',
  hypothesisId: '098',
  name: 'Card',
  createdAt: '2020-01-01 12:00',
  labels: [],
  index: 0,
  isProtected: false
}

const cardAction: Card = {
  ...card,
  feature: null,
  type: CARD_TYPE_ACTION,
}

const cardFeature: Card = {
  ...card,
  type: CARD_TYPE_FEATURE,
  feature: {
    id: '456',
    name: 'feature',
    branches: ['https://github.com/charlescd/tree/feature'],
    branchName: 'feature',
    author: {
      id: '123',
      name: 'Charles',
      email: 'charlescd@zup.com.br',
      isRoot: false,
      createdAt: '2020-01-01 12:00'
    },
    modules: [{
      id: '789',
      name: 'ZupIT/charlescd',
      gitRepositoryAddress: '',
      helmRepository: ''
    }]
  }
}

const draggableProps: DraggableProvidedDraggableProps = {
  "data-rbd-draggable-context-id": "0",
  "data-rbd-draggable-id": "123",
  onTransitionEnd: null,
  style: {
    transform: null,
    transition: null
  },
}

const dragHandleProps: DraggableProvidedDragHandleProps = {
  "aria-labelledby": "",
  "data-rbd-drag-handle-context-id": "0",
  "data-rbd-drag-handle-draggable-id": "123",
  draggable: false,
  onDragStart: jest.fn(),
  tabIndex: 0
}

export const propsFeature: CardBoardProps = {
  card: cardFeature,
  columnId: '123',
  draggableProps,
  dragHandleProps
}

export const propsAction: CardBoardProps = {
  card: cardAction,
  columnId: '123',
  draggableProps,
  dragHandleProps
}