import React from 'react'
import { injectIntl } from 'react-intl'
import { i18n } from 'core/helpers/translate'
import SearchCirclesSVG from 'core/assets/svg/search-circles.svg'
import Styled from '../styled'

const Filter = ({ intl, value, setFilterValue }) => (
  <Styled.ActionHeader>
    <Styled.Action>
      <SearchCirclesSVG />
      <Styled.InputSearch
        type="text"
        value={value}
        placeholder={i18n(intl, 'circle.filter.placeholder')}
        onChange={event => setFilterValue(event.target.value.toLowerCase())}
      />
    </Styled.Action>
  </Styled.ActionHeader>
)

export default injectIntl(Filter)
