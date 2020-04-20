import React from 'react'
import AvatarPNG from 'core/assets/img/avatar.png'
import Styled from './styled'

const Avatar = ({ src, defaultSrc, alt, className, margin }) => {
  const setImage = (e, img) => { e.target.src = img }

  const onError = (e) => {
    defaultSrc
      ? setImage(e, defaultSrc)
      : setImage(e, AvatarPNG)
  }

  return (
    <Styled.Image
      className={className}
      margin={margin}
      src={src}
      alt={alt}
      onError={onError}
    />
  )
}

export default Avatar
