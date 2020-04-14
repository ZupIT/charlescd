import React from 'react'
import { injectIntl } from 'react-intl'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { ContentLayer } from 'components'
import InputGroup from 'components/InputGroup'
import ListIcon from 'core/assets/svg/list.svg'
import { StyledMoove } from '../styled'
import { Styled } from './styled'

const FeatureField = ({ card, value, onChange }) => {

  return !isEmpty(card) && (
    <ContentLayer icon={<ListIcon />} margin="0 0 20px">
      <Styled.ViewTitle text="Features" />
      <StyledMoove.BranchName>
        { map(card.feature.modules, module => (
          <Styled.Item key={module.id}>
            <InputGroup
              readOnly
              key={module.id}
              label={`${module.name}/`}
              value={value}
              register={card.register}
              onChange={onChange}
              text={card.feature.branchName}
            />
          </Styled.Item>
        ))}
      </StyledMoove.BranchName>
    </ContentLayer>
  )
}

export default injectIntl(FeatureField)
