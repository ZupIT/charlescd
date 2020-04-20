import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import { Translate, ModalFullContent } from 'components'
import { Button, THEME } from 'components/Button'
import { Editor } from 'containers/Editor'
import Resume from 'containers/Resume'
import { shortDescription } from './helpers'
import { StyledHypothesis } from './styled'

const HypothesisDescription = (props) => {
  const { description, onChange } = props
  const [openEditor, toggleEditor] = useState(false)
  const resume = shortDescription(description || '')

  const handleDescription = (resumeFn, data) => {
    if (data) {
      onChange(data)
      resumeFn()
    }

    toggleEditor(!openEditor)
  }

  const decideContent = (showContent) => {
    if (showContent && description) {
      toggleEditor(true)
    }
  }

  const renderEditor = resumeFn => (
    <ModalFullContent onClose={() => handleDescription(resumeFn, description)}>
      <Editor
        initialContent={description}
        onSave={data => handleDescription(resumeFn, data)}
      />
    </ModalFullContent>
  )


  return (
    <StyledHypothesis.Content>
      <Resume
        initial={!isEmpty(description)}
        name="general.description"
        tags={[resume]}
        onChange={decideContent}
      >
        {resumeFn => (
          <Fragment>
            <StyledHypothesis.DescWrapper>
              <StyledHypothesis.DescLabel>
                <Translate id="general.description" />:
              </StyledHypothesis.DescLabel>
              <Button
                margin="10px 0"
                theme={THEME.OUTLINE}
                onClick={() => toggleEditor(true)}
              >
                <StyledHypothesis.PlusIcon />
                <Translate id="hypothesis.button.desc" />
              </Button>
              <StyledHypothesis.DescInfo>
                <Translate id="general.addLater" />
              </StyledHypothesis.DescInfo>
            </StyledHypothesis.DescWrapper>
            {openEditor && renderEditor(resumeFn)}
          </Fragment>
        )}
      </Resume>
    </StyledHypothesis.Content>
  )
}

HypothesisDescription.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default HypothesisDescription
