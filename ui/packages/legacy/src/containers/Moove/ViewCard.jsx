/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import map from 'lodash/map'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import kebabCase from 'lodash/kebabCase'
import { getUserProfileData } from 'core/helpers/profile'
import { getPath } from 'core/helpers/routes'
import { removeAccents } from 'core/helpers/regex'
import { userActions } from 'containers/User/state/actions'
import { KEY_CODE_ENTER } from 'core/helpers/constants'
import { TYPES } from 'containers/Moove/constants'
import { DASHBOARD_HYPOTHESES_DETAIL } from 'core/constants/routes'
import { useRouter, useParams } from 'core/routing/hooks'
import ModulesFieldLoader from './Loaders/ModulesFieldLoader'
import FeatureFieldLoader from './Loaders/FeatureFieldLoader'
import { mooveActions } from './state/actions'
import ViewLoader from './Loaders/ViewLoader'
import AddUserField from './ModalCard/AddUserField'
import DescriptionField from './ModalCard/DescriptionField'
import CommentsField from './ModalCard/CommentsFields'
import NameField from './ModalCard/NameField'
import { moduleActions } from '../Module/state/actions'
import ModulesField from './ModalCard/ModulesField'
import FeatureField from './ModalCard/FeatureField'
import { StyledMoove } from './styled'

const View = () => {
  const history = useRouter()
  const { valueFlowId, problemId, hypothesisId, cardId } = useParams()
  const dispatch = useDispatch()
  const { register, getValues, setValue } = useForm()
  const [displayModalAddUser, toggleModalAddUser] = useState(false)
  const [loadingModules, setLoadingModules] = useState(false)
  const [mustRefreshBoard, setMustRefreshBoard] = useState(false)
  const [showModuleSelect, toggleModuleSelect] = useState(false)
  const [clonedCard, setClonedCard] = useState({})
  const { card, loading: { comments, card: cardLoading } } = useSelector(selector => selector.moove)
  const { modules } = useSelector(selector => selector.modules)
  const { list: { content: users } } = useSelector(selector => selector.user)
  const GET_ALL_USERS_PAGE = 0
  const GET_ALL_USERS_SIZE = 100

  useEffect(() => {
    return () => {
      dispatch(mooveActions.resetCard())
    }
  }, [])

  useEffect(() => {
    register({ name: 'labels' })
    register({ name: 'modules' })
    register({ name: 'type' })
    register({ name: 'branchName' })
    register({ name: 'description' })
  }, [register])

  useEffect(() => {
    if (card) {
      setClonedCard(card)
      setLoadingModules(false)
      setValue('name', card.name)
      setValue('modules', map(card.feature?.modules, module => module.id))
      setValue('branchName', removeAccents(card.feature?.branchName) || '')
      setValue('type', isEmpty(card.feature?.modules) ? TYPES.ACTION : TYPES.FEATURE)
      setValue('description', card.description)
      setValue('labels', [])
    } else {
      dispatch(mooveActions.getCard(cardId))
    }
  }, [card])

  useEffect(() => {
    isEmpty(modules.content) && dispatch(moduleActions.getModules())
  }, [modules])

  useEffect(() => {
    !users && dispatch(userActions.getUsers(GET_ALL_USERS_PAGE, GET_ALL_USERS_SIZE))
  }, [users])

  const updateCard = () => {
    dispatch(mooveActions.updateCard(card.id, getValues()))
  }

  const updateUsers = (members) => {
    setClonedCard({
      ...clonedCard,
      members,
    })

    return dispatch(
      mooveActions.updateCardUsers(
        cardId,
        {
          authorId: getUserProfileData('id'),
          memberIds: map(members, member => member.id),
        },
      ),
    )
  }

  const onChangeDescription = () => {
    updateCard()
  }

  const onAddComment = (comment) => {
    const data = { authorId: getUserProfileData('id'), comment }
    dispatch(mooveActions.addComment(cardId, data))
  }

  const onSelectMember = (user) => {
    let members = []

    if (filter(clonedCard.members, item => item.id === user.id).length) {
      members = filter(clonedCard.members, item => item.id !== user.id)
    } else {
      members = [...clonedCard.members, user]
    }

    setMustRefreshBoard(true)
    updateUsers(members)
  }

  const onChangeTitle = ({ target, keyCode }) => {
    if (keyCode === KEY_CODE_ENTER) {
      setMustRefreshBoard(true)
      setValue('name', target.value)
      updateCard()
      target.blur()
    }
  }

  const addModuleToCard = module => clonedCard.feature.modules.push(module)

  const delModuleFromCard = (moduleId) => {
    clonedCard.feature.modules = filter(
      clonedCard.feature.modules, module => (module.id !== moduleId),
    )
  }

  const addFeatureToCard = () => {
    clonedCard.feature = {
      modules: [],
      branchName: kebabCase(removeAccents(clonedCard.name)),
    }

    setValue('branchName', clonedCard.feature.branchName)
  }

  const onAddModule = (moduleId) => {
    setLoadingModules(true)
    setMustRefreshBoard(true)
    const selectedModule = filter(modules.content, eachModule => eachModule.id === moduleId)

    !clonedCard.feature && addFeatureToCard()
    addModuleToCard(selectedModule[0])
    setValue('modules', clonedCard.feature.modules.map(module => module.id))

    isEmpty(clonedCard.feature.modules)
      ? setValue('type', TYPES.ACTION)
      : setValue('type', TYPES.FEATURE)

    updateCard()
    toggleModuleSelect(false)
  }

  const onRemoveModule = (moduleId) => {
    setLoadingModules(true)
    setMustRefreshBoard(true)
    delModuleFromCard(moduleId)
    setValue('modules', clonedCard.feature.modules.map(module => module.id))

    isEmpty(clonedCard.feature.modules)
      ? setValue('type', TYPES.ACTION)
      : setValue('type', TYPES.FEATURE)

    updateCard()
  }

  const updateColumns = () => dispatch(mooveActions.getColumns(hypothesisId))

  const onClose = () => {
    mustRefreshBoard && updateColumns()
    history.push(getPath(DASHBOARD_HYPOTHESES_DETAIL, [hypothesisId]))
  }

  const renderModulesField = getModules => (
    <ModulesField
      showModuleSelect={showModuleSelect}
      toggleModuleSelect={toggleModuleSelect}
      onAddModule={moduleId => onAddModule(moduleId, getModules)}
      onRemoveModule={moduleId => onRemoveModule(moduleId)}
      register={register}
      card={clonedCard}
      modules={modules}
    />
  )

  const renderFeatureField = getModules => (
    !!getModules.length && (<FeatureField card={clonedCard} register={register} />)
  )

  const CardViewEdit = () => {
    const getFeature = get(clonedCard, 'feature')
    const getModules = get(getFeature, ['modules']) || []

    return (
      <StyledMoove.Card.Wrapper>
        <NameField
          register={register}
          card={clonedCard}
          onKeyUp={onChangeTitle}
        />

        <AddUserField
          users={users}
          card={clonedCard}
          toggleMember={onSelectMember}
          toggleDisplay={toggleModalAddUser}
          display={displayModalAddUser}
        />

        { loadingModules ? <ModulesFieldLoader /> : renderModulesField(getModules) }
        { loadingModules ? <FeatureFieldLoader /> : renderFeatureField(getModules) }

        <DescriptionField
          card={clonedCard}
          register={register}
          onDescription={onChangeDescription}
        />

        <CommentsField
          card={clonedCard}
          commentsLoading={comments}
          onChange={onAddComment}
        />
      </StyledMoove.Card.Wrapper>
    )
  }

  return (
    <StyledMoove.Card.Modal flex size="large" onClose={onClose}>
      { !clonedCard || cardLoading ? <ViewLoader /> : CardViewEdit() }
    </StyledMoove.Card.Modal>
  )
}

export default View
