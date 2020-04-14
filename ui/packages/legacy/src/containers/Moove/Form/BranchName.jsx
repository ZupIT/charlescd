import React from 'react'
import snakeCase from 'lodash/snakeCase'
import { Translate } from 'components'
import { FinalForm } from 'containers/FinalForm'
import Resume from 'containers/Resume'
import PropTypes from 'prop-types'
import { StyledForm } from './styled'

const BranchName = ({ value, nameValue, onComplete }) => {
  const handleOnSubmit = ({ branchName }, resumeFn) => {
    onComplete(branchName)
    resumeFn()
  }

  const normalizeName = (name) => {
    return snakeCase(name)
  }

  return (
    <StyledForm.Wrapper>
      <Resume initial={!!value} name="general.branchName" tags={[value]}>
        { resumeFn => (
          <FinalForm
            initialValues={{ branchName: normalizeName(nameValue) }}
            onSubmit={values => handleOnSubmit(values, resumeFn)}
          >
            {() => (
              <StyledForm.Name.Wrapper>
                <StyledForm.Name.Input
                  label="moove.create.inputBranchName"
                  name="branchName"
                  properties={{
                    autoComplete: 'off',
                  }}
                />
                <StyledForm.Name.Button type="submit">
                  <Translate id="general.ok" />
                </StyledForm.Name.Button>
              </StyledForm.Name.Wrapper>
            )}
          </FinalForm>
        )}
      </Resume>
    </StyledForm.Wrapper>
  )
}

BranchName.propTypes = {
  value: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
}

BranchName.defaultProps = {
  value: '',
}

export default BranchName
