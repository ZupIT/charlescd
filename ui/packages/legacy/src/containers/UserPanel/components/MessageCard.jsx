import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { dateFrom } from 'core/helpers/date'
import { StyledMessageCard } from './styled'

const MessageCard = (props) => {
  const { message, onClick } = props
  const { title, createdAt, authorAvatar, read } = message

  return (
    <Fragment>
      <StyledMessageCard.MessageCardContainer read={read} onClick={() => onClick(message)}>
        <StyledMessageCard.MessageCardPictureBox>
          <StyledMessageCard.MessageCardPicture
            src={authorAvatar}
            width="50"
            height="50"
          />
        </StyledMessageCard.MessageCardPictureBox>
        <StyledMessageCard.MessageCardTextContainer>
          <StyledMessageCard.MessageCardTextName>
            {title}
          </StyledMessageCard.MessageCardTextName>
          <StyledMessageCard.MessageCardTime>
            {dateFrom(createdAt)}
          </StyledMessageCard.MessageCardTime>
        </StyledMessageCard.MessageCardTextContainer>
      </StyledMessageCard.MessageCardContainer>
    </Fragment>
  )
}

MessageCard.propTypes = {
  message: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default MessageCard
