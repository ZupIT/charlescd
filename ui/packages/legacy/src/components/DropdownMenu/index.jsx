import React, { useRef, useState } from 'react'
import map from 'lodash/map'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { useOnClickOutside } from 'core/helpers/hooks'
import { i18n } from 'core/helpers/translate'
import MoreSVG from 'core/assets/svg/more.svg'
import { Styled } from './styled'

const DropdownMenu = (props) => {
  const { options, intl, dark, style } = props
  const [display, toggleDisplay] = useState(false)
  const wrapperRef = useRef(null)

  useOnClickOutside(wrapperRef, () => toggleDisplay(false))

  const handleClickTooltip = (e) => {
    e.stopPropagation()
    toggleDisplay(false)
  }

  const renderTooltip = () => (
    <Styled.Tooltip onClick={handleClickTooltip} dark={dark}>
      { map(options, (option, index) => (
        <Styled.Action key={index} onClick={option.action}>
          { i18n(intl, option.label) }
        </Styled.Action>
      )) }
    </Styled.Tooltip>
  )

  const handleOnClick = (e) => {
    e.stopPropagation()
    toggleDisplay(!display)
  }

  return (
    <Styled.Wrapper
      style={style}
      ref={wrapperRef}
    >
      <Styled.Button
        onClick={handleOnClick}
        dark={dark}
      >
        <MoreSVG />
      </Styled.Button>
      { display && renderTooltip() }
    </Styled.Wrapper>
  )
}

DropdownMenu.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      action: PropTypes.func,
    }),
  ),
}

DropdownMenu.defaultProps = {
  options: [{
    label: '',
    action: () => null,
  }],
}

export default injectIntl(DropdownMenu)
