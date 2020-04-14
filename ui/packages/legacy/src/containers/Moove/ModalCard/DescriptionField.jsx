import React, { useRef, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import { ContentLayer } from 'components'
import DescriptionIcon from 'core/assets/svg/description.svg'
import { i18n } from 'core/helpers/translate'
import Textarea from 'components/FormV2/Textarea'
import { StyledMoove } from '../styled'
import { Styled } from './styled'

const DescriptionField = ({ register, card, onDescription, intl }) => {
  const descRef = useRef(null)

  useEffect(() => {
    if (descRef.current) {
      register(descRef.current)
    }
  }, [descRef])

  return (
    <>
      <ContentLayer icon={<DescriptionIcon />} margin="0 0 20px">
        <Styled.ViewTitle text="Description" />
      </ContentLayer>
      <StyledMoove.Description>
        <Textarea
          ref={descRef}
          name="description"
          onSave={onDescription}
          defaultValue={card?.description}
          placeholder={i18n(intl, 'moove.card.description.placeholder')}
        />
      </StyledMoove.Description>
    </>
  )
}

export default injectIntl(DescriptionField)
