import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import map from 'lodash/map'
import isUndefined from 'lodash/isUndefined'
import lowerCase from 'lodash/lowerCase'
import { Translate } from 'components'
import { THEME } from 'components/Button'
import { FinalForm } from 'containers/FinalForm'
import ProfileRule from './ProfileRule'
import { StyledProfile } from './styled'
import { ENGINE, MODE } from './constants'
import { convertToForm, convertToProfile, isClause, isGroups, addNewRule, addNewGroup } from './helpers'

const Profile = ({ rules, engine, mode, onSave, className }) => {
  const [form, setForm] = useState({})
  const isViewMode = mode === MODE.VIEW
  const defaultRuleId = 0

  useEffect(() => {
    setForm(convertToForm(rules, engine))
  }, [rules])

  const onOperatorChange = (groupId) => {
    if (isUndefined(groupId)) {
      return setForm({
        ...form,
        operator: !form.operator,
      })
    }

    const logicalOperator = Object.assign(
      [],
      form.logicalOperator,
      { [groupId]: !form.logicalOperator[groupId] },
    )

    return setForm({
      ...form,
      logicalOperator,
    })
  }

  const renderOperator = (groupId) => {
    let text = form.operator ? 'AND' : 'OR'
    let name = 'operator'

    if (!isUndefined(groupId)) {
      text = form.logicalOperator[groupId] ? 'AND' : 'OR'
      name = `logicalOperator[${groupId}]`
    }

    return (
      <StyledProfile.Conditional.Wrapper>
        <StyledProfile.Conditional.Toggle isViewMode={isViewMode}>
          <StyledProfile.Operator.Checkbox
            type="checkbox"
            name={name}
            onChange={() => onOperatorChange(groupId)}
          />
          {lowerCase(text)}
        </StyledProfile.Conditional.Toggle>
      </StyledProfile.Conditional.Wrapper>
    )
  }

  const renderRule = (groupId, ruleId = defaultRuleId) => (
    <ProfileRule
      key={`group[${groupId}][${ruleId}]`}
      form={form}
      engine={engine}
      isViewMode={isViewMode}
      onRulesChange={newRules => setForm(newRules)}
      groupId={groupId}
      ruleId={ruleId}
    />
  )

  const renderClauses = (group, groupId) => (
    isClause(group)
      ? map(group, (rule, ruleId) => renderRule(groupId, ruleId))
      : renderRule(groupId)
  )

  const renderGroups = () => (
    <StyledProfile.Group>
      <StyledProfile.Clauses.Wrapper>
        {map(form.key, (group, groupId) => (
          <StyledProfile.Clauses.Clause
            key={`group[${groupId}]`}
            hasGroups={isGroups(form)}
          >
            <StyledProfile.Clauses.Rules>
              <StyledProfile.Clauses.RuleWrapper>
                {renderClauses(group, groupId)}
                {!isViewMode && (
                  <StyledProfile.AddRule.Wrapper>
                    <StyledProfile.AddRule.Button
                      onClick={() => setForm(addNewRule(form, groupId))}
                    >
                      <StyledProfile.Plus />
                      <span><Translate id="circle.profile.rule" /></span>
                    </StyledProfile.AddRule.Button>
                  </StyledProfile.AddRule.Wrapper>
                )}
              </StyledProfile.Clauses.RuleWrapper>
              {isClause(group) && renderOperator(groupId)}
            </StyledProfile.Clauses.Rules>
          </StyledProfile.Clauses.Clause>
        ))}
      </StyledProfile.Clauses.Wrapper>
      {isGroups(form) && renderOperator()}
    </StyledProfile.Group>
  )

  return (
    <div className={className}>
      <FinalForm
        initialValues={form}
        onSubmit={(data) => {
          onSave(convertToProfile(data, engine))
        }}
      >
        {() => (
          <StyledProfile.Wrapper>
            <StyledProfile.Header.Wrapper>
              <StyledProfile.Header.Text>
                <Translate id="circle.rule.column.key" />
              </StyledProfile.Header.Text>
              <StyledProfile.Header.Text>
                <Translate id="circle.rule.column.conditional" />
              </StyledProfile.Header.Text>
              <StyledProfile.Header.Text>
                <Translate id="circle.rule.column.value" />
              </StyledProfile.Header.Text>
            </StyledProfile.Header.Wrapper>
            {renderGroups()}
            {!isViewMode && (
              <StyledProfile.Button.Wrapper
                hasOperator={isGroups(form)}
              >
                <StyledProfile.Button.Button
                  theme={THEME.OUTLINE}
                  onClick={() => setForm(addNewGroup(form))}
                >
                  <Translate id="circle.profile.group" />
                </StyledProfile.Button.Button>
                <StyledProfile.Button.Button type="submit">
                  <Translate id="general.save" />
                </StyledProfile.Button.Button>
              </StyledProfile.Button.Wrapper>
            )}
          </StyledProfile.Wrapper>
        )}
      </FinalForm>
    </div>
  )
}

Profile.defaultProps = {
  rules: {},
  engine: ENGINE.DEFAULT,
  mode: MODE.DEFAULT,
  onSave: null,
}

Profile.propTypes = {
  rules: PropTypes.object,
  engine: PropTypes.string,
  mode: PropTypes.oneOf([MODE.EDIT, MODE.VIEW]),
  onSave: PropTypes.func,
}

export default Profile
