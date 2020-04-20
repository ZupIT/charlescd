import React from 'react'
import Switch from 'react-switch'
import { SWITCH } from 'core/assets/themes'

const SwitchComponent = (props) => {
  const { value, onChange } = props

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label>
      <Switch
        width={28}
        height={14}
        offColor={SWITCH.OFF_COLOR}
        onColor={SWITCH.ON_COLOR}
        uncheckedIcon={false}
        checkedIcon={false}
        onChange={onChange}
        checked={value}
        className="react-switch"
      />
    </label>
  )
}

export default SwitchComponent
