import React, { Fragment, useState } from 'react'
import map from 'lodash/map'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import OutsideClickHandler from 'react-outside-click-handler'
import PreviewLoader from './Loaders/PreviewLoader'
import MembersLoader from './Loaders/MembersLoader'
import Styled from './styled'

const ModalAddUser = (props) => {
  const { toggleModal, members, toggleMember } = props
  const [preview, setPreview] = useState(null)

  const checkToggled = (user) => {
    return !isEmpty(filter(members, item => item.id === user.id))
  }

  const renderPreview = () => (
    <Fragment>
      <Styled.Member big src={preview.photoUrl} />
      { preview.name }
    </Fragment>
  )

  const renderMember = (index, user, checked) => (
    <Styled.Avatar
      key={index}
      onClick={() => toggleMember(user)}
      onMouseOver={() => setPreview(user)}
      onMouseLeave={() => setPreview(null)}
    >
      <Styled.Member
        checked={checked}
        alt={user.name}
        src={user.photoUrl}
      />
      { checked && <Styled.Check /> }
    </Styled.Avatar>
  )

  const renderMembers = () => (
    <Fragment>
      { map(props.users, (user, index) => renderMember(index, user, checkToggled(user))) }
    </Fragment>
  )

  return (
    <OutsideClickHandler
      display="flex"
      onOutsideClick={() => {
        toggleModal(false)
      }}
    >
      <Styled.Wrapper>
        <Styled.Members>
          { props.users ? renderMembers() : <MembersLoader /> }
        </Styled.Members>
        <Styled.Preview>
          { preview ? renderPreview() : <PreviewLoader /> }
        </Styled.Preview>
      </Styled.Wrapper>
    </OutsideClickHandler>
  )
}

export default ModalAddUser
