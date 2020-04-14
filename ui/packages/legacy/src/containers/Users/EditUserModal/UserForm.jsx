import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Avatar from 'components/Avatar'
import { Translate } from 'components'
import MailAtSVG from 'core/assets/svg/mailAt.svg'
import PictureSVG from 'core/assets/svg/picture.svg'
import { KEY_CODE_ENTER } from 'core/helpers/constants'
import Styled from './styled'

const UserForm = ({ user, onSave }) => {
  const { register, getValues } = useForm()

  const onSetName = () => {
    const values = getValues()
    onSave(values)
  }

  const onKeyUp = ({ target, keyCode }) => {
    keyCode === KEY_CODE_ENTER && target.blur()
  }

  return (
    <>
      <Styled.LayerUsername icon={<Avatar src={user?.photoUrl} />}>
        <Styled.Input
          resume
          type="text"
          name="name"
          autoComplete="off"
          onBlur={onSetName}
          onKeyUp={onKeyUp}
          defaultValue={user?.name}
          properties={register({ required: true })}
        />
      </Styled.LayerUsername>
      <Styled.ContentLayer icon={<MailAtSVG />}>
        <Styled.LayerTitle>
          <Translate id="permissions.users.inputEmail" />
        </Styled.LayerTitle>
        <Styled.Input
          resume
          type="text"
          name="email"
          autoComplete="off"
          placeholder="Put an user name"
          onBlur={onSetName}
          onKeyUp={onKeyUp}
          defaultValue={user?.email}
          properties={register({ required: true })}
        />

      </Styled.ContentLayer>
      <Styled.ContentLayer icon={<PictureSVG />}>
        <Styled.LayerTitle>
          <Translate id="permissions.users.inputImage" />
        </Styled.LayerTitle>
        <Styled.Input
          resume
          type="text"
          name="photoUrl"
          autoComplete="off"
          placeholder="Put an avatar image URL"
          onBlur={onSetName}
          onKeyUp={onKeyUp}
          defaultValue={user?.photoUrl}
          properties={register({ required: true })}
        />
      </Styled.ContentLayer>
    </>
  )
}

UserForm.defaultProps = {
  user: { name: '' },
}

UserForm.propTypes = {
  user: PropTypes.object,
  onSave: PropTypes.func.isRequired,
}

export default memo(UserForm)
