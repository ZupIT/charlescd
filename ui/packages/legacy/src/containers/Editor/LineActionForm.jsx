import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MEDIA, ACTIONS } from './constants'
import { StyledActions } from './styled'

const LineActionForm = (props) => {
  const { display, top, editor, onAdd, currentElement, action } = props
  const [input, setInput] = useState()

  const setInputFocus = () => input && input.focus()

  const getMedia = (type) => {
    const actions = {
      [ACTIONS.IMAGE]: `
        <img class="${MEDIA.ITEM}" src="${input.value}" alt="photo" />
      `,
      [ACTIONS.VIDEO]: `
        <iframe
          src="${input.value}"
          class="${MEDIA.ITEM}"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      `,
    }

    return actions[type]
  }

  const setEditorContent = () => {
    const content = `
      <p>
        <div class="${MEDIA.ALIGN.LEFT}">${getMedia(action)}</div>
      </p>
    `

    if (currentElement) {
      currentElement.innerHTML = content
    } else {
      editor.setContent(content)
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setEditorContent()
    onAdd && onAdd()
  }

  const renderForm = () => (
    <StyledActions.Form top={top} onSubmit={onSubmit}>
      <StyledActions.Input ref={setInput} />
    </StyledActions.Form>
  )

  useEffect(() => {
    setInputFocus()
  }, [input])

  return (
    <Fragment>
      { display && renderForm() }
    </Fragment>
  )
}

LineActionForm.defaultProps = {
  currentElement: null,
  onAdd: null,
  action: null,
}

LineActionForm.propTypes = {
  display: PropTypes.bool.isRequired,
  top: PropTypes.number.isRequired,
  editor: PropTypes.object.isRequired,
  action: PropTypes.string,
  onAdd: PropTypes.func,
  currentElement: PropTypes.any,
}

export default LineActionForm
