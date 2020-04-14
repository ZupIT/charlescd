import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { Translate } from 'components'
import isEmpty from 'lodash/isEmpty'
import { THEME } from 'components/IconButton'
import PlusSVG from 'core/assets/svg/plus.svg'
import { FieldArray } from 'react-final-form-arrays'
import Styled from './styled'

const ParametersForm = ({ push, errors, onChange }) => {
  const firstParameter = 0

  const onRemove = (fields, index) => {
    fields.remove(index)
    onChange()
  }

  return (
    <Styled.FormItem>
      <FieldArray name="params">
        {({ fields }) => fields.map((name, index) => (
          <Styled.FormItemParameter key={name}>
            <Styled.Input
              label="module.form.componentName"
              name={`${name}.name`}
              properties={{
                autoComplete: 'off',
                onKeyUp: onChange,
              }}
              validate="required"
            />
            {index !== firstParameter && <Styled.Trash onClick={() => onRemove(fields, index)} />}
          </Styled.FormItemParameter>
        ))}
      </FieldArray>


      <Styled.IconButton
        disabled={!isEmpty(errors.params)}
        icon={<PlusSVG />}
        theme={THEME.DEFAULT}
        onClick={() => push('params', {})}
      >
        <Translate id="module.form.addComponentName" />
      </Styled.IconButton>

    </Styled.FormItem>
  )
}

ParametersForm.propTypes = {
  push: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default injectIntl(ParametersForm)
