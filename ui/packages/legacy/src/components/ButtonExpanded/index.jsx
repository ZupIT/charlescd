import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { i18n } from 'core/helpers/translate'
import { Styled } from './styled'

const ButtonExpanded = (props) => {
  const { icon, label, onClick, intl, reversed, disabled } = props

  const action = () => !disabled && onClick()

  return (
    <Styled.Button
      disabled={disabled}
      reversed={reversed}
      onClick={action}
    >
      <Styled.Icon> { icon } </Styled.Icon>
      <Styled.Span> { i18n(intl, label) } </Styled.Span>
    </Styled.Button>
  )
}

ButtonExpanded.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  label: PropTypes.string,
  intl: intlShape.isRequired,
  onClick: PropTypes.func,
  reversed: PropTypes.bool,
  disabled: PropTypes.bool,
}

ButtonExpanded.defaultProps = {
  icon: null,
  onClick: null,
  label: '',
  reversed: false,
  disabled: false,
}

export default injectIntl(ButtonExpanded)
