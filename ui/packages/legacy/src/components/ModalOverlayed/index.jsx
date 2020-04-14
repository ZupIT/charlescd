import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import CloseIcon from 'core/assets/svg/close.svg'
import { useOnClickOutside } from 'core/helpers/hooks'
import { Styled } from './styled'

const ModalOverlayed = (props) => {
  const { children, className, onClose, size, vertical } = props
  const modalRef = useRef(null)

  useOnClickOutside(modalRef, () => onClose())

  useEffect(() => {
    document.body.style.overflowY = 'hidden'

    return () => { document.body.style.overflowY = 'auto' }
  }, [])

  return (
    <Styled.Wrapper vertical={vertical}>
      <Styled.Modal className={className} size={size} ref={modalRef}>
        <Styled.CloseIcon onClick={onClose}>
          <CloseIcon />
        </Styled.CloseIcon>
        { children }
      </Styled.Modal>
    </Styled.Wrapper>
  )
}

ModalOverlayed.defaultProps = {
  onClose: null,
  className: '',
  size: '',
}

ModalOverlayed.propTypes = {
  onClose: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large', '']),
}

export default ModalOverlayed
