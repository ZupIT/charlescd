import React, { useState, useEffect, Fragment } from 'react'
import PropTypes from 'prop-types'
import MediumEditor from 'medium-editor'
import { injectIntl, intlShape } from 'react-intl'
import LineActions from 'containers/Editor/LineActions'
import { i18n } from 'core/helpers/translate'
import { Button, THEME } from 'components/Button'
import Translate from 'components/Translate'
import { StyledEditorWrapper, StyledEditor } from './styled'
import { editorConfig, editorModeView } from './helpers'
import { MODE, EDITOR } from './constants'

const Editor = (props) => {
  const { intl, onSave, initialContent, mode } = props
  const [editor, setEditor] = useState()

  useEffect(() => {
    if (!editor) {

      const configs = {
        ...editorConfig,
        placeholder: {
          text: i18n(intl, 'general.editor.placeholder'),
        },
      }

      const mediumEditor = new MediumEditor('.editor', configs)
      mediumEditor.setContent(initialContent)

      if (mode === MODE.VIEW) {
        editorModeView(mediumEditor)
      }

      setEditor(mediumEditor)
    }

  }, [editor])

  const onClickSave = () => {
    onSave && onSave(editor.getContent(), editor)
  }

  return (
    <Fragment>
      <StyledEditorWrapper>
        {(editor && mode === MODE.EDIT) && <LineActions editor={editor} />}
        <StyledEditor className="editor" contentEditable="initial" />
      </StyledEditorWrapper>
      {(editor && mode === MODE.EDIT) && (
        <Button
          onClick={onClickSave}
          theme={THEME.OUTLINE}
          margin={`0 0 0 ${EDITOR.LEFT_SIZE}px`}
        >
          <Translate id="general.save" />
        </Button>
      )}
    </Fragment>
  )
}

Editor.defaultProps = {
  initialContent: '',
  mode: MODE.EDIT,
  onSave: null,
}

Editor.propTypes = {
  intl: intlShape.isRequired,
  initialContent: PropTypes.string,
  mode: PropTypes.oneOf([MODE.EDIT, MODE.VIEW]),
  onSave: PropTypes.func,
}

export default injectIntl(Editor)
