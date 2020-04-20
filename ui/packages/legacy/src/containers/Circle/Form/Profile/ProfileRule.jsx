import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { intlShape, injectIntl } from 'react-intl'
import map from 'lodash/map'
import { i18n } from 'core/helpers/translate'
import { StyledProfile } from './styled'
import { ENGINE } from './constants'
import { responseTypes, customerMapping } from './mocks'
import { getFieldByKey, removeRule, changeValue, isFirst, isClause, isGroups, hasAnyClause } from './helpers'

const ProfileRule = (props) => {
  const { intl, form, engine, groupId, ruleId, isViewMode, onRulesChange } = props
  const [conditions, setConditions] = useState([])
  const [values, setValues] = useState(null)
  const { loading } = useSelector(({ circle }) => circle)
  const enableRemoveRule = hasAnyClause(form) || isGroups(form)

  useEffect(() => {
    const key = form.key[groupId][ruleId]
    if (engine === ENGINE.REALWAVE) {
      const { crmConditions, crmValues } = getFieldByKey(key, customerMapping)
      setValues(crmValues)

      return setConditions(crmConditions)
    }

    return setConditions(responseTypes.all.conditions)
  }, [])

  const onKeyChange = ({ target }) => {
    const { value } = target

    if (engine === ENGINE.REALWAVE) {
      const { crmConditions, crmValues } = getFieldByKey(value, customerMapping)

      setConditions(crmConditions)
      setValues(crmValues)
    }

    onRulesChange(changeValue(form, 'key', value, groupId, ruleId))
  }

  const onConditionChange = ({ target }) => {
    onRulesChange(
      changeValue(form, 'condition', target.value, groupId, ruleId),
    )
  }

  const onValueChange = ({ target }, field) => {
    onRulesChange(
      changeValue(form, field, target.value, groupId, ruleId),
    )
  }

  const renderKey = () => {
    if (engine === ENGINE.DARWIN) {
      return (
        <StyledProfile.Input
          name={`key[${groupId}][${ruleId}]`}
          properties={{ disabled: isViewMode }}
          onChange={onKeyChange}
          validate="required"
        />
      )
    }

    return (
      <StyledProfile.Select
        name={`key[${groupId}][${ruleId}]`}
        validate="required"
        properties={{ disabled: isViewMode }}
        onChange={onKeyChange}
      >
        <option>
          {loading ? '...' : i18n(intl, 'general.dashed.select')}
        </option>
        {map(customerMapping, (crm, name) => (
          <option key={name} value={name}>
            {i18n(intl, `profile.entity.${name}`)}
          </option>
        ))}
      </StyledProfile.Select>
    )
  }

  const renderCondition = () => (
    <StyledProfile.Select
      name={`condition[${groupId}][${ruleId}]`}
      validate="required"
      properties={{ disabled: isViewMode }}
      onChange={onConditionChange}
    >
      <option>{i18n(intl, 'general.dashed.select')}</option>
      {map(conditions, condition => (
        <option key={condition} value={condition}>
          {i18n(intl, `profile.operator.${condition}`)}
        </option>
      ))}
    </StyledProfile.Select>
  )

  const renderValue = () => {
    if (values) {
      return (
        <StyledProfile.Select
          name={`svalue[${groupId}][${ruleId}]`}
          properties={{ disabled: isViewMode }}
          onChange={(event => onValueChange(event, 'svalue'))}
          validate="required"
        >
          <option>{i18n(intl, 'general.dashed.select')}</option>
          {map(values, value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </StyledProfile.Select>
      )
    }

    return (
      <StyledProfile.Input
        name={`ivalue[${groupId}][${ruleId}]`}
        properties={{ disabled: isViewMode }}
        onChange={(event => onValueChange(event, 'ivalue'))}
        validate="required"
      />
    )
  }

  return (
    <StyledProfile.Clauses.Rule
      isFirst={isFirst(ruleId)}
      justOne={!isClause(form.key[groupId])}
    >
      <StyledProfile.Clauses.Form>
        {renderKey()}
        {renderCondition()}
        {renderValue()}
      </StyledProfile.Clauses.Form>
      {!isViewMode && (
        <StyledProfile.RemoveRule
          enable={enableRemoveRule}
          onClick={() => {
            if (enableRemoveRule) {
              onRulesChange(removeRule(form, groupId, ruleId))
            }
          }}
        />
      )}
    </StyledProfile.Clauses.Rule>
  )
}

ProfileRule.propTypes = {
  intl: intlShape.isRequired,
  form: PropTypes.object.isRequired,
  groupId: PropTypes.number.isRequired,
  ruleId: PropTypes.number.isRequired,
  engine: PropTypes.string.isRequired,
  isViewMode: PropTypes.bool.isRequired,
  onRulesChange: PropTypes.func.isRequired,
}

export default injectIntl(ProfileRule)
