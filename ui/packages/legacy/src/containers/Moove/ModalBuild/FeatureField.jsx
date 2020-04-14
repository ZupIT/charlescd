import React from 'react'
import { injectIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import map from 'lodash/map'
import InputGroup from 'components/InputGroup'
import Styled from './styled'

const FeatureField = () => {
  const { build } = useSelector(selector => selector.moove)

  return (
    <Styled.ContentWrapper>
      { map(build.features, feature => (
        <Styled.Wrapper key={feature.id}>
          <Styled.BuildViewTitleFeatures text={`${feature.name}`} />
          { map(feature.modules, module => (
            <Styled.Wrapper key={module.id}>
              <Styled.BranchName>
                <Styled.Item>
                  <InputGroup
                    readOnly
                    label={`${module.name}/`}
                    value={feature.branchName}
                  />
                </Styled.Item>
              </Styled.BranchName>
            </Styled.Wrapper>
          ))}
        </Styled.Wrapper>
      ))}
    </Styled.ContentWrapper>
  )
}

export default injectIntl(FeatureField)
