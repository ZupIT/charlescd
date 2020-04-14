import React from 'react'
import { Translate } from 'components'
import { StyledHelpTab } from './styled'

const HelpTab = () => (
  <StyledHelpTab.HelpText>
    <Translate id="general.toolbar.emptyMessages" />
  </StyledHelpTab.HelpText>
)

export default HelpTab
