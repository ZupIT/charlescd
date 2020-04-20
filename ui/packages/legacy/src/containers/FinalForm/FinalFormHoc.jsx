import React from 'react'
import { Field } from 'react-final-form'
import { required } from 'core/helpers/validate'

const rule = {
  required,
}

const composeValidators = validators => (value, allValues) => {
  return validators.reduce((error, validator) => {
    return error || (
      typeof validator === 'string'
        ? rule[validator](value, allValues)
        : validator(value, allValues)
    )
  }, undefined)
}

const FinalFormHoc = (Input) => {
  const customValidate = (props) => {
    const { validate } = props

    if (!validate) return false

    if (Array.isArray(validate)) {
      return composeValidators(validate)
    }

    return composeValidators([validate])
  }

  return (props) => {
    return (
      <Field name={props.name} type={props.type} validate={customValidate(props)}>
        {fieldState => <Input {...props} {...fieldState} />}
      </Field>
    )
  }
}

export default FinalFormHoc
