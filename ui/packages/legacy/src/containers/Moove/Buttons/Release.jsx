import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'components/Translate'
import ReleaseButtonSVG from 'core/assets/svg/release-icon.svg'
import { StyledMooveButtons } from './styled'

const ReleaseButton = ({ disabled, loading, onClick }) => (
  <StyledMooveButtons.Wrapper.Release
    properties={{ disabled: loading || disabled }}
    onClick={onClick}
    isLoading={loading}
  >
    <ReleaseButtonSVG />
    { loading ? <Translate id="moove.relase.generatingRelease" /> : (
      <Translate id="moove.button.generateRelease" />
    ) }
  </StyledMooveButtons.Wrapper.Release>
)

ReleaseButton.defaultProps = {
  onClick: null,
  loading: false,
  disabled: false,
}

ReleaseButton.propTypes = {
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default ReleaseButton
