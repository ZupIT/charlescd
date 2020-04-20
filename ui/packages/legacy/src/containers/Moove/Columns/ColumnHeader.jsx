import React from 'react'
import get from 'lodash/get'
import { Translate } from 'components'
import { columnsInfos } from '../helper'
import Styled from './styled'

const ColumnHeader = ({ id, list }) => {

  return (
    <Styled.Header
      color={get(columnsInfos(id), 'color')}
    >
      <Translate id={get(columnsInfos(id), 'title')} />
      { list && <span>{list.length}</span> }
    </Styled.Header>
  )
}

export default ColumnHeader
