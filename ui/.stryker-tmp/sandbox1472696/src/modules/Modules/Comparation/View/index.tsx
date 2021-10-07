// @ts-nocheck
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

import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import map from 'lodash/map';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import routes from 'core/constants/routes';
import { updateParam } from 'core/utils/path';
import ContentIcon from 'core/components/ContentIcon';
import Can from 'containers/Can';
import { Module } from 'modules/Modules/interfaces/Module';
import { Component } from 'modules/Modules/interfaces/Component';
import { useDeleteComponent } from 'modules/Modules/hooks/component';
import { FIRST, ONE } from './constants';
import Styled from './styled';
import Dropdown from 'core/components/Dropdown';
import { copyToClipboard } from 'core/utils/clipboard';
import { hasPermission } from 'core/utils/auth';

interface Props {
  module: Module;
  onChange: Function;
  onSelectComponent: (component: Component) => void;
}

const ViewModule = ({ module, onChange, onSelectComponent }: Props) => {
  const { status, loading, removeComponent } = useDeleteComponent();
  const history = useHistory();

  useEffect(() => {
    if (status === 'resolved') {
      onChange();
    }
  }, [status, onChange]);

  const renderAction = (component: Component, index: number) => (
    <Styled.Dropdown color="light">
      <Can I="write" a="modules" passThrough>
        <Dropdown.Item
          icon="edit"
          name="Edit"
          onClick={() => onSelectComponent(component)}
        />
      </Can>
      {(index !== FIRST || module.components.length > ONE)
        && (
          <Can I="write" a="modules" passThrough>
            <Dropdown.Item
              icon="delete"
              name="Delete"
              onClick={() => removeComponent(module?.id, component?.id)}
            />
          </Can>
        )
      }
      <Dropdown.Item
        icon="copy"
        name="Copy ID"
        onClick={() => copyToClipboard(component?.id)}
      />
    </Styled.Dropdown>
)

  return (
    <>
      <Styled.Layer>
        <ContentIcon icon="modules">
          <Text tag="H2" color="light">{module?.name}</Text>
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="git">
          <Text tag="H2" color="light">Git URL</Text>
          <Styled.FormLink name="git" href={module?.gitRepositoryAddress} />
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="helm">
          <Text tag="H2" color="light">Helm URL</Text>
          <Styled.FormLink name="helm" href={module?.helmRepository} />
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="component">
          <Text tag="H2" color="light">Components</Text>
          <Can I="write" a="modules" passThrough>
            <Styled.ButtonRounded
              name="add"
              icon="add"
              color="dark"
              onClick={() =>
                updateParam(
                  'module',
                  routes.modulesComparation,
                  history,
                  module?.id,
                  `${module?.id}~component`
                )
              }
            >
              Add component
            </Styled.ButtonRounded>
          </Can>
          {map(module?.components, (component: Component, index: number) => (
            <Styled.Component.Card
              icon="component"
              key={component?.id}
              isLoading={loading}
              description={component?.name}
              actions={renderAction(component, index)}
              onClick={() => hasPermission('modules_write') && onSelectComponent(component)}
            >
              <Styled.Component.Wrapper>
                <Styled.Component.Info>
                  <Icon name="latency" size="10px" color="light" />
                  <Text tag="H5" color="light">
                    {component?.latencyThreshold} ms
                  </Text>
                </Styled.Component.Info>
                <Styled.Component.Info>
                  <Icon name="error-threshold" size="10px" color="light" />
                  <Text tag="H5" color="light">{component?.errorThreshold} %</Text>
                </Styled.Component.Info>
              </Styled.Component.Wrapper>
            </Styled.Component.Card>
          ))}
        </ContentIcon>
      </Styled.Layer>
    </>
  );
};

export default ViewModule;
