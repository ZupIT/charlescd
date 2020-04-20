import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ContentPage, ContentLayer, Title, Translate } from 'components'
import { Button, THEME, SIZE } from 'components/Button'
import isEmpty from 'lodash/isEmpty'
import { useRouter } from 'core/helpers/routes'
import { removeHtmlTags } from 'core/helpers/regex'
import { Editor, MODE } from 'containers/Editor'
import { hypothesisActions } from 'containers/Hypothesis/state/actions'
import CardComment from 'core/assets/svg/card-comment.svg'
import { ViewLoader } from 'containers/Hypothesis/Loaders'
import { StyledHypothesisView } from './styled'

const HypothesisView = ({ match }) => {
  const { params: { problemId, hypothesisId, valueFlowId } } = match
  const router = useRouter()
  const dispatch = useDispatch()
  const { hypothesis } = useSelector(selector => selector.hypothesis)

  useEffect(() => {
    if (!hypothesis) {
      dispatch(hypothesisActions.getHypothesisById(hypothesisId))
    }
  }, [hypothesis])

  useEffect(() => {
    return () => {
      dispatch(hypothesisActions.reset())
    }
  }, [])

  const renderContent = () => (
    <ContentPage.Dashboard>
      <ContentLayer icon={<CardComment />} margin="0 0 20px">
        <Title text={hypothesis.name} />
      </ContentLayer>
      <ContentLayer icon={<CardComment />} margin="0 0 20px">
        <StyledHypothesisView.Header>
          <Title text="general.description" />
          <Button
            theme={THEME.OUTLINE}
            size={SIZE.SMALL}
            onClick={() => (
              router.push(null, [valueFlowId, problemId, hypothesisId])
            )}
          >
            <Translate id="general.edit" />
          </Button>
        </StyledHypothesisView.Header>
        <StyledHypothesisView.DescContent>
          {
            !isEmpty(removeHtmlTags(hypothesis ?.description))
              ? <Editor initialContent={hypothesis.description} mode={MODE.VIEW} />
              : <span />
          }
        </StyledHypothesisView.DescContent>
      </ContentLayer>
    </ContentPage.Dashboard>
  )

  return (
    hypothesis ? renderContent() : <ViewLoader />
  )
}

export default HypothesisView
