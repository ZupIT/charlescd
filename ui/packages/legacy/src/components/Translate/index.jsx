import PropTypes from 'prop-types'
import { intlShape, injectIntl } from 'react-intl'
import { i18n } from 'core/helpers/translate'
import { FORMAT } from './constants'

const Translate = (props) => {
  const { intl, id, values, format } = props
  const textI18n = i18n(intl, id, values)

  const text = {
    [FORMAT.DEFAULT]: textI18n,
    [FORMAT.LOWER_CASE]: textI18n.toLowerCase(),
    [FORMAT.UPPER_CASE]: textI18n.toUpperCase(),
    [FORMAT.CAPITALIZE]: textI18n.replace(/^\w/, c => c.toUpperCase()),
  }

  return text[format]
}

Translate.defaultProps = {
  values: {},
  format: FORMAT.DEFAULT,
}

Translate.propTypes = {
  intl: intlShape.isRequired,
  id: PropTypes.string.isRequired,
  format: PropTypes.oneOf([
    FORMAT.DEFAULT,
    FORMAT.CAPITALIZE,
    FORMAT.UPPER_CASE,
    FORMAT.LOWER_CASE,
  ]),
  values: PropTypes.object,
}

export {
  FORMAT,
}

export default injectIntl(Translate)
