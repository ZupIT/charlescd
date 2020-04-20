import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'core/routing/hooks'
import { THEME, SIZE } from 'components/Button'
import { Translate } from 'components'
import { getPath } from 'core/helpers/routes'
import { DASHBOARD_CIRCLES_EDIT } from 'core/constants/routes'
import { CIRCLE } from '../constants'
import Styled from './styled'

const Result = ({ circles }) => {
  const history = useRouter()

  return (
    <Styled.ResultWrapper>
      <Styled.ResultTitle><Translate id="circle.circleMatcher.result" /></Styled.ResultTitle>
      <div>
        <Styled.ResultHead>
          <Styled.CircleName><Translate id="circle.circleMatcher.circleName" /></Styled.CircleName>
          <Styled.CircleID><Translate id="circle.circleMatcher.circleID" /></Styled.CircleID>
          <Styled.CircleView><Translate id="circle.circleMatcher.action" /></Styled.CircleView>
        </Styled.ResultHead>
        { circles.map(circle => (
          <Styled.ResultItem key={circle.id}>
            <Styled.CircleName>{circle.name}</Styled.CircleName>
            <Styled.CircleID>{circle.id}</Styled.CircleID>
            <Styled.CircleView>
              <Styled.ResultViewButton
                disabled={circle.id === CIRCLE.DEFAULT}
                theme={THEME.OUTLINE}
                size={SIZE.SMALL}
                onClick={() => history.push(getPath(DASHBOARD_CIRCLES_EDIT, [circle.id]))}
              >
                <Translate id="circle.circleMatcher.view" />
              </Styled.ResultViewButton>
            </Styled.CircleView>
          </Styled.ResultItem>
        )) }
      </div>
    </Styled.ResultWrapper>
  )
}

Result.propTypes = {
  circles: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Result
