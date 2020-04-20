import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { i18n } from '../../core/helpers/translate'
import { StyledPrimaryTitle, StyledSubTitle, StyledDefaultTitle } from './styled'

const Title = (props) => {
  const { primary, secondary, className, intl, text, textParams } = props

  const renderTitle = () => {
    const intlText = i18n(intl, text, textParams)

    if (primary) return <StyledPrimaryTitle className={className}>{intlText}</StyledPrimaryTitle>
    if (secondary) return <StyledSubTitle className={className}>{intlText}</StyledSubTitle>

    return <StyledDefaultTitle className={className}>{intlText}</StyledDefaultTitle>
  }

  return renderTitle()
}

Title.defaultProps = {
  primary: false,
  secondary: false,
  textParams: {},
}

Title.propTypes = {
  text: PropTypes.string.isRequired,
  textParams: PropTypes.object,
  intl: intlShape.isRequired,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
}

export default injectIntl(Title)
