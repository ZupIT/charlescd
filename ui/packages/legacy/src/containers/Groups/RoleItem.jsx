import React, { useState } from 'react'
import Switch from 'components/Switch'
import Styled from './styled'

const RoleItem = ({ name, value, onChange }) => {
  const [selected, setSelected] = useState(value)

  const handleSwitch = () => {
    setSelected(!selected)
    onChange(selected)
  }

  return (
    <Styled.RoleItemWrapper>
      <Styled.RoleItemContent>
        { name }
        <Switch value={selected} onChange={handleSwitch} />
      </Styled.RoleItemContent>
    </Styled.RoleItemWrapper>
  )
}

export default RoleItem
