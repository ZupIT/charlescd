import React from 'react'
import { Translate } from 'components'
import { FinalForm } from 'containers/FinalForm'
import Resume from 'containers/Resume'
import PropTypes from 'prop-types'
import { StyledForm } from './styled'

const Name = ({ value, onComplete }) => {
  const handleOnSubmit = ({ name }, resumeFn) => {
    onComplete(name)
    resumeFn()
  }

  return (
    <StyledForm.Wrapper>
      <Resume initial={!!value} name="general.name" tags={[value]}>
        {resumeFn => (
          <FinalForm
            initialValues={{ name: value }}
            onSubmit={values => handleOnSubmit(values, resumeFn)}
          >
            {() => (
              <StyledForm.Name.Wrapper>
                <StyledForm.Name.Input
                  label="moove.create.inputName"
                  name="name"
                  validate="required"
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

Name.propTypes = {
  value: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
}

Name.defaultProps = {
  value: '',
}

export default Name
