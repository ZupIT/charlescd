import React from 'react'
import PropTypes from 'prop-types'
import CodeSVG from 'core/assets/svg/code.svg'
import AlignLeftSVG from 'core/assets/svg/align-left.svg'
import { Toggle, Translate } from 'components'
import { COLORS } from 'core/assets/themes'
import Styled from './styled'
import { ACTIONS } from './constants'

const Actions = ({ selectedAction, setSelectedAction }) => (
  <>
    <div><small><Translate id="circle.circleMatcher.options" /></small></div>
    <Styled.Actions>
      <Toggle
        color={COLORS.PRIMARY}
        icon={<AlignLeftSVG />}
        name="circle.circleMatcher.default"
        onClick={() => setSelectedAction(ACTIONS.DEFAULT)}
        selected={selectedAction === ACTIONS.DEFAULT}
      />
      <Toggle
        name="circle.circleMatcher.json"
        icon={<CodeSVG />}
        color={COLORS.PRIMARY}
        onClick={() => setSelectedAction(ACTIONS.EDIT_JSON)}
        selected={selectedAction === ACTIONS.EDIT_JSON}
      />
    </Styled.Actions>
  </>
)

Actions.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
  selectedAction: PropTypes.oneOf([ACTIONS.DEFAULT, ACTIONS.EDIT_JSON]).isRequired,
}

export default Actions
