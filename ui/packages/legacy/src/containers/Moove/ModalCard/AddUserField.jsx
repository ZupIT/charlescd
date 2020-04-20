import React from 'react'
import { ContentLayer } from 'components'
import PlusWithBorder from 'core/assets/svg/plusWithBorder.svg'
import map from 'lodash/map'
import { SIZE } from 'components/Button'
import Avatar from 'components/Avatar'
import MembersIcon from 'core/assets/svg/members.svg'
import ModalAddUser from '../ModalAddUser'
import { StyledMoove } from '../styled'
import { Styled } from './styled'

const AddUserField = ({
  users,
  card,
  toggleMember,
  toggleDisplay,
  display,
}) => {
  return (
    <>
      <ContentLayer icon={<MembersIcon />} margin="0 0 40px">
        <Styled.ViewTitle text="Members" />

        <StyledMoove.View.MembersContent>
          { display
              && (
                <ModalAddUser
                  cardId={card.id}
                  members={card.members}
                  users={users}
                  toggleMember={toggleMember}
                  toggleModal={toggleDisplay}
                />
              )
            }
        </StyledMoove.View.MembersContent>
        <StyledMoove.Members>
          <Styled.SpaceBetween>
            <StyledMoove.View.ButtonAdd
              size={SIZE.SMALL}
              onClick={() => toggleDisplay(true)}
            >
              <StyledMoove.View.Icon>
                <PlusWithBorder />
              </StyledMoove.View.Icon>
            </StyledMoove.View.ButtonAdd>
          </Styled.SpaceBetween>
          { map(card.members, (member, index) => (
            <Avatar key={index} src={member.photoUrl} />
          )) }
        </StyledMoove.Members>
      </ContentLayer>
    </>
  )
}

export default AddUserField
