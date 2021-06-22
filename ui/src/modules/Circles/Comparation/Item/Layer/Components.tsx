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

import map from 'lodash/map';
import ContentIcon from 'core/components/ContentIcon';
import PanelContent from 'core/components/Panel/Content';
import PanelSection from 'core/components/Panel/Section';
import Text from 'core/components/Text';
import { Component } from 'modules/Circles/interfaces/Circle';
import Styled from '../styled';

interface Props {
  components: Component[];
}

const LayerComponents = ({ components }: Props) => {
  const renderComponent = ({
    module,
    name,
    version,
  }: Pick<Component, 'module' | 'name' | 'version'>) => (
    <PanelSection
      key={`${module}-${name}-${version}`}
      data-testid={`deployed-module-${module}-${name}-${version}`}
    >
      <Text tag="H5" color="light">{`${module}/${name}:${version}`}</Text>
    </PanelSection>
  );

  const renderComponents = () =>
    components && (
      <PanelContent>
        {map(components, (component) => renderComponent(component))}
      </PanelContent>
    );

  return (
    <Styled.Layer>
      <ContentIcon icon="modules">
        <Text tag="H2" color="light">
          Deployed modules
        </Text>
      </ContentIcon>
      <Styled.Content>{renderComponents()}</Styled.Content>
    </Styled.Layer>
  );
};

export default LayerComponents;
