import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import Styled from 'containers/Circle/ModalForm/styled'
import { useRelease } from 'containers/Circle/hooks/release'
import AutoSuggest from 'components/AutoSuggest'
import { Button, Translate } from 'components/index'
import debounce from 'core/helpers/debounce'
import { useScroll } from 'core/hooks/scroll'

const SearchRelease = ({ onDeploy }) => {
  const [buildName, setBuildName] = useState('')
  const [build, setBuild] = useState(null)
  const [releaseState, releaseActions] = useRelease()
  const { builds, loading, loadingDeploy } = releaseState
  const { setBuilds, getBuildsByName, createDeployment } = releaseActions

  useScroll(() => {
    if (!builds.last && !loading) {
      getBuildsByName(buildName)
    }

  }, '#react-autowhatever-search-builds')

  useEffect(() => {
    getBuildsByName()

  }, [])

  const resetBuild = () => setBuild(null)

  const onSelected = (e, { suggestion }) => {
    setBuild(suggestion)
    setBuildName(suggestion.tag)
  }

  const onFetchRequest = ({ value, reason }) => {
    const debounceTime = 500
    const content = filter(
      builds.content, ({ tag }) => tag.toLowerCase().includes(value.toLowerCase()),
    )

    resetBuild()

    if ((isEmpty(content) || isEmpty(value)) && reason === 'input-changed') {
      debounce(() => {
        getBuildsByName(value)
      }, debounceTime)

    } else {
      setBuilds({ ...builds, content })
    }
  }

  const onChangeBuildName = (e, { newValue }) => setBuildName(newValue)

  const onBlurBuildName = () => {
    const content = find(builds.content, ({ tag }) => tag === buildName) || null

    setBuild(content)
  }

  const deployRelease = () => {
    createDeployment(build)
      .then(onDeploy)
  }

  return (
    <>
      <Styled.Search>
        <Styled.Select width="300px">
          <Styled.Label><Translate id="circle.release.choose.search" /></Styled.Label>
          <AutoSuggest
            id="search-builds"
            suggestions={builds.content}
            onSuggestionSelected={onSelected}
            onSuggestionsFetchRequested={onFetchRequest}
            onSuggestionsClearRequested={() => builds.content}
            getSuggestionValue={() => buildName}
            shouldRenderSuggestions={() => true}
            renderSuggestion={({ tag }) => <span>{tag}</span>}
            inputProps={{
              value: buildName,
              onChange: onChangeBuildName,
              onBlur: onBlurBuildName,
            }}
          />
        </Styled.Select>
        <Styled.SearchLoading isLoading={loading} />
      </Styled.Search>
      <Styled.Display margin="30px 0 0" display="block" enable>
        <Button
          isLoading={loadingDeploy}
          onClick={deployRelease}
          properties={{
            disabled: isEmpty(build) || loadingDeploy,
          }}
        >
          <Translate id="general.deploy" />
        </Button>
      </Styled.Display>
    </>
  )
}

SearchRelease.propTypes = {
  onDeploy: PropTypes.func.isRequired,
}

export default React.memo(SearchRelease)
