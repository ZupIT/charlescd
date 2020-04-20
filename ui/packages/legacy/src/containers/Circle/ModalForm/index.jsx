import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Title, Translate } from 'components'
import { getPath, getQuery } from 'core/helpers/routes'
import { MODE } from 'containers/Circle/Form/Profile/constants'
import { ModalFormLoader } from 'containers/Circle/Loaders'
import { useDispatch } from 'react-redux'
import isUndefined from 'lodash/isUndefined'
import isEmpty from 'lodash/isEmpty'
import indexOf from 'lodash/indexOf'
import { getUserProfileData } from 'core/helpers/profile'
import { KEY_CODE_ENTER } from 'core/helpers/constants'
import UserSVG from 'core/assets/svg/ic_group.svg'
import ReleaseSVG from 'core/assets/svg/ic_rel_candidate.svg'
import EditSVG from 'core/assets/svg/edit.svg'
import MetricsSVG from 'core/assets/svg/metrics.svg'
import OverrideRelaseSVG from 'core/assets/svg/override-release.svg'
import useStep from 'core/helpers/step'
import { dateFrom } from 'core/helpers/date'
import { moduleActions } from 'containers/Module/state/actions'
import { useRelease } from 'containers/Circle/hooks/release'
import { RELEASE_TYPES } from 'containers/Moove/constants'
import { DASHBOARD_CIRCLES_EDIT, DASHBOARD_CIRCLES } from 'core/constants/routes'
import { useRouter, useParams } from 'core/routing/hooks'
import { useUploader } from '../hooks/useUploader'
import { TAB, SEGMENTS_TYPE, MATCHER_TYPE } from './constants'
import SegmentsActions from './SegmentsActions'
import ImportCSV from './ImportCSV'
import AttentionMessage from './AttentionMessage'
import AddRelease from './AddRelease'
import Styled from './styled'
import Metrics from '../Metrics'
import { useCircle } from '../hooks/circle'
import { REQUESTS_BY_CIRCLE, REQUESTS_ERRORS_BY_CIRCLE, METRIC_TYPES, ERROR_CHART, FAST_TIME, REQUESTS_LATENCY_BY_CIRCLE } from '../Metrics/constants'

const ModalFormCircle = () => {
  const query = getQuery()
  const history = useRouter()
  const dispatch = useDispatch()
  const { circleId } = useParams()
  const [{ uploadProgress, isUploading }, uploaderAction] = useUploader()
  const { createCircleWithFile, updateCircleWithFile } = uploaderAction
  const [{ circle, loading }, circleAction] = useCircle(circleId)
  const [, { undeploy }] = useRelease()
  const { saveCircle, updateCircle, setCircle, getCircle } = circleAction
  const { register, getValues } = useForm()
  const isEditMode = !isUndefined(circleId)
  const { step, stepHandler } = useStep(['name', 'segment'], isEditMode ? 'segment' : 'name')
  const [segmentMode, setSegmentMode] = useState(isEditMode ? MODE.VIEW : MODE.EDIT)
  const [profileMode, setProfileMode] = useState()
  const [tab, setTab] = useState(TAB.SEGMENTS)
  const [segmentType, setSegmentType] = useState()
  const [showAttentionMessage, setShowAttentionMessage] = useState(false)
  const [metricType, setMetricType] = useState(REQUESTS_BY_CIRCLE)
  const nameRef = useRef(null)
  const hasDeployment = !isUndefined(circle.deployment?.id)
  const hasRelease = isEditMode && hasDeployment
  const isMatcherTypeSimpleKV = circle.matcherType === MATCHER_TYPE.SIMPLE_KV
  const isSegmentTypeManually = segmentType === SEGMENTS_TYPE.MANUALLY

  useEffect(() => {
    getCircle(circleId)
    const tabName = query.get('tabName')

    if (!isEmpty(TAB[tabName])) {
      setTab(tabName)
    }
  }, [])

  useEffect(() => {
    if (nameRef.current) {
      register(nameRef.current)
      nameRef.current.focus()
    }
  }, [nameRef])

  useEffect(() => {
    dispatch(moduleActions.getModules())
  }, [])

  const undeployRelease = () => {
    undeploy(circle.deployment.id)
      .then(() => {
        setCircle({
          ...circle,
          deployment: {
            ...circle.deployment,
            status: RELEASE_TYPES.UNDEPLOYING,
          },
        })
      })
  }

  const onCloseModal = () => {
    window.location.href = DASHBOARD_CIRCLES
  }

  const onSave = ({ rules }) => {
    const { name } = getValues()
    const { ruleMatcherType } = circle
    const canPersist = !isUndefined(rules) && !isEmpty(name)
    const persistCircle = isEditMode ? updateCircle : saveCircle

    if (canPersist) {
      const data = {
        name,
        ruleMatcherType,
        rules,
        segmentations: [],
        authorId: getUserProfileData('id'),
      }

      persistCircle(data)
        .then(({ id }) => {
          if (!isEditMode) {
            history.push(getPath(DASHBOARD_CIRCLES_EDIT, [id]))
          } else {
            setSegmentMode(MODE.VIEW)
            setSegmentType(null)
            setProfileMode(MODE.VIEW)
            setCircle({ ...circle, matcherType: MATCHER_TYPE.REGULAR })
          }
        })
    }
  }

  const onSaveFile = (data) => {
    setSegmentMode(MODE.VIEW)
    const { name } = getValues()
    const persistCircle = isEditMode ? updateCircleWithFile : createCircleWithFile

    persistCircle({ ...data, name }, circleId).then((response) => {
      const routeToRedirect = getPath(DASHBOARD_CIRCLES_EDIT, [response?.id])
      if (isEditMode) {
        history.go(routeToRedirect)
      } else {
        history.push(routeToRedirect)
      }
    })
  }

  const onDeploy = (deployment) => {
    setTab(TAB.SEGMENTS)
    setCircle({ ...circle, deployment })
  }

  const onKeyUp = ({ target, keyCode }) => {
    keyCode === KEY_CODE_ENTER && target.blur()
  }

  const onSetName = () => {
    const { name } = getValues()

    if (!isEmpty(name)) {
      stepHandler.go('segment')
    }
    if (isEditMode && circle.matcherType === MATCHER_TYPE.REGULAR) {
      onSave(circle)
    }
    if (isEditMode && isMatcherTypeSimpleKV) {
      onSaveFile(circle)
    }
  }

  const handleClickCreateManually = () => {
    if (!isEditMode) {
      setProfileMode(MODE.EDIT)
    }
    if (isEditMode && isMatcherTypeSimpleKV) {
      setShowAttentionMessage(true)
    } else {
      setShowAttentionMessage(false)
    }
    setSegmentType(SEGMENTS_TYPE.MANUALLY)
  }

  const handleClickImportCSV = () => {
    if (isEditMode) {
      setShowAttentionMessage(true)
      setSegmentType(SEGMENTS_TYPE.IMPORT_CSV)
    } else {
      setShowAttentionMessage(false)
      setTab(TAB.IMPORT_CSV)
      setSegmentType(null)
    }
  }

  const onCancelAttentionMessage = () => {
    setShowAttentionMessage(false)
    setSegmentType(null)
  }

  const onContinueAttentionMessage = () => {
    if (segmentType === SEGMENTS_TYPE.IMPORT_CSV) {
      setShowAttentionMessage(false)
      setTab(TAB.IMPORT_CSV)
      setSegmentType(null)
    } else if (isMatcherTypeSimpleKV && isSegmentTypeManually) {
      setCircle({ ...circle, rules: {} })
      setProfileMode(MODE.EDIT)
      setShowAttentionMessage(false)
    }
  }

  const handleClickEditSegment = () => {
    setSegmentMode(MODE.EDIT)
    if (circle.matcherType === MATCHER_TYPE.REGULAR) {
      setProfileMode(MODE.EDIT)
    }
  }

  const renderImportedKvRecords = () => {
    const maxPreviewSize = 5
    if (circle.importedKvRecords <= maxPreviewSize) {
      return (
        <Translate id="circle.importedKvRecords" values={{ importedKvRecords: circle.importedKvRecords }} />
      )
    }

    return (
      <Translate
        id="circle.importedKvRecordsWithMaxSize"
        values={{ importedKvRecords: circle.importedKvRecords, maxPreviewSize }}
      />
    )
  }

  const renderReleaseContent = () => (
    <Styled.Content icon={<ReleaseSVG />}>
      <Styled.Step step={!isEmpty(circleId)}>
        <Title text="circle.release.candidate" />
        {
          hasRelease
            ? (
              <Styled.Release
                tag={circle.deployment?.build?.tag || circle.deployment?.tag}
                features={circle.deployment?.build?.features}
                deployment={circle.deployment}
                actions={[
                  { label: 'general.undeploy', action: undeployRelease },
                ]}
              />
            )
            : (
              <Styled.ReleaseButton onClick={() => setTab(TAB.RELEASE)}>
                <Styled.PlusIcon />
              </Styled.ReleaseButton>
            )
        }
      </Styled.Step>
    </Styled.Content>
  )

  const validateChangeMetricTypes = (index, listSize) => {
    const BASE_INDEX = 0
    const LAST_INDEX_ELEMENT = 1
    const LAST_INDEX = listSize - LAST_INDEX_ELEMENT

    if (index > LAST_INDEX) {
      return BASE_INDEX
    } if (index < BASE_INDEX) {
      return LAST_INDEX
    }

    return index
  }

  const handleChangeMetricTypes = (changeType) => {
    const COUNT = 1
    const currentItemIndex = indexOf(METRIC_TYPES, metricType)
    const indexCalculated = changeType === 'increase' ? currentItemIndex + COUNT : currentItemIndex - COUNT
    const currentIndex = validateChangeMetricTypes(indexCalculated, METRIC_TYPES.length)

    setMetricType(METRIC_TYPES[currentIndex])
  }

  const renderMetrics = () => (
    <Styled.Content icon={<MetricsSVG />}>
      <Styled.Step step={!isEmpty(circleId)}>
        <Styled.MetricsTitle>
          <Title text="circle.metrics" />
          <Styled.MetricsControl>
            <Styled.MetricsLabel>
              {metricType === REQUESTS_BY_CIRCLE && <Translate id="circle.chart.requests" />}
              {metricType === REQUESTS_ERRORS_BY_CIRCLE && <Translate id="circle.chart.errors" />}
              {metricType === REQUESTS_LATENCY_BY_CIRCLE && <Translate id="circle.chart.latency" />}
            </Styled.MetricsLabel>
            <Styled.SortLeft onClick={() => handleChangeMetricTypes('decrease')} />
            <Styled.SortRight onClick={() => handleChangeMetricTypes('increase')} />
          </Styled.MetricsControl>
        </Styled.MetricsTitle>
        <Styled.Chart>
          {metricType === REQUESTS_BY_CIRCLE && (
            <Metrics id={circleId} speed={FAST_TIME} metricType={metricType} />
          )}
          {metricType === REQUESTS_ERRORS_BY_CIRCLE && (
            <Metrics
              id={circleId}
              speed={FAST_TIME}
              metricType={metricType}
              options={ERROR_CHART}
            />
          )}
          {metricType === REQUESTS_LATENCY_BY_CIRCLE && (
            <Metrics id={circleId} speed={FAST_TIME} metricType={metricType} />
          )}
        </Styled.Chart>
      </Styled.Step>
    </Styled.Content>
  )

  const renderSegment = () => {
    const shouldRenderProfile = isSegmentTypeManually || isEditMode
    const shouldDisableProfile = isMatcherTypeSimpleKV && (profileMode !== MODE.EDIT)

    return (
      <>
        <Styled.Content icon={<UserSVG />}>
          <Styled.Step step={step.segment}>
            <Styled.SegmentInfo>
              <Title text="general.segments" />
              {
                isMatcherTypeSimpleKV
                && <Styled.ImportedAtCSV>CSV imported at {dateFrom(circle.importedAt)}</Styled.ImportedAtCSV>
              }
            </Styled.SegmentInfo>
            {segmentMode === MODE.EDIT
              && (
                <SegmentsActions
                  isEditMode={isEditMode}
                  matcherType={circle.matcherType}
                  segmentType={segmentType}
                  onClickCreateManually={handleClickCreateManually}
                  onClickImportCSV={handleClickImportCSV}
                />
              )
            }
            {showAttentionMessage && (
              <Styled.WarningSpaceHolder>
                <AttentionMessage
                  onCancel={onCancelAttentionMessage}
                  onContinue={onContinueAttentionMessage}
                  matcherType={circle.matcherType}
                  segmentType={segmentType}
                />
              </Styled.WarningSpaceHolder>
            )}
            {shouldRenderProfile && (
              <Styled.ProfileComponent
                engine={circle.ruleMatcherType}
                mode={profileMode}
                rules={circle.rules}
                onSave={onSave}
                disableProfile={shouldDisableProfile}
              />
            )}
            {
              isMatcherTypeSimpleKV && !isEmpty(circle.rules)
              && <Styled.TotalEntriesText>{renderImportedKvRecords()}</Styled.TotalEntriesText>
            }
          </Styled.Step>
        </Styled.Content>
        {renderReleaseContent()}
        {renderMetrics()}
      </>
    )
  }

  const render = () => (
    <>
      <Styled.Wrapper>
        <Styled.Content icon={<Styled.CircleIcon />}>
          <Styled.Form onSubmit={e => e.preventDefault()}>
            <Styled.Input
              resume
              type="text"
              name="name"
              ref={nameRef}
              autoComplete="off"
              onBlur={onSetName}
              onKeyUp={onKeyUp}
              defaultValue={circle.name}
              properties={register({ required: true })}
            />
          </Styled.Form>
        </Styled.Content>
        {tab === TAB.SEGMENTS && renderSegment()}
        {tab === TAB.IMPORT_CSV && (
          <ImportCSV
            onBack={() => setTab(TAB.SEGMENTS)}
            onSave={onSaveFile}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
          />
        )}
        {tab === TAB.RELEASE && (
          <AddRelease
            onBack={() => setTab(TAB.SEGMENTS)}
            onDeploy={onDeploy}
          />
        )}
      </Styled.Wrapper>
      <Styled.Menu.Wrapper enable={tab !== TAB.RELEASE}>
        <Styled.Menu.Title>
          <Translate id="circle.actions" />
        </Styled.Menu.Title>
        <Styled.Menu.Item onClick={handleClickEditSegment}>
          <EditSVG /> <Translate id="circle.action.editSegment" />
        </Styled.Menu.Item>
        {
          hasRelease && (
            <Styled.Menu.Item onClick={() => setTab(TAB.RELEASE)}>
              <OverrideRelaseSVG /> <Translate id="circle.action.overrideRelease" />
            </Styled.Menu.Item>
          )
        }
      </Styled.Menu.Wrapper>
    </>
  )

  return (
    <Styled.Modal size="large" onClose={() => onCloseModal()}>
      {showAttentionMessage && <Styled.UnfocusedWrapper />}
      {loading ? <ModalFormLoader /> : render()}
    </Styled.Modal>
  )
}

export default ModalFormCircle
