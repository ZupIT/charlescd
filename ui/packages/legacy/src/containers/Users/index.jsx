import React, { useEffect, useState, useRef } from 'react'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { injectIntl } from 'react-intl'
import { InfiniteLoading } from 'components'
import { IconButton } from 'components/IconButton'
import Translate from 'components/Translate'
import Avatar from 'components/Avatar'
import UserPlusSVG from 'core/assets/svg/user-plus.svg'
import { getPath } from 'core/helpers/routes'
import { i18n } from 'core/helpers/translate'
import MembersListLoader from 'containers/Groups/Loaders/MembersListLoader'
import { useScroll } from 'core/hooks/scroll'
import { ZERO } from 'core/helpers/constants'
import {
  SETTINGS_PERMISSIONS_USERS_CREATE,
  SETTINGS_PERMISSIONS_USERS_GROUPS,
} from 'core/constants/routes'
import { useRouter } from 'core/routing/hooks'
import { useSelector } from 'core/state/hooks'
import Styled from './styled'
import useUsers from './hooks/useUsers'

const Users = ({ intl, children }) => {
  const history = useRouter()
  const inputSearch = useRef(null)
  const [filteredUsers, setFilteredUsers] = useState()
  const { list } = useSelector(({ users }) => users)
  const [{ usersLoading }, { getUsers, getMoreUsers }] = useUsers('tela de users')
  const isFirstLoading = usersLoading && list.content.length === ZERO
  const isLoadingMore = usersLoading && list.content.length > ZERO

  const filterUsers = ({ target }) => {
    const filteredContent = list.content.filter(({ email }) => (
      email.toLowerCase().includes(target.value.toLowerCase())
    ))

    setFilteredUsers(filteredContent)
  }

  useScroll(() => {
    if (!list.last && !usersLoading) {
      getMoreUsers()
    }
  })

  useEffect(() => {
    if (isEmpty(list?.content)) {
      getUsers()
    }
  }, [])

  useEffect(() => {
    setFilteredUsers(list.content)
  }, [list.content])

  const renderUser = () => (
    map(filteredUsers, ({ id, email, photoUrl }) => (
      <Styled.UserCard
        key={id}
        onClick={() => history.push(getPath(SETTINGS_PERMISSIONS_USERS_GROUPS, [id, btoa(email)]))}
      >
        <Styled.UserCardProfile>
          <Avatar src={photoUrl} />
          <span>{ email }</span>
        </Styled.UserCardProfile>
      </Styled.UserCard>
    ))
  )

  return (
    <Styled.Wrapper>
      <IconButton
        icon={<UserPlusSVG />}
        onClick={() => history.push(SETTINGS_PERMISSIONS_USERS_CREATE)}
      >
        <Translate id="permissions.group.button.addMember" />
      </IconButton>

      <Styled.ContainerList id="list">
        <Styled.SearchContainer>
          <Styled.InputSearch
            ref={inputSearch}
            type="text"
            placeholder={i18n(intl, 'general.filter.placeholder')}
            onChange={filterUsers}
          />
        </Styled.SearchContainer>
        <InfiniteLoading
          isisLoadingMore={isLoadingMore}
        >
          { isEmpty(filteredUsers) || isFirstLoading ? <MembersListLoader /> : renderUser() }
        </InfiniteLoading>
      </Styled.ContainerList>
      {children}
    </Styled.Wrapper>
  )
}

export default injectIntl(Users)
