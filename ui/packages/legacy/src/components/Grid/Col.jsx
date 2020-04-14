import styled from 'styled-components'
import PropTypes from 'prop-types'

const width = {
  1: '8.33333333%',
  2: '16.66666667%',
  3: '25%',
  4: '33.33333333%',
  5: '41.66666667%',
  6: '50%',
  7: '58.33333333%',
  8: '66.66666667%',
  9: '75%',
  10: '83.33333333%',
  11: '91.66666667%',
  12: '100%',
}

const Col = styled.div`
  box-sizing: border-box;
  flex: 0 0 auto;
  max-width: 100%;
  padding: 10px;
  
  ${({ xs }) => xs && `
    flex-basis: ${width[xs]};
    max-width: ${width[xs]};
  `}

  ${({ xsOffset }) => xsOffset && `
    margin-left: ${width[xsOffset] || '0'};
  `};

  @media only screen and (min-width: 980px) {
    ${({ sm }) => sm && `
      flex-basis: ${width[sm]};
      max-width: ${width[sm]};
    `}
    ${({ smOffset }) => smOffset && `
      margin-left: ${width[smOffset] || '0'}
    `}
  }

  @media only screen and (min-width: 1378px) {
    ${({ md }) => md && `
      flex-basis: ${width[md]};
      max-width: ${width[md]};
    `}
    ${({ mdOffset }) => mdOffset && `
      margin-left: ${width[mdOffset] || '0'};
    `}
  }

  @media only screen and (min-width: 1380px) {
    ${({ lg }) => lg && `
      flex-basis: ${width[lg]};
      max-width: ${width[lg]};
    `}
    ${({ lgOffset }) => lgOffset && `
      margin-left: ${width[lgOffset] || '0'};
    `}
}
`

Col.defaultProps = {
  xs: '12',
}

Col.propTypes = {
  xs: PropTypes.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
  sm: PropTypes.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
  md: PropTypes.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
  lg: PropTypes.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
  xsOffset: PropTypes.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
  smOffset: PropTypes.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
  mdOffset: PropTypes.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
  lgOffset: PropTypes.oneOf(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']),
}

export default Col
