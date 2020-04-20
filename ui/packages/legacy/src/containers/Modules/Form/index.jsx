import React, { useState, useCallback } from 'react'
import map from 'lodash/map'
import { useRouter } from 'core/routing/hooks'
import isEmpty from 'lodash/isEmpty'
import arrayMutators from 'final-form-arrays'
import { FinalForm } from 'containers/FinalForm'
import { Translate, Label } from 'components'
import { Button } from 'components/Button'
import ParametersForm from './ParametersForm'
import Styled from './styled'

const List = ({ label, list, icon, selected, onSelect }) => (
  <>
    <Label id={label} />
    <Styled.List>
      {map(list, ({ id, name }) => (
        <Styled.Toggle
          key={id}
          icon={icon}
          name={name}
          selected={id === selected}
          onClick={() => onSelect(id)}
        />
      ))}
    </Styled.List>
  </>
)

const CreateEditModuleForm = ({ initialValues, config, onSubmit, persistLoading }) => {
  const [gitConfigurationId, setRepository] = useState(initialValues?.gitConfigurationId)
  const [registryConfigurationId, setRegistry] = useState(initialValues?.registryConfigurationId)
  const [cdConfigurationId, setK8s] = useState(initialValues?.cdConfigurationId)
  const isToggleValid = gitConfigurationId && registryConfigurationId && cdConfigurationId
  const router = useRouter()
  const isEditMode = router.history.location.pathname.includes('edit')

  const handleChange = useCallback((getState, change) => {
    const params = getState()?.values?.params
    change('components', params)
  }, [])

  return (
    <FinalForm
      keepDirtyOnReinitialize
      initialValues={initialValues}
      mutators={{ ...arrayMutators }}
      onSubmit={values => onSubmit({
        ...values, gitConfigurationId, registryConfigurationId, cdConfigurationId,
      })}
    >
      {({ submitting, errors, form: { change, getState, mutators: { push } } }) => (
        <>
          <Styled.FormItem>
            <Styled.Input name="name" label="module.form.label" validate="required" />
          </Styled.FormItem>
          <Styled.FormItem>
            <Styled.Input name="gitRepositoryAddress" label="module.form.git.address" validate="required" />
          </Styled.FormItem>
          <Styled.FormItem>
            <List
              list={config?.git}
              label="module.form.git.choose"
              selected={gitConfigurationId}
              onSelect={id => setRepository(id)}
            />
          </Styled.FormItem>
          <Styled.FormItem>
            <List
              list={config?.registry}
              label="module.form.registry.choose"
              selected={registryConfigurationId}
              onSelect={id => setRegistry(id)}
            />
          </Styled.FormItem>
          <Styled.FormItem>
            <List
              list={config?.cd}
              label="module.form.k8s.choose"
              selected={cdConfigurationId}
              onSelect={id => setK8s(id)}
            />
          </Styled.FormItem>
          <Styled.FormItem>
            <ParametersForm
              push={push}
              errors={errors}
              onChange={() => handleChange(getState, change)}
            />
          </Styled.FormItem>
          <Styled.FormItem>
            <Styled.Input name="helmRepository" label="module.form.helmURL" validate="required" />
          </Styled.FormItem>
          <Styled.FormItem>
            <Button
              disabled={submitting || (!isEmpty(errors) && !isToggleValid) || isEditMode}
              type="submit"
              isLoading={persistLoading}
            >
              <Translate id={isEditMode ? 'general.edit' : 'general.create'} />
            </Button>
          </Styled.FormItem>
        </>
      )}
    </FinalForm>
  )
}


export default CreateEditModuleForm
