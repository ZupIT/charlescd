import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import { FinalForm } from 'containers/FinalForm'
import { Translate } from 'components'
import { Button, THEME } from 'components/Button'
import { StyledModule } from '../styled'

const ModuleComponent = (props) => {
  const { component, onSubmit, onCancel } = props

  return (
    <Fragment>
      <StyledModule.Subtitle text="module.form.components" />
      <FinalForm
        initialValues={component}
        onSubmit={data => onSubmit(!isEmpty(component), data)}
      >
        {() => (
          <StyledModule.Form display="block">
            <StyledModule.Input
              spaceBetween
              name="name"
              label="module.form.label.name"
              properties={{ autoComplete: 'off' }}
              validate="required"
            />
            <StyledModule.Input
              spaceBetween
              name="contextPath"
              label="module.form.label.contextPath"
              properties={{ autoComplete: 'off' }}
              validate="required"
            />
            <StyledModule.Input
              spaceBetween
              name="port"
              type="number"
              label="module.form.label.port"
              properties={{ autoComplete: 'off' }}
              validate="required"
            />
            <StyledModule.Input
              spaceBetween
              name="healthCheck"
              label="module.form.label.healthCheck"
              properties={{ autoComplete: 'off' }}
              validate="required"
            />
            <StyledModule.Flex>
              {
                onCancel && (
                  <Button
                    type="button"
                    theme={THEME.OUTLINE}
                    margin="0 15px 0 0"
                    onClick={onCancel}
                  >
                    <Translate id="general.cancel" />
                  </Button>
                )
              }
              <Button type="submit">
                <Translate id="general.next" />
              </Button>
            </StyledModule.Flex>
          </StyledModule.Form>
        )}
      </FinalForm>
    </Fragment>
  )
}

ModuleComponent.defaultProps = {
  component: {},
  onCancel: null,
}

ModuleComponent.propTypes = {
  component: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
}

export default ModuleComponent
