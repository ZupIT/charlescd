import React, { useState } from 'react'
import { injectIntl } from 'react-intl'
import { convertToRaw, EditorState, getDefaultKeyBinding } from 'draft-js'
import map from 'lodash/map'
import trim from 'lodash/trim'
import isEmpty from 'lodash/isEmpty'
import orderBy from 'lodash/orderBy'
import { i18n } from 'core/helpers/translate'
import { KEY_CODE_ENTER } from 'core/helpers/constants'
import RichTextField from 'containers/Comments/RichTextField'
import { getUserProfileData } from 'core/helpers/profile'
import { StyledComments } from './styled'


const Comments = ({ intl, comments, onComment }) => {
  const [commentText, setComment] = useState(EditorState.createEmpty())
  const [, hideAction] = useState(true)
  const checkComment = comment => !isEmpty(trim(comment))

  const myKeyBindingFn = (e) => {
    if (e.keyCode === KEY_CODE_ENTER) {
      return 'myeditor-save'
    }

    return getDefaultKeyBinding(e)
  }

  const getText = () => {
    const { blocks } = convertToRaw(commentText.getCurrentContent())

    return blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n')
  }

  const handleOnComment = () => {
    const comment = getText()

    setComment(EditorState.createEmpty())
    checkComment(comment) && onComment(comment)
  }

  const handleKeyCommand = (command) => {
    if (command === 'myeditor-save') {
      return handleOnComment()
    }

    return 'not-handled'
  }

  const sortedComments = () => {
    return orderBy(comments, o => o.createdAt, ['desc'])
  }

  const onChange = (data) => {
    setComment(data)
    hideAction(!checkComment(getText()))
  }

  return (
    <StyledComments.Wrapper>
      <StyledComments.WrapperPhotoInput>
        <StyledComments.AuthorImage.OnInput src={getUserProfileData('photoUrl')} alt="img" />
        <StyledComments.InputWrapper>
          <RichTextField
            editorState={commentText}
            onChange={onChange}
            placeholder={i18n(intl, 'general.comment.placeholder')}
            handleKeyEditor={handleKeyCommand}
            handleMyKeyBinding={myKeyBindingFn}
          />
        </StyledComments.InputWrapper>
      </StyledComments.WrapperPhotoInput>
      <StyledComments.List>
        { map(sortedComments(), (({ comment, author: { name, photoUrl } }, index) => (
          <StyledComments.ListItem key={index}>
            <StyledComments.AuthorImage.OnList src={photoUrl} />
            <StyledComments.Comment>
              <StyledComments.AuthorName>
                { name }
              </StyledComments.AuthorName>
              { comment }
            </StyledComments.Comment>
          </StyledComments.ListItem>
        )))}
      </StyledComments.List>
    </StyledComments.Wrapper>
  )
}

export default injectIntl(Comments)
