import React, { useState } from 'react'
import map from 'lodash/map'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { Translate } from 'components'
import { i18n } from 'core/helpers/translate'
import PlusWithBorderSVG from 'core/assets/svg/plusWithBorder.svg'
import { StyledMoove } from 'containers/Moove/styled'
import { SIZE } from 'components/Button'
import CreateUserStyled from '../styled'
import Styled from './styled'

const AddCard = ({ onClick, items, intl, onAdd, showSelect }) => {
  const [selectValue, setSelectValue] = useState()

  return (
    <>
      <StyledMoove.View.ButtonAdd
        size={SIZE.SMALL}
        onClick={onClick}
      >
        <StyledMoove.View.Icon>
          <PlusWithBorderSVG />
        </StyledMoove.View.Icon>
      </StyledMoove.View.ButtonAdd>
      { showSelect && (
      <Styled.Item>
        <Styled.Select
          name="buildId"
          onChange={e => setSelectValue(e.target.value)}
        >
          <option value="select">{i18n(intl, 'general.dashed.select')}</option>
          { map(items, option => (
            <option key={option.id} value={option.id}> { option.name } </option>
          ))}
        </Styled.Select>
        <CreateUserStyled.Button
          primary
          size={SIZE.SMALL}
          onClick={() => (selectValue && selectValue !== 'select') && onAdd(selectValue)}
        >
          <Translate id="general.add" />
        </CreateUserStyled.Button>
      </Styled.Item>
      )}
    </>
  )
}

AddCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  showSelect: PropTypes.bool.isRequired,
}

export default injectIntl(AddCard)
