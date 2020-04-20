import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'components/Translate'
import { StyledMooveButtons } from './styled'

const CreateButton = ({ onClick, loading, icon }) => (
  <StyledMooveButtons.Wrapper.Create>
    <StyledMooveButtons.CreateInternalButton
      type="button"
      onClick={onClick}
      isLoading={loading}
    >
      { icon }
      <StyledMooveButtons.CreateText>
        <Translate id="moove.button.createCard" />
      </StyledMooveButtons.CreateText>
    </StyledMooveButtons.CreateInternalButton>
  </StyledMooveButtons.Wrapper.Create>
)

CreateButton.defaultProps = {
  onClick: null,
  loading: false,
  icon: null,
}

CreateButton.propTypes = {
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  icon: PropTypes.object,
}

export default CreateButton
