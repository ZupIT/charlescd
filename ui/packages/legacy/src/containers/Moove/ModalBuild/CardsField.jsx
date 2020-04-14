import React from 'react'
import ContentLayer from 'components/ContentLayer'
import CandidateSVG from 'core/assets/svg/ic_rel_candidate_dark.svg'
import FeatureField from './FeatureField'
import Styled from './styled'

const CardField = () => {

  return (
    <>
      <ContentLayer secondary icon={<CandidateSVG />} margin="40px 0 40px" center>
        <Styled.BuildViewTitle text="Cards" />
      </ContentLayer>
      <Styled.ContentInfo>
        <FeatureField />
      </Styled.ContentInfo>
    </>
  )
}

export default CardField
