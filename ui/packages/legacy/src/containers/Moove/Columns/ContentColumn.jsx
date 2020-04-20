import React from 'react'
import get from 'lodash/get'
import { columnsInfos } from 'containers/Moove/helper'
import Column from 'components/Board/Column'
import Styled from './styled'

const ColumnContent = ({ id, type, children, className, withAction = false }) => (
  <Column.Content
    className={className}
    withAction={withAction}
    id={id}
    type={get(columnsInfos(type), 'type')}
  >
    {(provided, snapshot) => (
      <Styled.Inner
        provided={provided}
        snapshot={snapshot}
      >
        {children}
        {provided.placeholder}
      </Styled.Inner>
    )}
  </Column.Content>
)

export default ColumnContent
