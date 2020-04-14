import React, { Fragment, useState, useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfileData } from 'core/helpers/profile'
import Resume from 'containers/Resume'
import useStep from 'core/helpers/step'
import { FinalForm } from 'containers/FinalForm'
import { circleActions } from 'containers/Circle/state/actions'
import Profile from 'containers/Circle/Form/Profile'
import { FormLoader } from 'containers/Circle/Loaders'
import { intlShape, injectIntl } from 'react-intl'
import { i18n } from 'core/helpers/translate'
import { Button, ContentPage, Translate, Title, Toggle } from 'components'
import { COLORS } from 'core/assets/themes'
import CharlesSVG from 'core/assets/svg/charles.svg'
import { ENGINE } from './Profile/constants'
import { FIRST_ELEMENT } from './Profile/helpers'
import { StyledCircle } from './styled'

const CreateCircle = ({ intl, match }) => {
  const { circleId } = match.params
  const title = circleId ? 'circle.action.edit' : 'circle.action.create'
  const stepInit = circleId ? 'finish' : 'name'
  const { step, stepHandler } = useStep(['name', 'type', 'profile', 'finish'], stepInit)
  const [payload, setPayload] = useState({})
  const dispatch = useDispatch()
  const { circle, loadingCircle, loading } = useSelector(selector => selector.circle)

  useEffect(() => {
    if (circleId) {
      dispatch(circleActions.getCircleById(circleId))
    }
  }, [])

  useEffect(() => {
    if (!isEmpty(circle)) {
      setPayload(circle)
    }

  }, [circle])

  const handleName = ({ name }, resumeFn) => {
    setPayload({ ...payload, name })
    stepHandler.next()
    resumeFn()
  }

  const handleType = (type, resumeFn) => {
    setPayload({ ...payload, ruleMatcherType: type })
    stepHandler.next()
    resumeFn()
  }

  const handleProfile = ({ rules }, resumeFn) => {
    setPayload({ ...payload, rules })
    stepHandler.next()
    resumeFn()
  }

  const handleProfileTags = () => {
    const clauses = payload ?.rules ?.clauses ?.[FIRST_ELEMENT]
    const type = clauses ?.type
    const content = type === 'CLAUSE'
      ? clauses ?.clauses ?.[FIRST_ELEMENT] ?.content
      : clauses ?.content

    const keyTranslate = i18n(intl, `profile.entity.${content ?.key}`)
    const condTranslate = i18n(intl, `profile.operator.${content ?.condition}`)
    const tag = `${keyTranslate} • ${condTranslate} • ${[content ?.value]}`

    return [tag]
  }

  const saveCircle = () => {
    const data = {
      ...payload,
      segmentations: [''],
      authorId: getUserProfileData('id'),
    }

    if (circleId) {
      return dispatch(circleActions.updateCircle(circleId, data))
    }

    return dispatch(circleActions.saveCircle(data))
  }

  const renderContent = () => (
    <Fragment>
      <Title primary text={title} />
      <StyledCircle.Step step={step.name}>
        <Resume initial={!isEmpty(payload.name)} name="general.name" tags={[payload.name]}>
          {resumeFn => (
            <FinalForm
              initialValues={{ name: payload.name }}
              onSubmit={data => handleName(data, resumeFn)}
            >
              {() => (
                <StyledCircle.Form>
                  <StyledCircle.Input
                    name="name"
                    label="circle.input.name"
                    properties={{ autoComplete: 'off' }}
                    validate="required"
                  />
                  <Button type="submit" margin="0 15px">
                    <Translate id="general.ok" />
                  </Button>
                </StyledCircle.Form>
              )}
            </FinalForm>
          )}
        </Resume>
      </StyledCircle.Step>
      <StyledCircle.Step step={step.type}>
        <Resume
          name="circle.engine"
          disable={!isEmpty(circleId)}
          initial={!isEmpty(payload.ruleMatcherType)}
          tags={[i18n(intl, `circle.type.${payload.ruleMatcherType}`)]}
        >
          {resumeFn => (
            <Fragment>
              <Translate id="circle.choose.engine" />
              <StyledCircle.Flex>
                <Toggle
                  name="circle.type.DARWIN"
                  icon={<CharlesSVG color={COLORS.COLOR_WHITE} />}
                  color={COLORS.PRIMARY}
                  selected={payload.ruleMatcherType === ENGINE.DARWIN}
                  onClick={() => handleType(ENGINE.DARWIN, resumeFn)}
                />
                <Toggle
                  name="circle.type.REALWAVE"
                  color={COLORS.PRIMARY}
                  selected={payload.ruleMatcherType === ENGINE.REALWAVE}
                  onClick={() => handleType(ENGINE.REALWAVE, resumeFn)}
                />
              </StyledCircle.Flex>
            </Fragment>
          )}
        </Resume>
      </StyledCircle.Step>
      <StyledCircle.Step step={step.profile}>
        <Resume initial={!isEmpty(payload.rules)} name="circle.segment" tags={handleProfileTags()}>
          {resumeFn => (
            <Fragment>
              <StyledCircle.Label>
                <Translate id="circle.input.profile" />
              </StyledCircle.Label>
              <Profile
                rules={payload.rules}
                engine={payload.ruleMatcherType}
                onSave={profile => handleProfile(profile, resumeFn)}
              />
            </Fragment>
          )}
        </Resume>
      </StyledCircle.Step>
      <StyledCircle.Step step={step.finish}>
        <Button
          isLoading={loading}
          onClick={saveCircle}
          properties={{
            disabled: loading,
          }}
        >
          <Translate id="general.finish" />
        </Button>
      </StyledCircle.Step>
    </Fragment>
  )

  return (
    <ContentPage.Dashboard>
      {loadingCircle ? <FormLoader /> : renderContent()}
    </ContentPage.Dashboard>
  )
}

CreateCircle.propTypes = {
  intl: intlShape.isRequired,
}

export default injectIntl(CreateCircle)
