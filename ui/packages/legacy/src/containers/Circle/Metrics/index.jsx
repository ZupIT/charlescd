import React, { useEffect, useState } from 'react'
import map from 'lodash/map'
import MetricsAPI from 'core/api/metrics'
import { PERIODS } from './constants'
import { initialPeriodSelected, toList } from './helpers'
import Styled from './styled'

const initialCount = 0

const Metrics = ({ id, metricType, speed, options }) => {
  const [period, setPeriod] = useState(initialPeriodSelected.type)
  const [data, setData] = useState([])
  const [reactor, setReactor] = useState()
  const [count, setCount] = useState(initialCount)

  const getMetrics = () => {
    return MetricsAPI.getMetricsByCircle(id, { period, metricType })
      .then(response => setData(toList(response?.data)))
  }

  const removeReactor = () => clearInterval(reactor)

  const createReactor = () => {
    const newReactor = setInterval(() => {
      const INCREMENT = 1
      setCount(state => state + INCREMENT)
    }, speed)

    setReactor(newReactor)
  }

  useEffect(() => {
    createReactor()

    return () => removeReactor()
  }, [])

  useEffect(() => {
    getMetrics()
  }, [count, period])

  const handleControlClick = (type) => {
    setPeriod(type)
  }

  const renderControls = () => (
    <Styled.Controls>
      {map(PERIODS, ({ type, value, label }) => (
        <Styled.ControlItem
          key={type}
          isSelected={type === period}
          onClick={() => handleControlClick(type)}
        >
          {`${value} ${label}`}
        </Styled.ControlItem>
      ))}
    </Styled.Controls>
  )

  return (
    <Styled.Wrapper onClick={e => e.stopPropagation()}>
      <>
        <Styled.Chart options={options} series={[{ name: '', data }]} />
      </>
      { renderControls() }
    </Styled.Wrapper>
  )
}

export default React.memo(Metrics)
