/* eslint-disable  */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useRouter } from 'core/helpers/routes'
import { ModalOverlayed, ContentLayer } from 'components'
// import { Styled } from './styled'
import SidebarSVG from 'core/assets/svg/sidebar.svg'
import { mooveActions } from './state/actions'
import { StyledMoove } from '../styled'

const CardView = (props) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { register } = useForm()
  const { card, loading: { comments, card: cardLoading } } = useSelector(selector => selector.moove)
  const { match: { params: { cardId } } } = props

  useEffect(() => {
    !card && dispatch(mooveActions.getCard(cardId))
  }, [card])

  const onUpdateName = () => {}
  const onUpdateUsers = () => {}
  const onUpdateModules = () => {}
  const onUpdateDescription = () => {}
  const onAddComments = () => {}

  return (
    <ModalOverlayed
      size="large"
      onClose={() => router.goBack()}
    >
      <ContentLayer icon={<SidebarSVG />} margin="0 0 20px">
        <StyledMoove.View.Input
          resume
          type="text"
          name="name"
          onKeyUp={onUpdateName}
          defaultValue={card?.name}
          autoComplete="off"
          properties={register({ required: true })}
        />
      </ContentLayer>
    </ModalOverlayed>
  )
}

export default CardView
