import React from 'react'
import PropTypes from 'prop-types'
import { StyledContent } from './styled'

const ContentLayer = (props) => {
  const { center, icon, children, margin, className } = props

  return (
    <StyledContent.Wrapper className={className} center={center} margin={margin}>
      <StyledContent.Icon>
        { icon }
      </StyledContent.Icon>
      <StyledContent.Content>
        { children }
      </StyledContent.Content>
    </StyledContent.Wrapper>
  )
}

ContentLayer.defaultProps = {
  margin: '0',
  className: '',
  icon: null,
}

ContentLayer.propTypes = {
  margin: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.node.isRequired,
}

export default ContentLayer
