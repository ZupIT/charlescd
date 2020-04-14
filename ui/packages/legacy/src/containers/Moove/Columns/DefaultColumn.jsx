import React from 'react'
import map from 'lodash/map'
import Styled from './styled'
import ColumnHeader from './ColumnHeader'
import ColumnContent from './ContentColumn'
import DraggableCard from '../Draggables/Card'


const DefaultColumn = ({ id, name, list }) => (
  <Styled.Wrapper>
    <ColumnHeader id={name} list={list} />
    <ColumnContent
      id={id}
      type={name}
    >
      { map(list, (card, i) => <DraggableCard showActions key={i} {...card} index={i} />) }
    </ColumnContent>
  </Styled.Wrapper>
)


export default DefaultColumn
