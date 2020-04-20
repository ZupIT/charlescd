import React, { Fragment, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useScroll } from 'core/hooks/scroll'
import { Translate } from 'components'
import isEmpty from 'lodash/isEmpty'
import CirclesEmptySVG from 'core/assets/svg/circles-empty.svg'
import { circleActions } from '../state/actions'
import { TAB } from '../constants'
import CircleList from '../List'
import CircleTab from '../Tab'
import CircleFilter from '../Filter'
import { ListInactivesLoader } from '../Loaders'
import Styled from '../styled'

const CircleInactives = () => {
  const dispatch = useDispatch()
  const MS_WAIT_STOP_TYPE = 400
  const [filterValue, setFilterValue] = useState('')
  const { list, loading } = useSelector(({ circle }) => circle)
  const { inactives: circles, last } = list

  useEffect(() => {
    dispatch(circleActions.toggleLoading(true))

    const timeout = setTimeout(() => {
      dispatch(circleActions.reset())
      dispatch(circleActions.getCircles(false, filterValue))
    }, MS_WAIT_STOP_TYPE)

    return () => {
      dispatch(circleActions.reset())
      clearTimeout(timeout)
    }
  }, [filterValue])

  useScroll(() => {
    const canLoadMore = !loading && !last
    canLoadMore && dispatch(circleActions.getCircles(false, filterValue))
  })

  const renderLoader = () => <ListInactivesLoader />

  const renderTab = () => <CircleTab highlightItem={TAB.INACTIVE} />

  const renderFilter = () => (
    <CircleFilter
      value={filterValue}
      setFilterValue={setFilterValue}
    />
  )

  const renderEmptyContent = () => (
    <Styled.EmptyWrapper>
      <CirclesEmptySVG />
      <Styled.EmptyText>
        <Translate id="circle.filter.empty" />
      </Styled.EmptyText>
    </Styled.EmptyWrapper>
  )

  const renderContent = () => <CircleList items={circles} />

  const renderContentMore = () => (
    <Fragment>
      { renderContent() }
      { renderLoader() }
    </Fragment>
  )

  return (
    <Fragment>
      { renderTab() }
      <Styled.Content>
        { renderFilter() }
        { !loading && isEmpty(circles) && renderEmptyContent() }
        { !loading && !isEmpty(circles) && renderContent() }
        { loading && !isEmpty(circles) && renderContentMore() }
        { loading && isEmpty(circles) && renderLoader() }
      </Styled.Content>
    </Fragment>
  )
}

export default CircleInactives
