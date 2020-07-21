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

import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import map from 'lodash/map';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import routes from 'core/constants/routes';
import { updateParam } from 'core/utils/path';
import ContentIcon from 'core/components/ContentIcon';
import Can from 'core/components/Can';
import { Module } from 'modules/Modules/interfaces/Module';
import { Component } from 'modules/Modules/interfaces/Component';
import { useDeleteComponent } from 'modules/Modules/hooks/component';
import { FIRST, ONE } from './constants';
import Styled from './styled';

interface Props {
  module: Module;
  onChange: Function;
  onSelectComponent: (component: Component) => void;
  mode: string;
}

const ViewModule = ({ module, onChange, onSelectComponent }: Props) => {
  const { status, loading, removeComponent } = useDeleteComponent();
  const history = useHistory();

  useEffect(() => {
    if (status === 'resolved') {
      onChange();
    }
  }, [status, onChange]);

  return (
    <>
      <Styled.Layer>
        <ContentIcon icon="modules">
          <Text.h2 color="light">{module?.name}</Text.h2>
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="git">
          <Text.h2 color="light">Git URL</Text.h2>
          <Styled.FormLink name="git" link={module?.gitRepositoryAddress} />
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="helm">
          <Text.h2 color="light">Helm URL</Text.h2>
          <Styled.FormLink name="helm" link={module?.helmRepository} />
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="component">
          <Text.h2 color="light">Components</Text.h2>
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
              canClose={index !== FIRST || module.components.length > ONE}
              onClose={() => removeComponent(module?.id, component?.id)}
              onClick={() => onSelectComponent(component)}
            >
              <Styled.Component.Wrapper>
                <Styled.Component.Info>
                  <Icon name="latency" size="10px" color="light" />
                  <Text.h5 color="light">
                    {component?.latencyThreshold} ms
                  </Text.h5>
                </Styled.Component.Info>
                <Styled.Component.Info>
                  <Icon name="error-threshold" size="10px" color="light" />
                  <Text.h5 color="light">{component?.errorThreshold} %</Text.h5>
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
