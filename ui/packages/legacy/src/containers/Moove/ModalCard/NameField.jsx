import React from 'react'
import ContentLayer from 'components/ContentLayer'
import SidebarSVG from 'core/assets/svg/sidebar.svg'
import { StyledMoove } from '../styled'

const NameField = ({ register, card, onKeyUp }) => {
  return (
    <ContentLayer icon={<SidebarSVG />} margin="0 0 40px" center>
      <StyledMoove.View.Input
        resume
        type="text"
        name="name"
        onKeyUp={onKeyUp}
        defaultValue={card?.name}
        autoComplete="off"
        properties={register({ required: true })}
      />
    </ContentLayer>
  )
}

export default NameField
