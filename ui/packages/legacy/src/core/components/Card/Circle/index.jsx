import React from 'react'
import PropTypes from 'prop-types'
import { Translate } from 'components'
import ActiveCircleSVG from 'core/assets/svg/active-circle.svg'
import { dateFrom } from 'core/helpers/date'
import Styled from './styled'

const CardCircle = (props) => {
  const {
    name, deployedAt,
    body, footer, onClick,
  } = props

  return (
    <Styled.Card
      header={(
        <Styled.Header>
          <ActiveCircleSVG />
          <Styled.Name>{ name }</Styled.Name>
          <Styled.Legend>
            <Translate id="general.deployedAt" values={{ date: dateFrom(deployedAt) }} />
          </Styled.Legend>
        </Styled.Header>
      )}
      body={body}
      footer={footer}
      onClick={onClick}
    />
  )
}

CardCircle.propTypes = {
  name: PropTypes.string,
  deployedAt: PropTypes.string.isRequired,
  body: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClick: PropTypes.func,
}

CardCircle.defaultProps = {
  name: '',
  body: <></>,
  footer: <></>,
  onClick: null,
}

export default CardCircle
