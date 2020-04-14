import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'

const FinalForm = (props) => {
  const { children, ...rest } = props

  return (
    <Form {...rest}>
      {({ handleSubmit, ...otherProps }) => (
        <form onSubmit={handleSubmit}>
          { children({ handleSubmit, ...otherProps }) }
        </form>
      )}
    </Form>
  )
}

FinalForm.propTypes = {
  children: PropTypes.func.isRequired,
}

export default FinalForm
