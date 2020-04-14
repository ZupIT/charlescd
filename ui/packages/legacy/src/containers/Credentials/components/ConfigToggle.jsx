import React from 'react'
import PropTypes from 'prop-types'
import { Translate, Toggle } from 'components'
import { COLORS } from 'core/assets/themes'
import Resume from 'containers/Resume'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { StyledConfig } from 'containers/Credentials/styled'

const ConfigToggle = (props) => {
  const { resumeName, label, field, selected, tag, onSelect, items, valueFrom } = props

  const handleClick = (value, resumeFn) => {
    onSelect(field, value)
    resumeFn && resumeFn()
  }

  return (
    <Resume initial={!isEmpty(selected)} name={resumeName} tags={[tag || selected]}>
      {resumeFn => (
        <StyledConfig.Block>
          <Translate id={label} />
          <StyledConfig.Flex>
            {
              map(items, (item, idx) => (
                <Toggle
                  key={`${item.name}-${idx}`}
                  name={item.name}
                  color={COLORS.PRIMARY}
                  onClick={() => handleClick(item[valueFrom], resumeFn)}
                  selected={selected === item[valueFrom]}
                />
              ))
            }
          </StyledConfig.Flex>
        </StyledConfig.Block>
      )}
    </Resume>
  )
}

ConfigToggle.defaultProps = {
  selected: '',
  valueFrom: 'name',
  tag: '',
}

ConfigToggle.propTypes = {
  resumeName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  valueFrom: PropTypes.string,
  tag: PropTypes.string,
  selected: PropTypes.string,
}

export default ConfigToggle
