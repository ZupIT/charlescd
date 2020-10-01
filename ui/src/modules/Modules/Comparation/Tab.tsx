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

import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { copyToClipboard } from 'core/utils/clipboard';
import TabPanel from 'core/components/TabPanel';
import routes from 'core/constants/routes';
import Dropdown from 'core/components/Dropdown';
import Can from 'containers/Can';
import { delParam, updateParam } from 'core/utils/path';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import { Module } from '../interfaces/Module';
import { Component } from '../interfaces/Component';
import { useFindModule, useDeleteModule } from '../hooks/module';
import { resolveParams, pathModuleById } from './helpers';
import FormModule from './Form';
import FormComponent from './Form/Component';
import ViewModule from './View';
import Loader from './Loaders';
import Styled from './styled';

interface Props {
  param: string;
}

const Tab = ({ param }: Props) => {
  const history = useHistory();
  const [id, mode] = resolveParams(param);
  const [module, setModule] = useState<Module>(null);
  const [component, setComponent] = useState<Component>(null);
  const { getModuleById, response } = useFindModule();
  const { removeModule } = useDeleteModule(module);
  const isLoading = isEmpty(module) && id !== NEW_TAB;

  useEffect(() => {
    if (response) {
      setModule(response);
    }
  }, [response, setModule]);

  useEffect(() => {
    if (id !== NEW_TAB) {
      getModuleById(id);
    }
  }, [id, getModuleById]);

  const updateModule = useCallback(() => getModuleById(id), [
    getModuleById,
    id
  ]);

  const onUpdateComponent = () => {
    setComponent(null);
    getModuleById(module?.id);
  };

  const onCloseComponent = () => {
    setComponent(null);
    updateParam(
      'module',
      routes.modulesComparation,
      history,
      module?.id,
      `${module?.id}~view`
    );
  };

  const renderActions = () => (
    <Styled.Actions>
      <Dropdown>
        <Can I="write" a="modules" passThrough>
          <Dropdown.Item
            icon="edit"
            name="Edit"
            onClick={() =>
              updateParam(
                'module',
                routes.modulesComparation,
                history,
                module?.id,
                `${module?.id}~edit`
              )
            }
          />
        </Can>
        <Can I="write" a="modules" passThrough>
          <Dropdown.Item
            icon="delete"
            name="Delete"
            onClick={() => removeModule(module?.id)}
          />
        </Can>
        <Can I="read" a="modules" passThrough>
          <Dropdown.Item
            icon="copy"
            name="Copy link"
            onClick={() => copyToClipboard(pathModuleById(id))}
          />
        </Can>
      </Dropdown>
    </Styled.Actions>
  );

  const renderTabs = () => (
    <Styled.Tab>
      {mode === 'view' && isEmpty(component) && (
        <ViewModule
          module={module}
          mode={mode}
          onChange={updateModule}
          onSelectComponent={(c: Component) => setComponent(c)}
        />
      )}
      {mode === 'edit' && isEmpty(component) && (
        <FormModule module={module} onChange={updateModule} />
      )}
      {(mode === 'component' || !isEmpty(component)) && (
        <FormComponent
          module={module}
          component={component}
          onClose={() => onCloseComponent()}
          onUpdate={() => onUpdateComponent()}
        />
      )}
    </Styled.Tab>
  );

  return (
    <Styled.Tab>
      <TabPanel
        name="modules"
        title={module?.name}
        actions={renderActions()}
        onClose={() =>
          delParam('module', routes.modulesComparation, history, param)
        }
        size="15px"
      >
        {isLoading ? <Loader.Tab /> : renderTabs()}
      </TabPanel>
    </Styled.Tab>
  );
};

export default Tab;
