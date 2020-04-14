import React from 'react'
import PropTypes from 'prop-types'
import { CodeEditor } from 'components'
import { Field } from 'react-final-form'

const CodeEditorField = ({ name, parse, ...props }) => (
  <Field name={name} parse={parse}>
    {({ input }) => {
      return (
        <CodeEditor
          name={input.name}
          onBlur={input.onBlur}
          onChange={input.onChange}
          onFocus={input.onFocus}
          value={input.value}
          {...props}
        />
      )
    }}
  </Field>
)

CodeEditorField.defaultProps = {
  name: null,
}

CodeEditorField.propTypes = {
  name: PropTypes.string,
}

export default CodeEditorField
