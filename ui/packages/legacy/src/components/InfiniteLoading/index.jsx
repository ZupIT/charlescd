import React from 'react'
import Styled from './styled'

const InfiniteLoading = ({ isisLoadingMore, children }) => {
  return (
    <div>
      { children }
      <Styled.Loading display={isisLoadingMore} />
    </div>
  )
}

export default InfiniteLoading
