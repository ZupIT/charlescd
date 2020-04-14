/* eslint-disable no-magic-numbers */
import React from 'react'
import times from 'lodash/times'
import { StyledRocket } from './styled'

const Rocket = () => {
  const liTag = number => times(number, () => <li />)

  return (
    <StyledRocket>
      <div className="rocket">
        <div className="rocket-body">
          <div className="body" />
          <div className="fin fin-left" />
          <div className="fin fin-right" />
          <div className="window" />
        </div>
        <div className="exhaust-flame" />
        <ul className="exhaust-fumes">
          {liTag(9)}
        </ul>
        <ul className="star">
          {liTag(7)}
        </ul>
      </div>
    </StyledRocket>
  )
}

export default Rocket
