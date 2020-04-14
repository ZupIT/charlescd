import React, { Fragment, useState, useEffect } from 'react'
import { Translate, Button, Title, ModalFullContent } from 'components'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfileData } from 'core/helpers/profile'
import { FinalForm } from 'containers/FinalForm'
import { useRouter } from 'core/helpers/routes'
import Resume from 'containers/Resume'
import isEmpty from 'lodash/isEmpty'
import { FormLoader } from './Loaders'
import { StyledHypothesis } from './styled'
import HypothesisDescription from './Description'
import { hypothesisActions } from './state/actions'

const Hypothesis = (props) => {
  const { match } = props
  const { valueFlowId } = match.params
  const [payload, setPayload] = useState({ name: '', description: '' })
  const { hypothesis, loading } = useSelector(selector => selector.hypothesis)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const { hypothesisId } = match.params

    if (hypothesisId && !hypothesis) {
      dispatch(hypothesisActions.getHypothesisById(hypothesisId))
    }

    if (hypothesis) {
      const { name, description } = hypothesis
      setPayload({ name, description })
    }

  }, [hypothesis])

  useEffect(() => {
    return () => {
      dispatch(hypothesisActions.reset())
    }
  }, [])

  const handleName = ({ name }, resumeFn) => {
    setPayload({ ...payload, name })
    resumeFn()
  }

  const handleDescription = (description) => {
    setPayload({ ...payload, description })
  }

  const onSubmit = () => {
    const { problemId, hypothesisId } = match.params

    if (hypothesisId) {
      return dispatch(
        hypothesisActions.updateHypothesis({
          valueFlowId,
          problemId,
          hypothesisId,
        }, payload),
      )
    }

    return dispatch(hypothesisActions.createHypothesis({
      ...payload,
      authorId: getUserProfileData('id'),
      problemId,
      valueFlowId,
    }))
  }

  const renderContent = () => (
    <Fragment>
      <StyledHypothesis.Content>
        <Resume initial={!isEmpty(payload.name)} name="general.name" tags={[payload.name]}>
          {resumeFn => (
            <FinalForm
              initialValues={{ name: payload.name }}
              onSubmit={data => handleName(data, resumeFn)}
            >
              {() => (
                <StyledHypothesis.Form>
                  <StyledHypothesis.Input
                    name="name"
                    label="hypothesis.input.name"
                    properties={{ autoComplete: 'off' }}
                    validate="required"
                  />
                  <Button type="submit" margin="0 15px">
                    <Translate id="general.ok" />
                  </Button>
                </StyledHypothesis.Form>
              )}
            </FinalForm>
          )}
        </Resume>
      </StyledHypothesis.Content>
      {payload.name && (
        <Fragment>
          <HypothesisDescription description={payload.description} onChange={handleDescription} />
          <Button
            isLoading={loading}
            onClick={onSubmit}
            properties={{
              disabled: loading,
            }}
          >
            <Translate id="general.save" />
          </Button>
        </Fragment>
      )}
    </Fragment>
  )

  return (
    <ModalFullContent onClose={router.goBack}>
      <Title primary text="hypothesis.title" />
      { loading ? <FormLoader /> : renderContent() }
    </ModalFullContent>
  )
}

export default Hypothesis
