/* eslint-disable */
import React, { Fragment, useEffect } from 'react'
import { withRouter, Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import BoardCards from 'containers/Moove/BoardCards'
import BoardReleases from 'containers/Moove/BoardReleases'
import { problemActions } from 'containers/Problems/state/actions'
import { hypothesisActions } from 'containers/Hypothesis/state/actions'
import Breadcrumb from 'components/Breadcrumb'
import { getPath } from 'core/helpers/routes'
import { mooveActions } from './state/actions'
import { StyledMoove } from './styled'
import BoardLoader from './Loaders/BoardLoader'
import BreadcrumbLoader from './Loaders/BreadcrumbLoader'

const Moove = (props) => {
  const dispatch = useDispatch()
  const { moove: { columns } } = useSelector(state => state)
  const { item: loadedValueFlow, loading: loadingValueFlow } = useSelector(({ valueFlow }) => valueFlow)
  const { problem: loadedProblem, loading: loadingProblem } = useSelector(({ problem }) => problem)
  const { hypothesis: loadedHypothesis, loading: loadingHypothesis } = useSelector(({ hypothesis }) => hypothesis)
  const { valueFlowId, problemId, hypothesisId } = useParams()

  useEffect(() => {
    dispatch(mooveActions.startPolling(hypothesisId))
    dispatch(mooveActions.getColumns(hypothesisId))
    dispatch(problemActions.getProblems())
    dispatch(hypothesisActions.getHypothesisById(hypothesisId))

    return () => {
      dispatch(problemActions.reset())
      dispatch(hypothesisActions.reset())
      dispatch(mooveActions.reset())
      dispatch(mooveActions.stopPolling())
    }
  }, [])

  const displayBreadcrumb = () => loadingValueFlow || loadingProblem || loadingHypothesis

  const renderBreadcrumb = () => {
    const linkValueFlow = `${getPath(null, [valueFlowId])}`
    const linkProblem = `${getPath(null, [valueFlowId, problemId])}`

    return (
      <Breadcrumb>
        <Link to={linkValueFlow}>{ loadedValueFlow?.name }</Link>
        <Link to={linkProblem}>{ loadedProblem?.name }</Link>
        <Link to={linkProblem}>{ loadedHypothesis?.name }</Link>
      </Breadcrumb>
    )
  }

  const renderColumns = () => (
    <Fragment>
      <StyledMoove.Toolbar inverted fixed>
        {
          displayBreadcrumb()
            ? <BreadcrumbLoader />
            : renderBreadcrumb()
        }
      </StyledMoove.Toolbar>
      <StyledMoove.Wrapper>
        <BoardCards columns={columns} match={props.match} />
        <BoardReleases columns={columns} match={props.match} />
      </StyledMoove.Wrapper>
    </Fragment>
  )

  return columns ? renderColumns() : <BoardLoader />
}

export default withRouter(Moove)
