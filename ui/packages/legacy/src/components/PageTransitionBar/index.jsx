import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import Translate from 'components/Translate'
import Charles from 'core/assets/svg/charles.svg'
import { DASHBOARD_CIRCLES } from 'core/constants/routes'
import { Styled } from './styled'

const PageTransitionBar = ({ text, path, left, style }) => {
  const history = useHistory()

  return (
    <Styled.Link to={path} style={style}>
      { left && (
        <Styled.Logo onClick={() => history.push(DASHBOARD_CIRCLES)}>
          <Charles />
        </Styled.Logo>
      )}
      <Styled.Content left={left}>
        { text && (
          <Styled.Text>
            <Translate id={text} />
          </Styled.Text>
        )}
      </Styled.Content>
    </Styled.Link>
  )
}

PageTransitionBar.defaultProps = {
  left: false,
}

PageTransitionBar.propTypes = {
  text: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  left: PropTypes.bool,
}

export default PageTransitionBar
