import React from 'react'
import { useSelector } from 'react-redux'
import { Translate } from 'components'
import ContentLayer from 'components/ContentLayer'
import { dateFrom } from 'core/helpers/date'
import InfoDarkOutlinedSVG from 'core/assets/svg/info-outlined-dark.svg'
import UserSVG from 'core/assets/svg/user-build.svg'
import CalendarSVG from 'core/assets/svg/calendar.svg'
import Styled from './styled'

const InfoField = () => {
  const { build } = useSelector(selector => selector.moove)

  return (
    <>
      <ContentLayer icon={<InfoDarkOutlinedSVG />} margin="0 0 40px" center>
        <Styled.BuildViewTitle text="Info" />
      </ContentLayer>
      <Styled.ContentInfo>
        <Styled.ContentWrapper>
          <ContentLayer icon={<UserSVG />} margin="0 0 10px" center>
            <Styled.Info>
              { build.author.name }
            </Styled.Info>
          </ContentLayer>
          <ContentLayer icon={<CalendarSVG />} margin="0 0 10px" center>
            <Styled.Info>
              <Translate id="general.createdAt" values={{ date: dateFrom(build.createdAt) }} />
            </Styled.Info>
          </ContentLayer>
        </Styled.ContentWrapper>
      </Styled.ContentInfo>
    </>
  )
}

export default InfoField
