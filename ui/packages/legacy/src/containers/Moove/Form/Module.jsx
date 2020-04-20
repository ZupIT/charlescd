import React, { Fragment, useState, useEffect } from 'react'
import map from 'lodash/map'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import { useDispatch, useSelector } from 'react-redux'
import Translate from 'components/Translate'
import Label from 'components/Label'
import Resume from 'containers/Resume'
import { Button } from 'components'
import ModulesLoader from 'containers/Moove/Loaders/ModulesLoader'
import { mooveActions } from 'containers/Moove/state/actions'
import PropTypes from 'prop-types'
import CardList from '../CardList'
import { StyledForm } from './styled'


const Module = ({ modules, onComplete }) => {
  const dispatch = useDispatch()
  const [internalModules, setInternalModules] = useState(modules)
  const { loading, modules: stateModules } = useSelector(state => state.moove)

  useEffect(() => {
    setInternalModules(modules)
  }, [modules])

  const getSelectedCards = () => {
    return filter(internalModules, ({ selected }) => selected)
  }

  const handleNext = (resumeFn) => {
    onComplete(getSelectedCards())
    resumeFn()
  }

  const renderButton = resumeFn => (
    <Button
      margin="10px 0"
      onClick={() => handleNext(resumeFn)}
      properties={{
        disabled: isEmpty(getSelectedCards()),
      }}
    >
      <Translate id="general.next" />
    </Button>
  )

  const renderListItems = resumeFn => (
    <Fragment>
      <Label id="moove.create.selectType" />
      <CardList
        list={stateModules}
        onSelectItem={setInternalModules}
      />
      {!loading.modules && renderButton(resumeFn)}
    </Fragment>
  )

  const isLoadingListItems = (resumeFn) => {
    return !loading.modules ? renderListItems(resumeFn) : <ModulesLoader />
  }

  return (
    <StyledForm.Wrapper>
      <Resume
        initial={!!modules}
        name="general.menu.modules"
        tags={map(internalModules, ({ name }) => name)}
        onChange={() => dispatch(mooveActions.getModules())}
      >
        {isLoadingListItems}
      </Resume>

    </StyledForm.Wrapper>
  )
}

Module.propTypes = {
  modules: PropTypes.array,
  onComplete: PropTypes.func.isRequired,
}

Module.defaultProps = {
  modules: null,
}

export default Module
