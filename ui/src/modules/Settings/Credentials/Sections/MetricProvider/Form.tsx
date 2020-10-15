/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import { useForm } from 'react-hook-form';
import Card from 'core/components/Card';
import Button from 'core/components/Button';
import Select from 'core/components/Form/Select';
import { Option } from 'core/components/Form/Select/interfaces';
import Text from 'core/components/Text';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { Datasource, Plugin, PluginDatasource } from './interfaces';
import { serializePlugins } from './helpers';
import { Props } from '../interfaces';
import { useDatasource, usePlugins } from './hooks';
import Styled from './styled';
import { find, map } from 'lodash';

const FormMetricProvider = ({ onFinish }: Props) => {
  const { responseSave, save, loadingSave, loadingAdd } = useDatasource();
  const [isDisabled, setIsDisabled] = useState(true);
  const [datasourceHealth, setDatasourceHealth] = useState(false)
  const [plugin, setPlugin] = useState<Plugin>();
  const { response: plugins, getAll } = usePlugins()
  const { control, register, handleSubmit } = useForm<
    Datasource
  >();

  useEffect(() => {
    getAll()
    if (responseSave) onFinish();
  }, [onFinish, responseSave, getAll]);

  const onSubmit = (datasource: Datasource) => {
    save({
      ...datasource,
      pluginSrc: plugin.src,
      healthy: datasourceHealth,
    });
  };


  const onChange = (option: Option) => {
    setPlugin(find((plugins as Plugin[]), { id: option['value'] }));
    setIsDisabled(!isEmpty(plugin));
  };

  const onClose = () => {
    setPlugin(null);
    setIsDisabled(true);
  };

  const renderFields = () => (
    <>

      <Card.Config
        icon="prometheus"
        description={plugin.name}
        onClose={() => onClose()}
      />
      {(plugin.inputParameters as PluginDatasource).health && (
        <Styled.HealthWrapper>
          <Styled.HealthSwitch
            name="healthy"
            label="Datasource health"
            active={datasourceHealth}
            onChange={() => setDatasourceHealth(!datasourceHealth)}
          />
          <Popover
            title="Why do we ask for a source of health datasource?"
            icon="info"
            link={`${CHARLES_DOC}/reference/metrics`}
            linkLabel="View documentation"
            description="Marking a health datasource enables Charles pre-configured health metrics."
          />
        </Styled.HealthWrapper>
      )}
      <Styled.Input
        ref={register}
        name="name"
        label="Datasource name"
      />

      {map((plugin.inputParameters as PluginDatasource)['configurationInputs'], input => (
        <Styled.Input
          key={input.name}
          ref={register}
          name={`data.${input.name}`}
          label={input.label}
        />
      ))}
    </>
  )

  const renderSelect = () => (
    <Select.Single
      control={control}
      name="url"
      label="Select a datasource plugin"
      options={serializePlugins(plugins as Plugin[])}
      onChange={option => onChange(option)}
    />
  );

  const renderForm = () => (
    <Styled.Form onSubmit={handleSubmit(onSubmit)}>
      {plugin ? renderFields() : renderSelect()}
      <div>
        <Button.Default
          type="submit"
          isLoading={loadingSave || loadingAdd}
          isDisabled={isDisabled}
        >
          Save
        </Button.Default>
      </div>
    </Styled.Form>
  );

  return (
    <Styled.Content>
      <Text.h2 color="light">
        Add Datasource
        <Popover
          title="Why we ask for Metrics Provider?"
          icon="info"
          link={`${CHARLES_DOC}/reference/metrics`}
          linkLabel="View documentation"
          description="Adding the URL of our tool helps Charles to metrics generation since this can vary from workspace to another. Consult the our documentation for further details."
        />
      </Text.h2>
      {renderForm()}
    </Styled.Content>
  );
};

export default FormMetricProvider;
