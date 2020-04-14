import React from 'react'
import PropTypes from 'prop-types'
import defaultsDeep from 'lodash/defaultsDeep'
import { StyledChart } from './styled'
import defaultConfig from './config'

const AreaChart = (props) => {
  const { className, options, series } = props

  return (
    <StyledChart.Chart
      className={className}
      options={defaultsDeep(options, defaultConfig.options)}
      series={series}
      type="area"
      width="100%"
    />
  )
}

AreaChart.defaultProps = {
  className: '',
  options: {},
  series: [],
}

AreaChart.propTypes = {
  className: PropTypes.string,
  options: PropTypes.object,
  series: PropTypes.array,
}

export default AreaChart
