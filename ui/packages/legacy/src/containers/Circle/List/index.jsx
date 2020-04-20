import React from 'react'
import { Translate } from 'components'
import { useRouter } from 'core/routing/hooks'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import CircleSVG from 'core/assets/svg/circle-old.svg'
import { dateFrom } from 'core/helpers/date'
import { Col } from 'components/Grid'
import { DASHBOARD_CIRCLES_EDIT } from 'core/constants/routes'
import { REQUESTS_BY_CIRCLE, SLOW_TIME, Y_LABEL_INT } from '../Metrics/constants'
import { CIRCLE } from '../constants'
import Metrics from '../Metrics'
import Styled from './styled'

const CircleList = ({ items }) => {
  const router = useRouter()

  const renderItem = (item, index) => (
    <Col xs="6" lg="3" key={index}>
      <Styled.Wrapper
        shadowed
        isDefault={item?.name === CIRCLE.DEFAULT}
        onClick={() => router.push(DASHBOARD_CIRCLES_EDIT, [item?.id])}
      >
        <Styled.Action>
          <CircleSVG />
          <Styled.Content>
            <Styled.Item>
              { item.name }
            </Styled.Item>
            <Styled.Item>
              <Styled.Legend>
                <Translate id="general.createdAt" values={{ date: dateFrom(item?.createdAt) }} />
              </Styled.Legend>
            </Styled.Item>
          </Styled.Content>
        </Styled.Action>
        { !isEmpty(item?.deployment) && (
          <>
            <Styled.Action>
              <Styled.Release.Box>
                <Styled.Release.Item>
                  <div>{item?.deployment?.build?.tag}</div>
                  <small>
                    <Translate id="general.deployedAt" values={{ date: dateFrom(item?.deployment?.createdAt) }} />
                  </small>
                </Styled.Release.Item>
              </Styled.Release.Box>
            </Styled.Action>
            <Styled.Chart>
              <Metrics
                id={item?.id}
                options={Y_LABEL_INT}
                speed={SLOW_TIME}
                metricType={REQUESTS_BY_CIRCLE}
              />
            </Styled.Chart>
          </>
        )}
      </Styled.Wrapper>
    </Col>
  )

  return (
    map(items, (item, index) => renderItem(item, index))
  )
}

export default CircleList
