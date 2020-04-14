import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import { useDispatch } from 'react-redux'
import Styled from 'containers/Circle/ModalForm/styled'
import { Translate } from 'components/index'
import AutoSuggest from 'components/AutoSuggest'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import modulesAPI from 'core/api/modules'
import { i18n } from 'core/helpers/translate'
import { toasterActions } from 'containers/Toaster/state/actions'
import { ZERO } from 'core/helpers/constants'
import { filterDataByName, checkComponentsDuplicate } from './helpers'

const Module = (props) => {
  const { intl, initialValues, modulesContent, moduleIndex, moduleList, onChange, onRemove } = props
  const dispatch = useDispatch()
  const [modules, setModules] = useState([])
  const [module, setModule] = useState({})
  const [moduleName, setModuleName] = useState('')
  const [components, setComponents] = useState([])
  const [component, setComponent] = useState({})
  const [componentName, setComponentName] = useState('')
  const [tags, setTags] = useState([])
  const [versions, setVersions] = useState([])
  const [versionName, setVersionName] = useState('')
  const [version, setVersion] = useState({})
  const [error, setError] = useState(false)
  const [loadingTags, setLoadingTags] = useState(false)
  const [componentId, setComponentId] = useState(null)

  const getTags = (com = component, vName = '') => {
    const checkComponent = checkComponentsDuplicate(moduleList, com)
    const isComponentDiff = com.id !== componentId
    setError(checkComponent)

    if (!checkComponent && !isEmpty(com) && !loadingTags && isComponentDiff) {
      setTags([])
      setVersions([])
      setLoadingTags(true)
      setComponentId(com.id)
      setVersionName(`${i18n(intl, 'general.loading')}...`)

      modulesAPI.getTags(com.id)
        .then((res) => {
          setTags(res.tags)
          setVersions(res.tags)
          setVersionName(vName)
        })
        .catch((e) => {
          setComponentId(null)
          setVersionName('')
          dispatch(toasterActions.toastFailed(e.message))
        })
        .finally(() => setLoadingTags(false))
    }
  }

  useEffect(() => {
    if (!isEmpty(initialValues) && initialValues.id !== module.id) {
      const [initCom] = initialValues.components
      const mod = find(modulesContent, ({ id }) => id === initialValues.id)
      const com = find(mod.components, ({ id }) => id === initCom.id)

      setModuleName(mod.name)
      setComponentName(com.name)
      setComponent(com)
      setModule(mod)
      getTags(com, initCom.version)
    }

  }, [initialValues])

  const onFetch = (items, value, setState) => setState(filterDataByName(items, value))

  const onSelectModule = (e, { suggestion }) => {
    setModule(suggestion)
    setComponents(suggestion.components)
    setComponentName('')
  }

  const onHighlightedModule = ({ suggestion }) => {
    if (suggestion) {
      setModule(suggestion)
      setComponents(suggestion.components)
      setModuleName(suggestion.name)
      setComponentName('')
    }
  }

  const onHighlightedComponent = ({ suggestion }) => {
    if (suggestion) {
      setComponent(suggestion)
      setComponentName(suggestion.name)
      onChange({
        id: suggestion.moduleId,
        components: [{
          id: suggestion.id,
          version: '',
          artifact: '',
        }],
      })
    }
  }

  const onHighlightedVersion = ({ suggestion }) => {
    if (suggestion) {
      setVersion(suggestion)
      setVersionName(suggestion.name)
      onChange({
        id: module.id,
        components: [{
          id: component.id,
          version: suggestion.name,
          artifact: suggestion.artifact,
        }],
      })
    }
  }

  const onSelectComponent = (e, { suggestion }) => {
    setComponent(suggestion)
    getTags()
  }

  return (
    <Styled.Display margin="30px 0 0" enable>
      <Styled.Select>
        <Styled.Label><Translate id="circle.release.choose.module" /></Styled.Label>
        <AutoSuggest
          suggestions={modules}
          onSuggestionSelected={onSelectModule}
          onSuggestionHighlighted={onHighlightedModule}
          onSuggestionsFetchRequested={({ value }) => onFetch(modulesContent, value, setModules)}
          onSuggestionsClearRequested={() => setModules(modulesContent)}
          getSuggestionValue={({ name }) => name}
          shouldRenderSuggestions={() => true}
          renderSuggestion={({ name }) => <span>{name}</span>}
          inputProps={{
            value: moduleName,
            onChange: (e, { newValue }) => setModuleName(newValue),
            onBlur: () => setModuleName(module?.name || ''),
          }}
        />
      </Styled.Select>
      <Styled.Select>
        <Styled.Step step={!isEmpty(module)}>
          <Styled.Label><Translate id="circle.release.choose.component" /></Styled.Label>
          <AutoSuggest
            suggestions={components}
            onSuggestionSelected={onSelectComponent}
            onSuggestionHighlighted={onHighlightedComponent}
            onSuggestionsFetchRequested={({ value }) => {
              onFetch(module?.components, value, setComponents)
            }}
            onSuggestionsClearRequested={() => null}
            getSuggestionValue={({ name }) => name}
            shouldRenderSuggestions={() => true}
            renderSuggestion={({ name }) => <span>{name}</span>}
            inputProps={{
              value: componentName,
              disabled: isEmpty(module) || loadingTags,
              onChange: (e, { newValue }) => setComponentName(newValue),
              onBlur: () => setComponentName(component?.name || ''),
            }}
          />
          {error && <Styled.Error><Translate id="circle.release.component.duplicated" /></Styled.Error>}
        </Styled.Step>
      </Styled.Select>
      <Styled.Select>
        <Styled.Step step={!isEmpty(tags) && !error}>
          <Styled.Label><Translate id="circle.release.choose.version" /></Styled.Label>
          <AutoSuggest
            suggestions={versions}
            onSuggestionSelected={(e, { suggestion }) => setVersion(suggestion)}
            onSuggestionHighlighted={onHighlightedVersion}
            onSuggestionsFetchRequested={({ value }) => onFetch(tags, value, setVersions)}
            onSuggestionsClearRequested={() => null}
            getSuggestionValue={({ name }) => name}
            shouldRenderSuggestions={() => true}
            renderSuggestion={({ name }) => <span>{name}</span>}
            inputProps={{
              value: versionName,
              disabled: isEmpty(tags) || error,
              onChange: (e, { newValue }) => setVersionName(newValue),
              onBlur: () => setVersionName(version?.name || ''),
            }}
          />
        </Styled.Step>
      </Styled.Select>
      {moduleIndex !== ZERO && <Styled.Trash onClick={onRemove} />}
    </Styled.Display>
  )
}

Module.propTypes = {
  intl: intlShape.isRequired,
  modulesContent: PropTypes.array.isRequired,
  moduleIndex: PropTypes.number.isRequired,
  moduleList: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
}

export default injectIntl(Module)
