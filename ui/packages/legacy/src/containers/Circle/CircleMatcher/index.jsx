import React, { useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { Button, Translate } from 'components'
import { FinalForm, CodeEditor } from 'containers/FinalForm'
import arrayMutators from 'final-form-arrays'
import Actions from './Actions'
import ParametersForm from './ParametersForm'
import Result from './Result'
import CirclesLoader from './CirclesLoader'
import CircleTab from '../Tab'
import { TAB } from '../constants'
import { buildParameters, parseParameters } from './helpers'
import { useCircleMatcher } from '../hooks/circleMatcher'
import { ACTIONS } from './constants'
import Styled from './styled'

const renderCodeEditor = (isDefault, params = {}) => {
  const SPACER = 2
  const value = JSON.stringify(params, null, SPACER)
  const defaultProps = { name: 'parameters', readOnly: isDefault }

  return (
    <Styled.EditorWrapper>
      {isDefault ? (
        <CodeEditor value={value} {...defaultProps} />
      ) : (
        <CodeEditor {...defaultProps} />
      ) }
    </Styled.EditorWrapper>
  )
}

const CircleMatcher = () => {
  const [selectedAction, setSelectedAction] = useState(ACTIONS.DEFAULT)
  const [{ circles, isLoading }, { getCircles, setCircles }] = useCircleMatcher()
  const isDefault = selectedAction === ACTIONS.DEFAULT

  const onSubmit = async (values) => {
    const data = isDefault ? values.parameters : parseParameters(values.parameters)

    await getCircles(data)
  }

  const handleChange = (getState, change) => {
    const params = getState()?.values?.params
    const buildedParams = buildParameters(params)
    change('parameters', buildedParams)
  }

  const handleSelectAction = (action, resetForm) => {
    setCircles([])
    setSelectedAction(action)
    resetForm()
  }

  const renderTab = () => <CircleTab highlightItem={TAB.CIRCLE_MATCHER} />

  const renderParametersForm = () => (
    <FinalForm
      mutators={{ ...arrayMutators }}
      onSubmit={onSubmit}
    >
      {({
        submitting, errors, values, form: { change, reset, getState, mutators: { push } },
      }) => (
        <>
          <Actions
            selectedAction={selectedAction}
            setSelectedAction={action => handleSelectAction(action, reset)}
          />
          { renderCodeEditor(isDefault, values.parameters) }
          { selectedAction === ACTIONS.DEFAULT && (
            <ParametersForm
              push={push}
              errors={errors}
              onChange={() => handleChange(getState, change)}
            />
          )}
          <Button
            type="submit"
            margin="30px 0 0 0"
            disabled={submitting || isEmpty(values.parameters)}
          >
            <Translate id="circle.circleMatcher.try" />
          </Button>
        </>
      )
      }
    </FinalForm>
  )

  return (
    <Styled.Wrapper>
      <Styled.Content>
        { renderParametersForm() }
        { isLoading ? (
          <CirclesLoader />
        ) : (
          !isEmpty(circles) && <Result circles={circles} />
        )}
      </Styled.Content>
    </Styled.Wrapper>
  )
}

export default CircleMatcher
