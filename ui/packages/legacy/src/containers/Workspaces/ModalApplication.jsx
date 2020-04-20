import React, { useEffect, useRef, useState } from 'react'
import { useSelector as useSelectorRedux, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import filter from 'lodash/filter'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import useStep from 'core/helpers/step'
import { getPath } from 'core/helpers/routes'
import { SETTINGS_PERMISSIONS_WORKSPACE_EDIT } from 'core/constants/routes'
import { useRouter, useParams } from 'core/routing/hooks'
import { KEY_CODE_ENTER } from 'core/helpers/constants'
import PlusWithBorderSVG from 'core/assets/svg/plusWithBorder.svg'
import ModalAddUser from 'containers/Moove/ModalAddUser'
import { userActions } from 'containers/User/state/actions'
import { SIZE } from 'components/Button'
import { useWorkspace } from './hooks/workspaces'
import WorkspaceModalLoader from './Loaders/WorspaceModal'
import Styled from './styled'

const ModalApplication = () => {
  const dispatch = useDispatch()
  const [displayMembers, setDisplayMembers] = useState(false)
  const nameRef = useRef(null)
  const { register, getValues } = useForm()
  const history = useRouter()
  const { applicationId } = useParams()
  const { step, stepHandler } = useStep(['name', 'members'], applicationId ? 'members' : 'name')
  const { list: { content: users } } = useSelectorRedux(selector => selector.user)
  const [{ loadingWorkspace, workspace }, workspaceServices] = useWorkspace()
  const { saveWorkspace, updateWorkspace, getWorkspace, addMembers } = workspaceServices
  const GET_ALL_USERS_PAGE = 0
  const GET_ALL_USERS_SIZE = 100

  useEffect(() => {
    if (nameRef.current && !applicationId) {
      register(nameRef.current)
      nameRef.current.focus()
    }
  }, [nameRef])

  useEffect(() => {
    if (applicationId) {
      getWorkspace(applicationId)
    }
  }, [applicationId])

  useEffect(() => {
    !users && dispatch(userActions.getUsers(GET_ALL_USERS_PAGE, GET_ALL_USERS_SIZE))
  }, [users])

  const onSetName = () => {
    const { name } = getValues()
    const hasName = !isEmpty(name)

    if (hasName && applicationId) {
      updateWorkspace(applicationId, { name })

    } else if (hasName) {
      saveWorkspace({ name })
        .then(({ id }) => (
          history.push(getPath(SETTINGS_PERMISSIONS_WORKSPACE_EDIT, [id]))
        ))
    }

    stepHandler.go(hasName ? 'members' : 'name')

  }

  const onKeyUp = ({ target, keyCode }) => {
    keyCode === KEY_CODE_ENTER && target.blur()
  }

  const onSelectMember = (user) => {
    const { users: appUsers } = workspace
    const hasUser = filter(appUsers, ({ id }) => id === user.id).length

    if (applicationId) {
      const members = hasUser
        ? filter(appUsers, ({ id }) => id !== user.id)
        : [...workspace.users, user]

      addMembers(applicationId, members, appUsers)
    }

  }

  const renderModal = () => (
    <>
      <Styled.Content icon={<Styled.SideIcon />}>
        <Styled.Form onSubmit={e => e.preventDefault()}>
          <Styled.Input
            resume
            type="text"
            name="name"
            ref={nameRef}
            autoComplete="off"
            onBlur={onSetName}
            onKeyUp={onKeyUp}
            defaultValue={workspace.name}
            properties={register({ required: true })}
          />
        </Styled.Form>
      </Styled.Content>
      <Styled.Content icon={<Styled.MemberIcon />}>
        <Styled.Step step={step.members}>
          <Styled.Title text="permissions.workspace.members" />
          <Styled.Members.Content>
            {
              displayMembers && (
                <ModalAddUser
                  users={users}
                  members={workspace.users}
                  toggleMember={onSelectMember}
                  toggleModal={setDisplayMembers}
                />
              )
            }
          </Styled.Members.Content>
          <Styled.Members.SpaceBetween>
            <Styled.Members.Button
              size={SIZE.SMALL}
              onClick={() => setDisplayMembers(true)}
            >
              <Styled.Members.Icon>
                <PlusWithBorderSVG />
              </Styled.Members.Icon>
            </Styled.Members.Button>
            <Styled.Members.Members>
              { map(workspace.users, (member, index) => (
                <Styled.Members.Avatar key={index} src={member.photoUrl} />
              )) }
            </Styled.Members.Members>
          </Styled.Members.SpaceBetween>
        </Styled.Step>
      </Styled.Content>
    </>
  )

  return (
    <Styled.Modal onClose={() => history.goBack()} size="large">
      { !loadingWorkspace ? renderModal() : <WorkspaceModalLoader /> }
    </Styled.Modal>
  )
}

export default ModalApplication
