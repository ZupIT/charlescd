import React from 'react'
import PropTypes from 'prop-types'
import Styled from './styled'

const Card = (props) => {
  const { body, onClick, header, footer, className } = props

  return (
    <Styled.Wrapper
      className={className}
      onClick={onClick}
    >
      <Styled.Header>
        { header }
      </Styled.Header>
      <Styled.Body>
        { body }
      </Styled.Body>
      <Styled.Footer>
        { footer }
      </Styled.Footer>
    </Styled.Wrapper>
  )
}

Card.propTypes = {
  header: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  body: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClick: PropTypes.func,
  className: PropTypes.string,
}

Card.defaultProps = {
  header: <></>,
  body: <></>,
  footer: <></>,
  onClick: null,
  className: '',
}

export default Card
