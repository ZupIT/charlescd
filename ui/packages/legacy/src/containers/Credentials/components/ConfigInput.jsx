import React from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import { StyledConfig } from 'containers/Credentials/styled'
import { Button, Translate } from 'components'
import Resume from 'containers/Resume'
import { FinalForm } from 'containers/FinalForm'

const ConfigInput = (props) => {
  const { label, field, value, resumeName, onClick } = props

  const onSubmit = (newValue, resumeFn) => {
    onClick(field, newValue)
    resumeFn()
  }

  return (
    <Resume initial={!isEmpty(value)} name={resumeName} tags={[value]}>
      {resumeFn => (
        <FinalForm
          initialValues={{ inputName: value }}
          onSubmit={({ inputName }) => onSubmit(inputName, resumeFn)}
        >
          {() => (
            <StyledConfig.Form>
              <StyledConfig.Input
                name="inputName"
                label={label}
                properties={{ autoComplete: 'off' }}
                validate="required"
              />
              <Button type="submit" margin="0 15px">
                <Translate id="general.ok" />
              </Button>
            </StyledConfig.Form>
          )}
        </FinalForm>
      )}
    </Resume>
  )
}

ConfigInput.defaultProps = {
  value: '',
}

ConfigInput.propTypes = {
  label: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  resumeName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string,
}

export default ConfigInput
