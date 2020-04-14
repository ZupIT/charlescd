import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'core/state/hooks'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import differenceBy from 'lodash/differenceBy'
import OutsideClickHandler from 'react-outside-click-handler'
import { i18n } from 'core/helpers/translate'
import SidebarSVG from 'core/assets/svg/icon-sidebar.svg'
import IconShieldSVG from 'core/assets/svg/icon-shield.svg'
import GroupSVG from 'core/assets/svg/ic_group.svg'
import CloseDarkSVG from 'core/assets/svg/close-dark.svg'
import PlusWithBorderSVG from 'core/assets/svg/plusWithBorder.svg'
import ContentLayer from 'components/ContentLayer'
import { Input } from 'components/FormV2/Input'
import { Title } from 'components'
import { Col } from 'components/Grid'
import { Select } from 'components/Form'
import { SIZE } from 'components/Button'
import Avatar from 'components/Avatar'
import StyledUser from 'containers/Users/styled'
import useUsers from 'containers/Users/hooks/useUsers'
import { StyledMoove } from 'containers/Moove/styled'
import { getPath } from 'core/helpers/routes'
import { KEY_CODE_ENTER } from 'core/helpers/constants'
import { SETTINGS_PERMISSIONS_USERS_EDIT } from 'core/constants/routes'
import { useRouter, useParams } from 'core/routing/hooks'
import MembersListLoader from './Loaders/MembersListLoader'
import RoleListLoader from './Loaders/RoleListLoader'
import RoleItem from './RoleItem'
import useGroups from './hooks/useGroups'
import useRoles from './hooks/useRoles'
import Styled from './styled'

const ModalCreate = ({ intl }) => {
  const history = useRouter()
  const inputSearch = useRef(null)
  const inputTitle = useRef(null)
  const { id: groupId } = useParams()
  const { register, setValue } = useForm()
  const [selectedRoles] = useState(new Set())
  const [groupName, setGroupName] = useState('')
  const [filteredMembers, setFilteredMembers] = useState()
  const [selectValue, setSelectValue] = useState()
  const [displayMemberSelect, toggleMemberSelect] = useState(false)
  const [{ newGroup, groupLoading }, groupsActions] = useGroups()
  const { getGroup, createGroup, editGroup, setGroupLoading } = groupsActions
  const { roles, item: group } = useSelector(({ groups }) => groups)
  const [{ rolesLoading }, { getRoles }] = useRoles()
  const [, usersActions] = useUsers()
  const users = useSelector(state => state.users?.list?.content)
  const { getUsers, addUserToGroup, removeUserFromGroup } = usersActions

  const buildEditionMode = () => {
    getRoles()
    inputTitle.current.focus()
  }

  useEffect(() => {
    getUsers()
    isEmpty(groupId)
    ? buildEditionMode()
    : getGroup(groupId)
  }, [])

  const filterMembers = (event) => {
    const filter = group.members.filter(
      user => user.email.toLowerCase().includes(event.target.value.toLowerCase()),
    )
    setFilteredMembers(filter)
  }

  useEffect(() => {
    if (group) {
      setValue('name', group.name)
      setGroupName(group.name)
      getRoles(group.roles)
      setFilteredMembers(group.members)
    }
  }, [group])

  useEffect(() => {
    !isEmpty(roles) && map(roles, role => role.value && selectedRoles.add(role.id))
  }, [roles])

  const handleInputForGroupCreate = () => {
    const data = {
      name: groupName,
      roleIds: Array.from(selectedRoles),
    }

    groupId ? editGroup(groupId, data) : createGroup(data)
  }

  const handleSwitchRole = (state, id) => {
    state ? selectedRoles.delete(id) : selectedRoles.add(id)

    handleInputForGroupCreate()
  }

  const onKeyPress = ({ target, keyCode }) => {
    keyCode === KEY_CODE_ENTER && target.blur()
  }

  const addMember = () => {
    const idGroup = group?.id || newGroup?.id
    setGroupLoading(true)
    toggleMemberSelect(false)
    setSelectValue(null)
    addUserToGroup(selectValue, idGroup)
      .then(() => getGroup(idGroup))
  }

  const removeMember = (userId) => {
    setGroupLoading(true)
    removeUserFromGroup(userId, groupId)
      .then(() => getGroup(groupId))
  }

  const availableMembers = () => differenceBy(users, group?.members, x => x.email)

  const renderAddMembers = () => (
    <OutsideClickHandler
      display="flex"
      onOutsideClick={() => toggleMemberSelect(false)}
    >
      <Select onChange={e => setSelectValue(e.target.value)} name="buildId">
        <option value="select">{i18n(intl, 'general.dashed.select')}</option>
        {map(availableMembers(), option => (
          <option key={option.id} value={option.id}> {option.name} </option>
        ))}
      </Select>
      <Styled.Button
        primary
        size={SIZE.SMALL}
        onClick={() => (selectValue && selectValue !== 'select') && addMember()}
      >
        {i18n(intl, 'general.add')}
      </Styled.Button>
    </OutsideClickHandler>
  )

  const renderAddMember = () => (
    <StyledMoove.View.ButtonAdd
      size={SIZE.SMALL}
      onClick={() => toggleMemberSelect(true)}
    >
      <StyledMoove.View.Icon>
        <PlusWithBorderSVG />
      </StyledMoove.View.Icon>
    </StyledMoove.View.ButtonAdd>
  )

  const renderRoles = () => (
    map(roles, ({ id, name, value }) => (
      <RoleItem
        key={id}
        name={name}
        value={value}
        onChange={state => handleSwitchRole(state, id)}
      />
    ))
  )

  const renderMembers = () => (
    map(filteredMembers, ({ id, email, photoUrl }) => (
      <StyledUser.UserCard key={id}>
        <StyledUser.UserCardProfile
          onClick={() => history.push(getPath(SETTINGS_PERMISSIONS_USERS_EDIT, [btoa(email)]))}
        >
          <Avatar src={photoUrl} />
          <span>{email}</span>
        </StyledUser.UserCardProfile>
        <StyledUser.UserCardMenu>
          <CloseDarkSVG
            style={{ marginRight: '-5px' }}
            onClick={() => removeMember(id)}
          />
        </StyledUser.UserCardMenu>
      </StyledUser.UserCard>
    ))
  )

  const renderSearch = () => (
    <Styled.InputSearch
      ref={inputSearch}
      type="text"
      placeholder={i18n(intl, 'general.filter.placeholder')}
      onChange={event => filterMembers(event)}
    />
  )

  return (
    <Styled.Modal onClose={() => history.goBack()} size="medium">
      <Col xs="10">
        <ContentLayer margin="45px 0 20px 45px" center icon={<SidebarSVG />}>
          <Input
            resume
            ref={inputTitle}
            autoComplete="off"
            type="text"
            name="name"
            onKeyUp={onKeyPress}
            onChange={({ target: { value } }) => setGroupName(value)}
            onKeyPress={onKeyPress}
            onBlur={handleInputForGroupCreate}
            properties={register({ required: true })}
          />
        </ContentLayer>
        <ContentLayer margin="45px 0 20px 45px" icon={<IconShieldSVG />}>
          <Title text="general.permissions" />
          {rolesLoading ? <RoleListLoader /> : renderRoles()}
        </ContentLayer>
        <ContentLayer margin="45px 0 20px 45px" icon={<GroupSVG />}>
          <Title text="general.developers" />
          <Styled.Container>
            {renderAddMember()}
            {displayMemberSelect && renderAddMembers()}
          </Styled.Container>
          <Styled.ContainerList>
            <Styled.SearchContainer>
              {!isEmpty(group?.members) && renderSearch()}
            </Styled.SearchContainer>
            {groupLoading && <MembersListLoader />}
            {!isEmpty(filteredMembers) && renderMembers()}
          </Styled.ContainerList>
        </ContentLayer>
      </Col>
    </Styled.Modal>
  )
}

export default injectIntl(ModalCreate)
