import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import Translate from 'components/Translate'
import ModalFullContent from 'components/ModalFullContent'
import { getRangeWords, removeHtmlTags } from 'core/helpers/regex'
import { Editor } from 'containers/Editor'
import Label from 'components/Label'
import { Button, THEME } from 'components/Button'
import Resume from 'containers/Resume'
import { StyledForm } from './styled'

const Description = ({ value, onComplete }) => {
  const [openEditor, toggleEditor] = useState(!!value)

  const handleOnSave = (editorValue, resumeFn) => {
    toggleEditor(!openEditor)
    onComplete(editorValue)
    resumeFn()
  }

  const renderEditor = resumeFn => (
    <ModalFullContent onClose={() => toggleEditor(!openEditor)}>
      <Editor
        initialContent={value}
        onClose={() => toggleEditor(!openEditor)}
        onSave={editorValue => handleOnSave(editorValue, resumeFn)}
      />
    </ModalFullContent>
  )

  return (
    <StyledForm.Wrapper>
      <Resume
        initial={!!value}
        name="general.description"
        tags={[getRangeWords(removeHtmlTags(value), '...')]}
      >
        {resumeFn => (
          <Fragment>
            <Label id="general.description" />
            <Button theme={THEME.OUTLINE} onClick={() => toggleEditor(!openEditor)}>
              <StyledForm.Description.Icon />
              <Translate id="moove.create.button.addDescription" />
            </Button>
            { openEditor && renderEditor(resumeFn) }
          </Fragment>
        )}
      </Resume>
    </StyledForm.Wrapper>
  )
}

Description.propTypes = {
  value: PropTypes.string,
  onComplete: PropTypes.func.isRequired,
}

Description.defaultProps = {
  value: '',
}

export default Description
