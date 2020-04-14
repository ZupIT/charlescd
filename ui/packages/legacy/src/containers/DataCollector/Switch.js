import React from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import ObjectPath from 'object-path'
import Switch from 'components/Switch'
import { StyledDataCollector } from './styled'
import { formatSwitchText } from './helpers'

const SwitchComponent = ({ jsonResume, updateJsonResume, fields }) => (
  <StyledDataCollector.SwitchsContainer>
    <StyledDataCollector.FieldsTitle
      secondary
      text="jsonData.select"
    />
    {!isEmpty(jsonResume) && map(fields.fields, field => (
      <StyledDataCollector.SwitchContainer key={field}>
        <Switch
          key={field + fields.metadata.name}
          value={ObjectPath.get(jsonResume, field)}
          onChange={value => updateJsonResume(value, field)}
        />
        <span>{formatSwitchText(field)}</span>
      </StyledDataCollector.SwitchContainer>
    ))}
  </StyledDataCollector.SwitchsContainer>
)

SwitchComponent.defaultProps = {
  jsonResume: {},
  fields: {
    fields: [],
  },
}

SwitchComponent.propTypes = {
  jsonResume: PropTypes.object,
  updateJsonResume: PropTypes.func.isRequired,
  fields: PropTypes.object,
}

export default SwitchComponent
