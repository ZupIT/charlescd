import React from 'react'
import PropTypes from 'prop-types'
import { CardBox, CardHeader } from 'components/CardBox'
import Translate, { FORMAT } from 'components/Translate'
import { StyledModule } from 'containers/Module/styled'
import { useRouter } from 'core/routing/hooks'
import { DASHBOARD_MODULES_EDIT } from 'core/constants/routes'
import Circle from 'core/assets/svg/circle-small.svg'

const CardModule = ({ module }) => {
  const router = useRouter()

  return (
    <CardBox shadowed onClick={() => router.push(DASHBOARD_MODULES_EDIT, [module.id])}>
      <CardHeader>
        { module.name }
      </CardHeader>
      <StyledModule.Card.Body />
      <StyledModule.Card.Footer>
        <StyledModule.Card.FooterItem>
          <Circle />
          <StyledModule.Card.FooterText>
            0 <Translate id="general.circles" format={FORMAT.LOWER_CASE} />
          </StyledModule.Card.FooterText>
        </StyledModule.Card.FooterItem>
      </StyledModule.Card.Footer>
    </CardBox>
  )
}

CardModule.defaultProps = {
  module: {},
}

CardModule.propTypes = {
  module: PropTypes.object,
}

export default CardModule
