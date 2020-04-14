import React from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-chaos'

const CodeEditor = ({ mode, value, readOnly, name, onBlur, onChange, onFocus }) => (
  <AceEditor
    name={name}
    mode={mode}
    theme="chaos"
    value={value}
    width="100%"
    height="100%"
    showPrintMargin={false}
    setOptions={{ useWorker: false, readOnly }}
    editorProps={{ $blockScrolling: true }}
    onBlur={onBlur}
    onChange={onChange}
    onFocus={onFocus}
  />
)

CodeEditor.defaultProps = {
  mode: 'json',
  readOnly: false,
  name: '',
  onBlur: null,
  onChange: null,
  onFocus: null,
}

CodeEditor.propTypes = {
  mode: PropTypes.string,
  value: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
}

export default CodeEditor
