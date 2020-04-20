import React from 'react'
import PropTypes from 'prop-types'
import { Translate } from 'components'
import WarningSVG from 'core/assets/svg/darwin-warning.svg'
import { getAttentionMessage } from './helpers'
import { SEGMENTS_TYPE, MATCHER_TYPE } from './constants'
import Styled from './styled'

const AttentionMessage = ({ onCancel, onContinue, matcherType, segmentType }) => {

  const attentionMessageText = getAttentionMessage(matcherType, segmentType)

  return (
    <Styled.Warning>
      <div>
        <WarningSVG />
      </div>
      <Styled.WarningMessage>
        <h3><Translate id="general.attention" />!</h3>
        <p><Translate id={attentionMessageText} /></p>
        <Styled.WarningButtonDiv>
          <Styled.WarningButton onClick={onCancel} warning>
            <Translate id="general.cancel" />
          </Styled.WarningButton>
          <Styled.WarningButton onClick={onContinue}>
            <Translate id="general.continue" />
          </Styled.WarningButton>
        </Styled.WarningButtonDiv>
      </Styled.WarningMessage>
    </Styled.Warning>
  )
}

AttentionMessage.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  matcherType: PropTypes.oneOf([MATCHER_TYPE.REGULAR, MATCHER_TYPE.SIMPLE_KV]).isRequired,
  segmentType: PropTypes.oneOf([SEGMENTS_TYPE.MANUALLY, SEGMENTS_TYPE.IMPORT_CSV]).isRequired,
}

export default AttentionMessage
