import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Editor } from 'draft-js'
import 'draft-js/dist/Draft.css'

const RichTextField = (props) => {
  const { editorState, onChange, placeholder, handleKeyEditor, handleMyKeyBinding } = props

  return (
    <Fragment>
      <Editor
        editorState={editorState}
        onChange={onChange}
        placeholder={placeholder}
        handleKeyCommand={handleKeyEditor}
        keyBindingFn={handleMyKeyBinding}
      />
    </Fragment>
  )
}

RichTextField.defaultProps = {
  editorState: {},
  onChange: null,
  placeholder: '',
  handleKeyEditor: null,
  handleMyKeyBinding: null,
}

RichTextField.propTypes = {
  editorState: PropTypes.object,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  handleKeyEditor: PropTypes.func,
  handleMyKeyBinding: PropTypes.func,
}

export default RichTextField
