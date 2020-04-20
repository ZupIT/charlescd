import React, { useEffect, useCallback } from 'react'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import HeaderNav from 'components/HeaderNav'
import { getUserProfileData } from 'core/helpers/profile'
import { useSelector } from 'core/state/hooks'
import { DASHBOARD_MODULES_CREATE, DASHBOARD_MODULES_EDIT } from 'core/constants/routes'
import { useRouter } from 'core/routing/hooks'
import Styled from './styled'
import useModules from '../hooks/useModules'
import CardModule from '../Card'
import Loader from '../Loaders/ModuleList'

const List = ({ list, onSelectItem, onDeleteItem }) => (
  <Styled.List>
    {map(list?.content, ({ id, name }) => (
      <CardModule
        key={id}
        name={name}
        onClick={() => onSelectItem(id)}
        onDelete={() => onDeleteItem(id)}
      />
    ))}
  </Styled.List>
)

const ModuleList = () => {
  const router = useRouter()
  const [{ listLoading }, { getModules, deleteModule }] = useModules()
  const { list } = useSelector(({ modules }) => modules)

  useEffect(() => {
    if (isEmpty(list?.content)) {
      getModules()
    }
  }, [])

  const handleDeleteItem = useCallback(id => deleteModule(id), [])


  return (
    <Styled.Wrapper>
      <HeaderNav
        user={{ name: getUserProfileData('name') }}
        actionTitle="module.label.select"
        actionLabel="module.action.create"
        onClick={() => router.push(DASHBOARD_MODULES_CREATE)}
      />
      {listLoading ? <Loader /> : (
        <List
          list={list}
          onSelectItem={id => router.push(DASHBOARD_MODULES_EDIT, id)}
          onDeleteItem={handleDeleteItem}
        />
      )}

    </Styled.Wrapper>
  )
}

export default ModuleList
