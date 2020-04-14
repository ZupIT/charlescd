import React from 'react'
import PropTypes from 'prop-types'
import Styled from './styled'

const ProgessBar = ({ percentage }) => (
  <Styled.WrapperProgessBar>
    <small>{percentage}%</small>
    <Styled.OuterProgessBar>
      <Styled.ProgessBarFiller percentage={percentage} />
    </Styled.OuterProgessBar>
  </Styled.WrapperProgessBar>
)

ProgessBar.propTypes = {
  percentage: PropTypes.number.isRequired,
}

export default ProgessBar
