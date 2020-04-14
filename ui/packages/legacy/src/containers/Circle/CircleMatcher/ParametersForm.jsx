import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { i18n } from 'core/helpers/translate'
import { Translate } from 'components'
import isEmpty from 'lodash/isEmpty'
import { THEME } from 'components/IconButton'
import PlusSVG from 'core/assets/svg/plus.svg'
import { FieldArray } from 'react-final-form-arrays'
import Styled from './styled'

const ParametersForm = ({ push, errors, intl, onChange }) => {
  const onRemove = (fields, index) => {
    fields.remove(index)
    onChange()
  }

  return (
    <Styled.ParametersFormWrapper>
      <FieldArray name="params">
        {({ fields }) => fields.map((name, index) => (
          <Styled.ParametersForm key={name}>
            <Styled.Input
              name={`${name}.key`}
              properties={{
                autoComplete: 'off',
                placeholder: i18n(intl, 'circle.circleMatcher.key'),
                onKeyUp: onChange,
              }}
              validate="required"
              placeholder="key"

            />
            <Styled.Input
              name={`${name}.value`}
              properties={{
                autoComplete: 'off',
                placeholder: i18n(intl, 'circle.circleMatcher.value'),
                onKeyUp: onChange,
              }}
              validate="required"

            />
            <Styled.Trash onClick={() => onRemove(fields, index)} />
          </Styled.ParametersForm>
        ))
          }
      </FieldArray>

      <Styled.Footer>
        <small><Translate id="circle.circleMatcher.addParameters" /></small>
        <Styled.IconButton
          disabled={!isEmpty(errors)}
          icon={<PlusSVG />}
          theme={THEME.DEFAULT}
          onClick={() => push('params', {})}
        >
          <Translate id="circle.circleMatcher.addParameter" />
        </Styled.IconButton>
      </Styled.Footer>
    </Styled.ParametersFormWrapper>
  )
}

ParametersForm.propTypes = {
  push: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default injectIntl(ParametersForm)
