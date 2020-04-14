import React from 'react'
import { useRouter } from 'core/routing/hooks'
import { Translate } from 'components'
import { DASHBOARD_CIRCLES_MATCHER } from 'core/constants/routes'
import { TAB } from '../constants'
import Styled from '../styled'

const Tab = ({ highlightItem }) => {
  const router = useRouter()

  return (
    <Styled.TabWrapper>
      <Styled.Tab.Item
        key={0}
        active={TAB.CIRCLE_MATCHER === highlightItem}
        onClick={() => router.push(DASHBOARD_CIRCLES_MATCHER)}
      >
        <Translate id={`circle.title.${TAB.CIRCLE_MATCHER.toLowerCase()}.list`} />
      </Styled.Tab.Item>
    </Styled.TabWrapper>
  )
}

export default Tab
