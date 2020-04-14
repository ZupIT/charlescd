import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import CloseDarkSVG from 'core/assets/svg/close-dark.svg'
import Translate from 'components/Translate'
import Styled from './styled'

const ModalFullContent = ({ children, className, onClose }) => {
  useEffect(() => {
    document.body.style.overflowY = 'hidden'

    return () => { document.body.style.overflowY = 'auto' }
  }, [])

  const renderButton = () => (
    <Styled.CloseButton
      onClick={onClose}
    >
      <CloseDarkSVG /> <Translate id="modalFullScreen.close" />
    </Styled.CloseButton>
  )

  return (
    <Styled.Wrapper className={className}>
      <Styled.Header>
        { onClose && renderButton() }
      </Styled.Header>
      <Styled.Content>
        {children}
      </Styled.Content>
    </Styled.Wrapper>
  )
}

ModalFullContent.defaultProps = {
  onClose: null,
}

ModalFullContent.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
}

export default ModalFullContent
