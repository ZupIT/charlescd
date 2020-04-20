import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import { ButtonExpanded } from 'components'
import PlusButtonSVG from 'core/assets/svg/plus.svg'
import { mooveActions } from 'containers/Moove/state/actions'
import { TYPES } from 'containers/Moove/constants'
import { getUserProfileData } from 'core/helpers/profile'
import { useParams } from 'core/routing/hooks'
import ColumnHeader from './ColumnHeader'
import DraggableCard from '../Draggables/Card'
import DraggableNewCard from '../Draggables/NewCard'
import ColumnContent from './ContentColumn'
import Styled from './styled'

const increment = 1

const ToDoColumn = ({ id, name, list }) => {
  const dispatch = useDispatch()
  const [showNewCard, setShowNewCard] = useState(false)
  const { valueFlowId, hypothesisId, problemId } = useParams()
  const contentRef = useRef(null)

  useEffect(() => {
    if (showNewCard) {
      contentRef.current.scrollTop = 10000
    }
  }, [showNewCard, list])

  const handleClick = () => {
    setShowNewCard(true)
  }

  const payloadCreateCard = actionName => ({
    authorId: getUserProfileData('id'),
    branchName: '',
    description: '',
    hypothesisId,
    valueFlowId,
    problemId,
    labels: [],
    modules: [],
    name: actionName,
    type: TYPES.ACTION,
  })

  const closeCreateCard = () => {
    setShowNewCard(false)
  }

  const createNewCard = (actionName) => {
    dispatch(mooveActions.createCard(payloadCreateCard(actionName)))
    setShowNewCard(false)
  }

  return (
    <Styled.Wrapper>
      <ColumnHeader id={name} list={list} />
      <Styled.Content ref={contentRef}>
        <ColumnContent
          withAction
          id={id}
          type={name}
        >
          { map(list, (card, i) => <DraggableCard showActions key={i} {...card} index={i} />)}
          { showNewCard && (
            <DraggableNewCard
              showActions
              key="newCard"
              createCard={createNewCard}
              closeCreateCard={closeCreateCard}
              index={list.length + increment}
            />
          )}
        </ColumnContent>
      </Styled.Content>
      <Styled.ActionContent>
        <ButtonExpanded
          reversed
          icon={<PlusButtonSVG />}
          label="moove.button.createCard"
          onClick={handleClick}
        />
      </Styled.ActionContent>
    </Styled.Wrapper>
  )
}

ToDoColumn.defaultProps = {
  id: '',
  name: '',
  list: null,
  onCreateCard: null,
}

ToDoColumn.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  list: PropTypes.array,
  onCreateCard: PropTypes.func,
}

export default ToDoColumn
