import React from 'react'
import PropTypes from 'prop-types'
import { StyledDataCollector, StyledReactJson } from './styled'

const JsonResume = ({ jsonResume }) => (
  <StyledDataCollector.JsonResume>
    <StyledDataCollector.JsonResumeTitle
      secondary
      text="jsonData.resume"
    />
    <StyledReactJson
      displayDataTypes={false}
      displayObjectSize={false}
      enableClipboard={false}
      theme="monokai"
      src={jsonResume}
    />
  </StyledDataCollector.JsonResume>
)

JsonResume.defaultProps = {
  jsonResume: {},
}

JsonResume.propTypes = {
  jsonResume: PropTypes.object,
}

export default JsonResume
