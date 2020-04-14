import React, { useState, useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import has from 'lodash/has'
import map from 'lodash/map'
import PropTypes from 'prop-types'
import { getUserProfileData } from 'core/helpers/profile'
import { Button, ModalFullContent } from 'components/index'
import { useRouter } from 'core/helpers/routes'
import Title from 'components/Title'
import Name from 'containers/Moove/Form/Name'
import Type from 'containers/Moove/Form/Type'
import { TYPES } from 'containers/Moove/constants'
import { mooveActions } from 'containers/Moove/state/actions'
import Description from 'containers/Moove/Form/Description'
import Translate from 'components/Translate'
import ViewLoader from 'containers/Moove/Loaders/ViewLoader'
import { isDescriptionRender } from 'containers/Moove/helper'
import BranchName from 'containers/Moove/Form/BranchName'
import Module from './Module'

const Form = (props) => {
  const [name, setName] = useState()
  const [type, setType] = useState()
  const [selectedModules, setSelectedModules] = useState()
  const [branchName, setBranchName] = useState()
  const [description, setDescription] = useState()
  const router = useRouter()
  const dispatch = useDispatch()
  const { card } = useSelector(({ moove }) => moove)
  const { loading: { create, card: loadingCard } } = useSelector(({ moove }) => moove)
  const { match: { params } } = props
  const { problemId, hypothesisId } = params

  const isEditMode = () => has(params, 'cardId')

  const setCardInState = () => {
    setName(card ?.name)
    setType(card ?.type)
    setSelectedModules(card ?.feature ?.modules)
    setDescription(card ?.description)
  }

  const verifyToSetCardInState = () => {
    const { cardId } = params

    return card ? setCardInState() : dispatch(mooveActions.getCard(cardId))
  }

  const setCardInEditMode = () => isEditMode() && verifyToSetCardInState()

  useEffect(() => {
    setCardInState()
  }, [card])

  useEffect(() => {
    setCardInEditMode()
  }, [])

  const goToMoove = () => router.push(
    null,
    [problemId, hypothesisId],
  )

  const getModules = typeValue => (
    typeValue === TYPES.FEATURE && dispatch(mooveActions.getModules())
  )

  const handleSelectType = (typeValue) => {
    getModules(typeValue)
    setType(typeValue)
  }

  const payloadCreateCard = () => ({
    authorId: getUserProfileData('id'),
    branchName,
    description,
    hypothesisId,
    labels: [],
    modules: map(selectedModules, ({ id }) => id),
    name,
    type,
  })

  const payloadUpdateCard = () => ({
    description,
    labels: card.labels,
    name,
  })

  const handleOnSubmit = () => {
    const createCard = () => dispatch(mooveActions.createCard(payloadCreateCard()))
    const updateCard = () => dispatch(mooveActions.updateCard(params?.cardId, payloadUpdateCard()))

    return isEditMode() ? updateCard() : createCard()
  }

  const renderFinishButton = () => (
    <Button
      isLoading={create}
      onClick={handleOnSubmit}
      properties={{
        disabled: create,
      }}
    >
      <Translate id="general.finish" />
    </Button>
  )

  const renderModules = () => {
    return <Module modules={selectedModules} onComplete={setSelectedModules} />
  }

  const renderDescription = () => {
    return <Description value={description} onComplete={setDescription} />
  }

  const renderBranchName = () => {
    return <BranchName value={branchName} nameValue={name} onComplete={setBranchName} />
  }

  const renderContentCard = () => (
    <Fragment>
      <Title primary text="moove.create.title" />
      <Name value={name} onComplete={setName} />
      {name && !isEditMode() && <Type value={type} onComplete={handleSelectType} />}
      {type === TYPES.FEATURE && !isEditMode() && renderModules()}
      {type === TYPES.FEATURE && selectedModules && renderBranchName()}
      {isDescriptionRender(type, branchName) && renderDescription()}
      {description && renderFinishButton()}
    </Fragment>
  )

  return (
    <ModalFullContent onClose={goToMoove}>
      {!loadingCard ? renderContentCard() : <ViewLoader />}
    </ModalFullContent>
  )
}

Form.propTypes = {
  match: PropTypes.object.isRequired,
}

export default Form
