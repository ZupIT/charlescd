import React, { useState, useRef, useEffect } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { TYPES } from 'containers/Moove/constants'
import { i18n } from 'core/helpers/translate'
import { KEY_CODE_ENTER, KEY_CODE_ESC } from 'core/helpers/constants'
import { useOnClickOutside } from 'core/helpers/hooks'
import PropTypes from 'prop-types'
import { Styled } from './styled'

const DraggableNewCard = ({ createCard, closeCreateCard, intl, index }) => {
  const [actionName, setActionName] = useState('')
  const inputRef = useRef(null)

  useOnClickOutside(inputRef, () => closeCreateCard())

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const handleEnterPress = (e) => {
    if (e.keyCode === KEY_CODE_ENTER && e.shiftKey) {
      return null
    }

    if (e.keyCode === KEY_CODE_ENTER) {
      createCard(actionName)
      setActionName('')
    }

    if (e.keyCode === KEY_CODE_ESC) {
      setActionName('')
      closeCreateCard()
    }

    return null
  }

  const renderNewAction = () => (
    <Styled.Card.Description
      value={actionName}
      ref={inputRef}
      onChange={e => setActionName(e.target.value)}
      placeholder={i18n(intl, 'moove.create.inputName')}
      rows={4}
      onKeyUp={handleEnterPress}
    />
  )

  return (
    <Styled.Card.Wrapper
      id="newCard"
      index={index}
      type={TYPES.ACTION}
    >
      { renderNewAction()}
    </Styled.Card.Wrapper>
  )
}

DraggableNewCard.propTypes = {
  createCard: PropTypes.func.isRequired,
  closeCreateCard: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  index: PropTypes.number.isRequired,
}


export default injectIntl(DraggableNewCard)
