import React, { useState } from 'react'
import PropTypes from 'prop-types'
import GitSVG from 'core/assets/svg/git.svg'
import SearchSVG from 'core/assets/svg/search.svg'
import { COLORS } from 'core/assets/themes'
import { Toggle, Translate } from 'components'
import SearchRelease from './SearchRelease'
import { RELEASE_MODE } from './constants'
import Styled from './styled'
import ComposeBuild from './ComposeBuild'

const AddRelease = ({ onBack, onDeploy }) => {
  const [mode, setMode] = useState(RELEASE_MODE.DEFAULT)

  return (
    <Styled.AddReleaseWrapper>
      <Styled.ArrowBack onClick={onBack} />
      <Styled.Title primary text="circle.addRealease" />
      <Styled.Display display="block" enable>
        <small><Translate id="circle.release.choose" /></small>
        <Styled.Display enable>
          <Toggle
            name="circle.release.choose.create"
            icon={<GitSVG color={COLORS.COLOR_WHITE} />}
            color={COLORS.PRIMARY}
            onClick={() => setMode(RELEASE_MODE.CREATE)}
            selected={mode === RELEASE_MODE.CREATE}
          />
          <Toggle
            name="circle.release.choose.search"
            icon={<SearchSVG />}
            color={COLORS.PRIMARY}
            onClick={() => setMode(RELEASE_MODE.SEARCH)}
            selected={mode === RELEASE_MODE.SEARCH}
          />
        </Styled.Display>
      </Styled.Display>
      <Styled.Display display="block" enable={mode === RELEASE_MODE.CREATE}>
        <ComposeBuild onDeploy={onDeploy} />
      </Styled.Display>
      <Styled.Display margin="30px 0 0" display="block" enable={mode === RELEASE_MODE.SEARCH}>
        <SearchRelease onDeploy={onDeploy} />
      </Styled.Display>
    </Styled.AddReleaseWrapper>
  )
}

AddRelease.propTypes = {
  onBack: PropTypes.func.isRequired,
  onDeploy: PropTypes.func.isRequired,
}

export default AddRelease
