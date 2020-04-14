import React from 'react'
import { PropTypes } from 'prop-types'
import Plus from 'core/assets/svg/plus.svg'
import { Translate } from 'components'
import { IconButton, THEME } from 'components/IconButton'
import { StyledHeaderNav } from './styled'

const HeaderNav = (props) => {
  const { user, onClick, actionTitle, actionLabel } = props

  return (
    <StyledHeaderNav.Wrapper>
      <StyledHeaderNav.Row>
        { user && <StyledHeaderNav.Title primary textParams={{ userName: user.name }} text="general.label.welcome" /> }
        <StyledHeaderNav.Title primary text={actionTitle} />
      </StyledHeaderNav.Row>
      { onClick && (
      <StyledHeaderNav.Row>
        <IconButton
          icon={<Plus />}
          theme={THEME.DEFAULT}
          onClick={onClick}
        >
          <Translate id={actionLabel} />
        </IconButton>
      </StyledHeaderNav.Row>
      )}
    </StyledHeaderNav.Wrapper>
  )
}

HeaderNav.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
  actionTitle: PropTypes.string.isRequired,
  actionLabel: PropTypes.string.isRequired,
}

HeaderNav.defaultProps = {
  onClick: null,
}

export default HeaderNav
