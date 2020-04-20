import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'components/Translate'
import { COLORS } from 'core/assets/themes'
import LegoIcon from 'core/assets/svg/lego.svg'
import { StyledToggle } from './styled'

const Toggle = (props) => {
  const { selected, color, icon, name, onClick, small, className } = props

  return (
    <StyledToggle.Wrapper
      selected={selected}
      onClick={onClick}
      small={small}
      className={className}
    >
      <StyledToggle.Icon
        color={color}
        selected={selected}
        small={small}
      >
        {icon}
      </StyledToggle.Icon>
      <StyledToggle.Title
        selected={selected}
        small={small}
      >
        <Translate id={name} />
      </StyledToggle.Title>
    </StyledToggle.Wrapper>
  )
}

Toggle.defaultProps = {
  selected: false,
  color: COLORS.COLOR_BLACK,
  icon: <LegoIcon />,
  name: '',
  onClick: null,
}

Toggle.propTypes = {
  selected: PropTypes.bool,
  color: PropTypes.string,
  icon: PropTypes.node,
  name: PropTypes.string,
  onClick: PropTypes.func,
}

export default Toggle
