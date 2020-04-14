import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { StyledBoard } from './styled'

const Wrapper = ({ children, className }) => (
  <StyledBoard.Column.Wrapper
    className={className}
  >
    { children }
  </StyledBoard.Column.Wrapper>
)

const Header = ({ className, children }) => (
  <StyledBoard.Column.Header
    className={`${className} column-header`}
  >
    {children}
  </StyledBoard.Column.Header>
)

const Content = ({ className, id, type, background, children, withAction }) => (
  <StyledBoard.Column.Content
    withAction={withAction}
    className={`${className} column-content`}
    background={background}
  >
    <Droppable
      droppableId={id}
      type={type}
    >
      { children }
    </Droppable>
  </StyledBoard.Column.Content>
)

const Inner = ({ className, provided, snapshot, children }) => (
  <StyledBoard.Column.Inner
    className={`${className} column-inner`}
    isDraggOver={snapshot.isDraggingOver}
    ref={provided.innerRef}
    {...provided.droppableProps}
  >
    {children}
  </StyledBoard.Column.Inner>
)

const Default = ({ id, type, title, className, children }) => {
  return (
    <Wrapper
      className={className}
    >
      <Header>{title}</Header>
      <Content
        id={id}
        type={type}
      >
        {(provided, snapshot) => (
          <Inner
            provided={provided}
            snapshot={snapshot}
          >
            {children}
            {provided.placeholder}
          </Inner>
        )}
      </Content>
    </Wrapper>
  )
}

export default {
  Default,
  Wrapper,
  Header,
  Content,
  Inner,
}
