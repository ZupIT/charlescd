import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { i18n } from '../../core/helpers/translate'
import {
  StyledCard, StyledRow, StyledTitle,
} from './styled'

const Card = (props) => {
  const { shadowed, title, body, footer, small, large, onClick, intl, className, style } = props

  return (
    <StyledCard
      className={className}
      shadowed={shadowed}
      small={small}
      large={large}
      onClick={onClick}
      style={style}
    >
      <StyledRow>
        <StyledTitle>
          { i18n(intl, title) }
        </StyledTitle>
      </StyledRow>
      <StyledRow>
        { body }
      </StyledRow>
      <StyledRow>
        <section>
          { footer }
        </section>
      </StyledRow>
    </StyledCard>
  )
}

Card.propTypes = {
  body: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  shadowed: PropTypes.bool,
  intl: intlShape.isRequired,
  large: PropTypes.bool,
  onClick: PropTypes.func,
  small: PropTypes.bool,
}

Card.defaultProps = {
  body: <></>,
  footer: <></>,
  shadowed: false,
  small: false,
  large: false,
  onClick: null,
}

export default injectIntl(Card)
