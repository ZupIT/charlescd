import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import map from 'lodash/map'
import { i18n } from '../../core/helpers/translate'
import { StyledNav } from './styled'

const Nav = (props) => {
  const { items, intl } = props

  return (
    <StyledNav.Wrapper>
      { map(items, (item, key) => (
        <StyledNav.RouterLink key={key} to={item.path}>
          <StyledNav.Button active={item.active}>
            { i18n(intl, item.label) }
          </StyledNav.Button>
        </StyledNav.RouterLink>
      ))}
    </StyledNav.Wrapper>
  )
}

Nav.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      path: PropTypes.string,
      active: PropTypes.bool,
    }),
  ),
  intl: intlShape.isRequired,
}

Nav.defaultProps = {
  items: [{
    label: null,
    path: '#',
    active: false,
  }],
}

export default injectIntl(Nav)
