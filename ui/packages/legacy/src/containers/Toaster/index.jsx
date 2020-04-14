import React from 'react'
import get from 'lodash/get'
import map from 'lodash/map'
import { useSelector } from 'react-redux'
import { Translate } from 'components'
import { CircleError, CircleCheck } from 'animations'
import Styled from './styled'

const Toaster = () => {
  const toasts = useSelector(state => state.toaster)

  const renderIcon = toast => ({
    FAILED: { icon: <CircleError /> },
    SUCCESS: { icon: <CircleCheck /> },
  }[toast])

  const renderToast = ({ key, toast, message }) => (
    <Styled.Toast key={{ key }} toast={toast}>
      <Styled.Line />
      <Styled.Body>
        { get(renderIcon(toast), 'icon') }
        <Styled.Text>
          <Translate id={message} />
        </Styled.Text>
      </Styled.Body>
    </Styled.Toast>
  )

  return (
    <Styled.Wrapper>
      { map(toasts, (toast, index) => renderToast({ key: index, ...toast })) }
    </Styled.Wrapper>
  )
}

export default Toaster
