import React from 'react'
import { useSelector } from 'react-redux'
import ContentLayer from 'components/ContentLayer'
import CandidateSVG from 'core/assets/svg/ic_rel_candidate_dark.svg'
import Styled from './styled'

const NameField = () => {
  const { build } = useSelector(selector => selector.moove)

  return (
    <ContentLayer icon={<CandidateSVG />} margin="0 0 40px" center>
      <Styled.BuildViewTitle text={build.tag} />
    </ContentLayer>
  )
}

export default NameField
