import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getPath } from 'core/helpers/routes'
import { useRouter, useParams } from 'core/routing/hooks'
import { DASHBOARD_HYPOTHESES_DETAIL } from 'core/constants/routes'
import isEmpty from 'lodash/isEmpty'
import { mooveActions } from './state/actions'
import NameField from './ModalBuild/NameField'
import InfoField from './ModalBuild/InfoField'
import CardsField from './ModalBuild/CardsField'
import ViewBuildLoader from './Loaders/ViewBuildLoader'
import { StyledMoove } from './styled'

const View = () => {
  const history = useRouter()
  const dispatch = useDispatch()
  const { hypothesisId, buildId } = useParams()
  const { build, loading: { build: buildLoading } } = useSelector(selector => selector.moove)

  useEffect(() => {
    dispatch(mooveActions.getBuild(buildId))

    return () => {
      dispatch(mooveActions.resetBuild())
    }
  }, [])

  const onClose = () => {
    history.push(getPath(DASHBOARD_HYPOTHESES_DETAIL, [hypothesisId]))
  }

  const buildView = () => {

    return (
      <>
        <StyledMoove.Card.Wrapper>
          <NameField />
          <InfoField />
          <CardsField />
        </StyledMoove.Card.Wrapper>
      </>
    )
  }

  return (

    <StyledMoove.Card.Modal flex size="large" onClose={onClose}>
      { isEmpty(build) && !buildLoading ? <ViewBuildLoader /> : buildView() }
    </StyledMoove.Card.Modal>
  )
}

export default View
