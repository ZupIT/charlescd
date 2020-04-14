import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import { useForm } from 'react-hook-form'
import { Title, Translate } from 'components'
import AddMemberSVG from 'core/assets/svg/add-member.svg'
import ViewPasswordSVG from 'core/assets/svg/view.svg'
import NoViewPasswordSVG from 'core/assets/svg/no-view.svg'
import { FormLoader } from 'containers/Circle/Loaders'
import { useRouter, useParams } from 'core/routing/hooks'
import { useSelector } from 'core/state/hooks'
import useUsers from './hooks/useUsers'
import Styled from './styled'

const CreateModal = ({ onClose }) => {
  const { register, setValue, getValues } = useForm()
  const [passTypeState, setPassTypeState] = useState('password')
  const history = useRouter()
  const { email } = useParams()
  const { item: user } = useSelector(({ users }) => users)
  const [{ userLoading }, { getUserData, createUser, updateUser }] = useUsers()
  const passInputRef = useRef(null)
  const refresh = true

  useEffect(() => {
    email && getUserData(atob(email))
  }, [email])

  const viewPassword = () => {
    if (passTypeState === 'password') {
      setPassTypeState('text')
    } else {
      setPassTypeState('password')
    }
  }

  const submit = () => {
    const service = !isEmpty(user?.id) ? updateUser(user.id, getValues()) : createUser(getValues())

    service
      .then(() => {
        onClose && onClose(refresh)
        history.goBack()
      })
  }

  const onCloseModal = () => {
    onClose && onClose()
    history.goBack()
  }

  const renderLoader = () => (
    <Styled.Form>
      <FormLoader />
    </Styled.Form>
  )

  const renderForm = () => (
    <Styled.Form>
      <Title text="permissions.users.createTitle" />
      <Styled.Input
        label="permissions.users.inputName"
        type="text"
        name="name"
        defaultValue={user?.name}
        onChange={({ target: { value } }) => setValue('name', value)}
        properties={register({ required: true })}
      />

      <Styled.Input
        label="permissions.users.inputEmail"
        type="text"
        name="email"
        defaultValue={user?.email}
        onChange={({ target: { value } }) => setValue('email', value.toLowerCase())}
        properties={register({ required: true })}
      />

      <Styled.Input
        label="permissions.users.inputImage"
        type="text"
        name="photoUrl"
        defaultValue={user?.photoUrl}
        onChange={({ target: { value } }) => setValue('photoUrl', value)}
        properties={register({ required: true })}
      />

      { !user?.id && (
        <Styled.Input
          label="permissions.users.inputPassword"
          ref={passInputRef}
          type={passTypeState}
          name="password"
          maxlength="16"
          defaultValue={user?.password}
          onChange={({ target: { value } }) => setValue('password', value)}
          properties={register({ required: true })}
          action={(
            <Styled.Action light onClick={() => viewPassword()}>
              {passTypeState === 'password' ? <ViewPasswordSVG /> : <NoViewPasswordSVG />}
            </Styled.Action>
          )}
        />
      )}

      <Styled.Row>
        <Styled.Button onClick={onCloseModal}>
          <Translate id="general.cancel" />
        </Styled.Button>
        <Styled.Button primary margin="0 0 0 20px" onClick={submit}>
          <Translate id="general.finish" />
        </Styled.Button>
      </Styled.Row>
    </Styled.Form>
  )

  return (
    <Styled.Modal onClose={onCloseModal} size="medium">
      <AddMemberSVG />
      { userLoading ? renderLoader() : renderForm() }
    </Styled.Modal>
  )
}

CreateModal.defaultProps = {
  onClose: null,
}

CreateModal.propTypes = {
  onClose: PropTypes.func,
}

export default CreateModal
