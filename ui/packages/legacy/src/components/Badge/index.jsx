import React from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import startCase from 'lodash/startCase'
import { injectIntl, intlShape } from 'react-intl'
import { i18n } from '../../core/helpers/translate'
import Styled from './styled'

const Badge = (props) => {
  const {
    status, intl, className,
  } = props

  return (
    <Styled.Badge
      status={status}
      className={className}
    >
      {i18n(intl, startCase(capitalize(status)))}
    </Styled.Badge>
  )
}

Badge.propTypes = {
  intl: intlShape.isRequired,
  status: PropTypes.string,
}

Badge.defaultProps = {
  status: null,
}

export default injectIntl(Badge)
