import React, { Fragment, useEffect, useState, useRef } from 'react'
import { injectIntl } from 'react-intl'
import map from 'lodash/map'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'components/Translate'
import BoardCards from 'containers/Moove/BoardCards'
import BoardReleases from 'containers/Moove/BoardReleases'
import { getUserProfileData } from 'core/helpers/profile'
import { i18n } from 'core/helpers/translate'
import { getPath } from 'core/helpers/routes'
import { KEY_CODE_ENTER } from 'core/helpers/constants'
import { problemActions } from 'containers/Problems/state/actions'
import { hypothesisActions } from 'containers/Hypothesis/state/actions'
import RightSVG from 'core/assets/svg/right.svg'
import SearchSVG from 'core/assets/svg/search.svg'
import PlusCircleSVG from 'core/assets/svg/plus-circle.svg'
import HypothesisEmptySVG from 'core/assets/svg/hypothesis-empty.svg'
import LoadingSVG from 'core/assets/svg/loading.svg'
import { DASHBOARD_HYPOTHESES_DETAIL } from 'core/constants/routes'
import { useParams } from 'core/routing/hooks'
import BoardLoader from '../Moove/Loaders/BoardLoader'
import { mooveActions } from '../Moove/state/actions'
import Styled from './styled'
import { StyledMenu } from './Menu/styled'

const QuickBoard = ({ match, intl, children }) => {
  const inputSearch = useRef(null)
  const inputNewHypothesis = useRef(null)
  const dispatch = useDispatch()
  const { hypothesisId } = useParams()
  const [items, setItems] = useState([])
  const [filterItems, setFilterItems] = useState([])
  const [, setCurrentHypothesis] = useState({})
  const { moove: { columns, loading: { column: loadingColumns } } } = useSelector(state => state)
  const { problem: loadedProblem, loading: loadingProblem } = useSelector(({ problem }) => problem)
  const { hypothesis: loadedHypothesis } = useSelector(({ hypothesis }) => hypothesis)

  const buildHypothesisMenu = () => {
    const menu = []
    forEach(loadedProblem.hypotheses, (quickHypothesis) => {
      hypothesisId === quickHypothesis.id && setCurrentHypothesis(quickHypothesis)

      menu.push({
        id: quickHypothesis.id,
        problemId: loadedProblem?.id,
        icon: <RightSVG />,
        text: quickHypothesis.name,
        link: getPath(DASHBOARD_HYPOTHESES_DETAIL, [quickHypothesis.id]),
      })
    })

    setItems(menu)
    setFilterItems(menu)
  }

  useEffect(() => {
    loadedProblem
      ? buildHypothesisMenu()
      : dispatch(problemActions.getProblems())
  }, [loadedProblem])

  const buildBoard = (hId) => {
    dispatch(mooveActions.startPolling(hId))
    dispatch(mooveActions.getColumns(hId))
  }

  useEffect(() => {
    setCurrentHypothesis(loadedHypothesis)
    dispatch(problemActions.getProblems())
  }, [loadedHypothesis])

  useEffect(() => {
    return () => {
      dispatch(mooveActions.reset())
      dispatch(mooveActions.stopPolling())
      dispatch(problemActions.reset())
    }
  }, [])

  useEffect(() => {
    hypothesisId && buildBoard(hypothesisId)
    if (loadedProblem && hypothesisId) {
      const hypothesis = loadedProblem.hypotheses.find(h => h.id === hypothesisId)
      setCurrentHypothesis(hypothesis)
    }
  }, [hypothesisId])

  const createHypothesis = ({ keyCode, target }) => {
    if (keyCode === KEY_CODE_ENTER) {
      dispatch(hypothesisActions.createHypothesis({
        name: target.value,
        description: 'Hypothesis created by quick-board',
        authorId: getUserProfileData('id'),
        problemId: loadedProblem?.id,
      }))

      inputNewHypothesis.current.value = ''
    }
  }

  const filterMenu = (event) => {
    const filter = items.filter(
      item => item.text.toLowerCase().includes(event.target.value.toLowerCase()),
    )
    setFilterItems(filter)
  }

  const renderMenuItems = () => (
    map(filterItems, item => (
      <MenuItem key={item.id} item={item} />
    ))
  )

  const renderEmptyMenuItems = () => (
    <StyledMenu.Legend>
      <Translate id="moove.menu.noItems" />
    </StyledMenu.Legend>
  )

  const renderSideMenu = () => (
    <StyledMenu.Content>
      <StyledMenu.Action>
        <SearchSVG onClick={() => inputSearch.current.focus()} />
        <StyledMenu.Input
          ref={inputSearch}
          type="text"
          placeholder={i18n(intl, 'general.filter.placeholder')}
          onChange={event => filterMenu(event)}
        />
      </StyledMenu.Action>
      <StyledMenu.Items>
        { filterItems && !isEmpty(filterItems) ? renderMenuItems() : renderEmptyMenuItems() }
      </StyledMenu.Items>
      <StyledMenu.Footer>
        <PlusCircleSVG onClick={() => inputNewHypothesis.current.focus()} />
        <StyledMenu.Input
          ref={inputNewHypothesis}
          name="name"
          autocomplete="off"
          onKeyUp={createHypothesis}
          placeholder="Create new hypothesis"
          type="text"
        />
      </StyledMenu.Footer>
    </StyledMenu.Content>
  )

  const MenuItem = ({ item }) => (
    <StyledMenu.Link
      to={item.link}
      isActive={(m, { pathname }) => pathname === item.link}
    >
      { item.text && <Translate id={item.text} /> }
    </StyledMenu.Link>
  )

  const renderLoading = () => (
    <Styled.LoadingWrapper>
      <LoadingSVG />
    </Styled.LoadingWrapper>
  )

  const renderMenu = menu => (
    <StyledMenu.Menu hasItems={!isUndefined(menu)}>
      { loadingProblem ? renderLoading() : renderSideMenu() }
    </StyledMenu.Menu>
  )

  const renderColumns = () => (
    <Styled.Wrapper>
      <BoardCards columns={columns} match={match} />
      <BoardReleases columns={columns} match={match} />
    </Styled.Wrapper>
  )

  const renderEmptyBoard = () => (
    <Fragment>
      <Styled.Empty>
        <HypothesisEmptySVG />
        <small><Translate id="moove.hypotheses.empty" /></small>
      </Styled.Empty>
    </Fragment>
  )

  const switchContent = () => columns ? renderColumns() : renderEmptyBoard()

  return (
    <Styled.Content>
      { renderMenu(filterItems) }
      { loadingColumns ? <BoardLoader /> : switchContent() }
      { children }
    </Styled.Content>
  )
}

export default injectIntl(QuickBoard)
