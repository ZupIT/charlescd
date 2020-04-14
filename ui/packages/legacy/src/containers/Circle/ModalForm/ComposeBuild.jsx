import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import map from 'lodash/map'
import last from 'lodash/last'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import PlusSVG from 'core/assets/svg/plus.svg'
import { Button, Translate } from 'components'
import { IconButton, THEME } from 'components/IconButton'
import Styled from './styled'
import Module from './Module'
import { groupModulesById } from './helpers'
import { useRelease } from '../hooks/release'

const ComposeBuild = ({ onDeploy }) => {
  const releasePrefix = 'release-darwin-'
  const { modules: { content: modulesContent } } = useSelector(state => state.modules)
  const { register, getValues } = useForm()
  const [modules, setModules] = useState([{}])
  const [disableButton, setDisableButton] = useState(false)
  const [disableDeploy, setDisableDeploy] = useState(true)
  const [{ loadingDeploy }, { buildDeploy }] = useRelease()

  const checkActions = () => {
    const { releaseName } = getValues()
    const lastModule = last(modules)
    const [component] = lastModule?.components || []
    const isComponentValid = isEmpty(component?.version)

    setDisableButton(isComponentValid)
    setDisableDeploy(isEmpty(releaseName) || isComponentValid)
  }

  useEffect(() => {
    checkActions()
  }, [modules])

  const addModule = (index, module) => {
    const moduleList = map(modules, (m, idx) => idx === index ? module : m)
    setModules(moduleList)
  }

  const removeModule = (index) => {
    const result = filter(modules, (m, idx) => idx !== index)
    setModules(result)
  }

  const createRelease = () => {
    const { releaseName } = getValues()

    buildDeploy({
      releaseName: `${releasePrefix}${releaseName}`,
      modules: groupModulesById(modules),
    })
      .then(onDeploy)
  }

  return (
    <>
      <Styled.FormRelease onSubmit={e => e.preventDefault()}>
        <Styled.Label><Translate id="circle.release.choose.name" /></Styled.Label>
        <Styled.Display margin="5px 0 0" enable>
          <Styled.Prefix>{releasePrefix}</Styled.Prefix>
          <Styled.Input
            type="text"
            name="releaseName"
            autoComplete="off"
            onChange={checkActions}
            properties={register({ required: true })}
          />
        </Styled.Display>
      </Styled.FormRelease>
      {
        map(modules, (m, index) => (
          <Module
            key={index}
            initialValues={m}
            moduleIndex={index}
            moduleList={modules}
            modulesContent={modulesContent}
            onChange={module => addModule(index, module)}
            onRemove={() => removeModule(index)}
          />
        ))
      }
      <Styled.Display margin="30px 0 0" display="block" enable>
        <Styled.Label><Translate id="circle.release.module.add" /></Styled.Label>
        <IconButton
          icon={<PlusSVG />}
          theme={THEME.DEFAULT}
          onClick={() => setModules([...modules, {}])}
          properties={{
            disabled: disableButton,
          }}
        >
          <Translate id="module.action.add" />
        </IconButton>
      </Styled.Display>
      <Styled.Display margin="30px 0 0" display="block" enable>
        <Button
          onClick={createRelease}
          isLoading={loadingDeploy}
          properties={{ disabled: disableDeploy || loadingDeploy }}
        >
          <Translate id="general.deploy" />
        </Button>
      </Styled.Display>
    </>
  )
}

ComposeBuild.propTypes = {
  onDeploy: PropTypes.func.isRequired,
}

export default ComposeBuild
