import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextareaAutosize from 'react-autosize-textarea'
import Label from 'components/Label'
import Translate from 'components/Translate'
import { Button } from 'components/Button'
import Styled from './styled'

const Textarea = React.forwardRef((props, ref) => {
  const { label, name, className, onFocus, onBlur, onSave, ...rest } = props
  const [enableButton, setEnableButton] = useState(false)

  const onTextareaFocus = (event) => {
    onFocus && onFocus(event)
    setEnableButton(true)
  }

  const onTextareaBlur = (event) => {
    onBlur && onBlur(event)
    onSave && onSave()
    setEnableButton(false)
  }

  const onClickSave = () => {
    onSave && onSave()
    setEnableButton(false)
  }

  return (
    <Styled.Wrapper className={className}>
      { label && <Label id={label} /> }
      <TextareaAutosize
        {...rest}
        ref={ref}
        name={name}
        onFocus={onTextareaFocus}
        onBlur={onTextareaBlur}
      />
      {enableButton && (
        <Button
          margin="10px 0 0"
          onClick={onClickSave}
        >
          <Translate id="general.save" />
        </Button>
      )}
    </Styled.Wrapper>
  )
})

Textarea.defaultProps = {
  label: '',
  onFocus: null,
  onSave: null,
  onBlur: null,
}

Textarea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onFocus: PropTypes.func,
  onSave: PropTypes.func,
  onBlur: PropTypes.func,
}

export default Textarea
