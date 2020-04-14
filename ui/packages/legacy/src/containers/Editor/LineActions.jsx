import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'
import { ACTIONS } from './constants'
import { StyledActions } from './styled'
import LineActionForm from './LineActionForm'

const initialPosition = 0

const LineActions = ({ editor }) => {
  const [position, setPosition] = useState(initialPosition)
  const [display, setDisplay] = useState(true)
  const [expand, setExpand] = useState(false)
  const [displayForm, setDisplayForm] = useState(false)
  const [element, setElement] = useState(null)
  const [action, setAction] = useState(null)

  const handleExpand = () => setExpand(!expand)

  const lineActions = () => {
    const el = editor.getSelectedParentElement()
    const { innerText, offsetTop } = el
    const showButton = innerText.match(/\w|[~`!@#$%^&*()-+={}|:'"<,.>?[\]]/gi) === null

    setElement(el)
    setDisplay(showButton)
    setPosition(offsetTop)
  }

  const actionForm = (actionType) => {
    setDisplayForm(true)
    setAction(actionType)
  }

  const onAddMedia = () => {
    setExpand(false)
    setDisplayForm(false)
  }

  useEffect(() => {
    editor
      .subscribe('editableKeyup', () => lineActions(editor))
      .subscribe('editableClick', () => lineActions(editor))

  }, [])

  return (
    <OutsideClickHandler onOutsideClick={() => {
      setDisplayForm(false)
      setExpand(false)
    }}
    >
      <LineActionForm
        top={position}
        display={displayForm}
        currentElement={element}
        editor={editor}
        action={action}
        onAdd={onAddMedia}
      />
      <StyledActions.Wrapper
        position={position}
        display={display}
        expand={expand}
        onClick={handleExpand}
      >
        <StyledActions.Expand expand={expand} />
        <StyledActions.Image expand={expand} onClick={() => actionForm(ACTIONS.IMAGE)} />
        <StyledActions.Video expand={expand} onClick={() => actionForm(ACTIONS.VIDEO)} />
      </StyledActions.Wrapper>
    </OutsideClickHandler>
  )
}

LineActions.propTypes = {
  editor: PropTypes.object.isRequired,
}

export default LineActions
