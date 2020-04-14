import React from 'react'
import Comments from 'containers/Comments'
import { ContentLayer } from 'components'
import CommentSVG from 'core/assets/svg/comment.svg'
import { StyledMoove } from '../styled'
import { Styled } from './styled'

const CommentsField = ({ commentsLoading, onChange, card }) => {
  return (
    <>
      <ContentLayer icon={<CommentSVG />} margin="0 0 20px">
        <Styled.ViewTitle text="Comments" />
      </ContentLayer>
      <StyledMoove.Comments>
        <Comments
          isLoading={commentsLoading}
          comments={card?.comments}
          onComment={onChange}
        />
      </StyledMoove.Comments>
    </>
  )
}

export default CommentsField
