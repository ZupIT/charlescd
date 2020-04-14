import React, { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import ObjectPath from 'object-path'
import HeaderNav from 'components/HeaderNav'
import { Button } from 'components/Button'
import Translate from 'components/Translate'
import UserPanel from 'containers/UserPanel'
import { getUserProfileData } from 'core/helpers/profile'
import SwitchComponent from './Switch'
import {
  StyledDataCollector,
  StyledSelect,
} from './styled'
import { dataCollectorActions } from './state/actions'
import DataCollectorLoader from './Loaders/Loader'
import JsonResume from './JsonResume'

const navItems = [
  { label: 'general.circles', path: 'circle' },
  { label: 'general.hypotheses', path: 'quick-board' },
  { label: 'general.modules', path: 'module' },
]

export const DataCollector = () => {
  const [jsonResume, setJsonResume] = useState({})
  const [selectValue, setSelectValue] = useState(null)
  const {
    fields,
    selectValues,
    saveLoading,
  } = useSelector(selector => selector.dataCollector)
  const dispatch = useDispatch()

  const setInitialJsonResume = () => {
    const initialJsonResume = {}
    map(fields.fields, (item) => {
      if (fields.whitelist && fields.whitelist.includes(item)) {
        ObjectPath.set(initialJsonResume, item, true)
      } else {
        ObjectPath.set(initialJsonResume, item, false)
      }
    })
    setJsonResume(initialJsonResume)
  }

  useEffect(() => {
    if (isEmpty(fields)) {
      dispatch(dataCollectorActions.getAllKeys())
    }


    if (!isEmpty(fields)) {
      setInitialJsonResume()
    }

    if (!selectValue && selectValues.length) {
      setSelectValue(selectValues[0])
    }

  }, [fields, selectValues])

  const updateJsonResume = (value, field) => {
    const newJsonResume = jsonResume
    ObjectPath.set(newJsonResume, field, value)
    setJsonResume(cloneDeep(newJsonResume))
  }

  const genereteWhiteList = () => {
    const newFieldsData = fields
    newFieldsData.whitelist = []
    map(newFieldsData.fields, (field) => {
      if (ObjectPath.get(jsonResume, field)) {
        newFieldsData.whitelist.push(field)
      }
    })
    dispatch(dataCollectorActions.saveFields(newFieldsData))
  }

  return (
    <Fragment>
      <UserPanel />
      <StyledDataCollector.JsonDataContainer>
        <HeaderNav
          navItems={navItems}
          user={{ name: getUserProfileData('name') }}
          actionTitle="jsonData.title"
          actionLabel="jsonData.title"
        />
        { isEmpty(fields)
          ? (<DataCollectorLoader />)
          : (
            <Fragment>
              <StyledDataCollector.JsonBoxContainer>
                <StyledSelect
                  value={selectValue}
                  options={selectValues}
                  placeholder="Select one provider"
                  onChange={(v) => {
                    dispatch(dataCollectorActions.setJsonResume(v.value))
                    setSelectValue(v)
                  }}
                />
                <StyledDataCollector.JsonContainer>
                  <SwitchComponent
                    jsonResume={jsonResume}
                    updateJsonResume={updateJsonResume}
                    fields={fields}
                  />
                  <JsonResume jsonResume={jsonResume} />

                </StyledDataCollector.JsonContainer>
              </StyledDataCollector.JsonBoxContainer>
              <div style={{ margin: '30px 150px' }}>
                <Button
                  onClick={genereteWhiteList}
                  isLoading={saveLoading}
                  properties={{ disabled: saveLoading }}
                >
                  <Translate id="jsonData.button.save" />
                </Button>
              </div>
            </Fragment>
          )}
      </StyledDataCollector.JsonDataContainer>
    </Fragment>
  )
}

export default DataCollector
