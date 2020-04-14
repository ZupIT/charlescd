import isUndefined from 'lodash/isUndefined'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import map from 'lodash/map'
import find from 'lodash/find'
import reduce from 'lodash/reduce'
import size from 'lodash/size'
import { responseTypes, initialRules, customerMapping } from './mocks'
import { ENGINE } from './constants'

export const FIRST_ELEMENT = 0

export const ONE = 1

export const isFirst = ruleId => ruleId === FIRST_ELEMENT

export const isClause = group => size(group) > ONE

export const isGroups = form => size(form.key) > ONE

export const hasAnyClause = form => find(form.key, isClause)

export const getFieldByKey = (key) => {
  const { type, values } = customerMapping[key] || {}
  const crmConditions = responseTypes[type] ?.conditions || []
  const crmValues = values

  return { crmConditions, crmValues }
}

function isValueSelect(key, engine) {
  const { crmValues } = getFieldByKey(key, customerMapping)

  return (ENGINE.REALWAVE === engine) && (size(crmValues) > ONE)
}

function getLogicalOperator(rules, groupId) {
  if (isUndefined(groupId)) {
    return rules.operator ? 'AND' : 'OR'
  }

  return rules.logicalOperator ?.[groupId] ? 'AND' : 'OR'
}

function convertClauseToForm(result, engine, group, groupId) {
  if (isUndefined(result.key[groupId])) {
    result.key[groupId] = []
    result.condition[groupId] = []
    result.ivalue[groupId] = []
    result.svalue[groupId] = []
  }

  map(group.clauses, ({ content }) => {
    result.key[groupId].push(content.key)
    result.condition[groupId].push(content.condition)

    if (isValueSelect(content.key, engine)) {
      result.ivalue[groupId].push(null)

      return result.svalue[groupId].push(content.value[FIRST_ELEMENT])
    }

    result.svalue[groupId].push(null)

    return result.ivalue[groupId].push(content.value[FIRST_ELEMENT])
  })

  result.logicalOperator.push(group.logicalOperator === 'AND')

  return result
}

export const convertToForm = (rules, engine) => {
  const profile = isEmpty(rules) ? initialRules : rules

  return (
    reduce(profile.clauses, (result, group, groupId) => {
      result.operator = profile.logicalOperator === 'AND'

      if (group.type === 'CLAUSE') {
        return convertClauseToForm(result, engine, group, groupId)
      }

      result.key[groupId] = [group.content.key]
      result.condition[groupId] = [group.content.condition]

      if (isValueSelect(group.content.key, engine)) {
        result.svalue[groupId] = [group.content.value[FIRST_ELEMENT]]
        result.ivalue[groupId] = [null]

        return result
      }

      result.svalue[groupId] = [null]
      result.ivalue[groupId] = [group.content.value[FIRST_ELEMENT]]

      return result
    }, { key: [], condition: [], ivalue: [], svalue: [], logicalOperator: [], operator: false })
  )
}

export const convertToProfile = (rules, engine) => {
  const clauses = map(rules.key, (group, groupId) => {
    const clauseRule = map(group, (rule, ruleId) => ({
      type: 'RULE',
      content: {
        key: rules.key[groupId][ruleId],
        value: isValueSelect(rules.key[groupId][ruleId], engine)
          ? [rules.svalue[groupId][ruleId]]
          : [rules.ivalue[groupId][ruleId]],
        condition: rules.condition[groupId][ruleId],
      },
    }))

    if (size(group) > ONE) {
      return {
        type: 'CLAUSE',
        clauses: clauseRule,
        logicalOperator: getLogicalOperator(rules, groupId),
      }
    }

    return clauseRule[FIRST_ELEMENT]
  })

  return {
    rules: {
      type: 'CLAUSE',
      clauses,
      logicalOperator: getLogicalOperator(rules),
    },
  }
}

export const removeRule = (form, groupId, ruleId) => {
  const rules = cloneDeep(form)
  const deleteCount = 1

  return reduce(rules, (result, value, key) => {
    if (key !== 'logicalOperator' && key !== 'operator') {
      value[groupId].splice(ruleId, deleteCount)
      if (isEmpty(value[groupId])) {
        value.splice(groupId, deleteCount)
      }
    }

    return result
  }, rules)
}

export const addNewGroup = form => ({
  ...form,
  key: [...form.key, [null]],
  condition: [...form.condition, [null]],
  ivalue: [...form.ivalue, [null]],
  svalue: [...form.svalue, [null]],
})

export const addNewRule = (form, groupId) => {
  const rules = cloneDeep(form)

  reduce(rules, (result, value) => {
    if (isArray(value[groupId])) {
      return value[groupId].push(null)
    }

    return result
  }, rules)

  if (isUndefined(rules.logicalOperator[groupId])) {
    return {
      ...rules,
      logicalOperator: [...rules.logicalOperator, false],
    }
  }

  return rules
}

export const changeValue = (form, field, value, groupId, ruleId) => {
  const newValue = Object.assign([], form[field][groupId], { [ruleId]: value })

  return {
    ...form,
    [field]: Object.assign(
      [],
      form[field],
      {
        [groupId]: newValue,
      },
    ),
  }
}
