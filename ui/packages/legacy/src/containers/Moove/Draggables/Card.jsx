/* eslint-disable */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import map from 'lodash/map'
import { TYPES } from 'containers/Moove/constants'
import { DropdownMenu } from 'components'
import Avatar from 'components/Avatar'
import { useRouter } from 'core/routing/hooks'
import { mooveActions } from 'containers/Moove/state/actions'
import GitSVG from 'core/assets/svg/git.svg'
import { DASHBOARD_HYPOTHESES_CARD } from 'core/constants/routes'
import { Styled } from './styled'

const DraggableCard = (props) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [displayList, setDisplayList] = useState(false)
  const { id, index, type, name, members, showActions, feature, temporaryLoading, hypothesisId } = props

  const openRepository = (branchLink) => {
    window.open(branchLink, '_blank_')
  }

  const deleteCard = () => {
    dispatch(mooveActions.deleteCard(id))
  }

  const archiveCard = () => {
    dispatch(mooveActions.archiveCard(id))
  }

  const ifFeature = () => type === TYPES.FEATURE

  const expandCard = () => {
    setDisplayList(!displayList)
  }

  const openCard = () => {
    router.push(DASHBOARD_HYPOTHESES_CARD, hypothesisId, id)
  }

  const renderUsers = () => (
    <Styled.Card.Members>
      { map(members, (member, i) => (
        <Avatar key={i} src={member.photoUrl} />
      )) }
    </Styled.Card.Members>
  )

  const renderHeader = () => (
    <Styled.Card.Header>
      <Styled.Card.HeaderItem
        onClick={() => setDisplayList(!displayList)}
      >
        { ifFeature() && <GitSVG onClick={() => expandCard()} /> }
      </Styled.Card.HeaderItem>

      { showActions && (
        <DropdownMenu
          dark={ifFeature()}
          options={[
            { label: 'general.archive', action: archiveCard },
            { label: 'general.remove', action: deleteCard },
          ]}
        />
      )}
    </Styled.Card.Header>
  )

  const renderContent = () => (
    <Styled.Card.Content
      onClick={() => temporaryLoading ? null : openCard()}
    >
      {name}
      { renderUsers() }
    </Styled.Card.Content>
  )

  const renderExpandedContent = () => (
    <Styled.Card.ExpandedContent display={displayList}>
      { feature && map(feature.branches, (branch, branchIndex) => (
        <Styled.Card.ExpandedItem
          key={branchIndex}
          onClick={() => openRepository(branch)}
        >
          { feature?.modules[branchIndex].name }
        </Styled.Card.ExpandedItem>
      )) }
    </Styled.Card.ExpandedContent>
  )

  const renderExpandedAction = () => (
    <Styled.Card.ActionContent display={displayList}>
      <Styled.Card.Action
        onClick={() => setDisplayList(!displayList)}
      />
    </Styled.Card.ActionContent>
  )

  return (
    <Styled.Card.Wrapper
      id={id}
      index={index}
      type={type}
    >
      { renderHeader() }
      { renderContent() }
      { renderExpandedContent() }
      { renderExpandedAction() }
    </Styled.Card.Wrapper>
  )
}


export default DraggableCard
