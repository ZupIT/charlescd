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

import React, { ReactNode } from 'react';
import ButtonRounded from 'core/components/Button/ButtonRounded';
import ContentIcon from 'core/components/ContentIcon';
import Layer from 'core/components/Layer';
import Text from 'core/components/Text';
import Styled from '../styled';

export interface Props {
  id?: string;
  name: string;
  icon: string;
  action: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  showAction: boolean;
  children?: ReactNode;
  type?: string;
}

const Section = ({
  id,
  children,
  name,
  icon,
  action,
  showAction,
  type
}: Props) => {
  const renderAction = () => (
    <ButtonRounded name="add" icon="add" color="dark" onClick={action}>
      {`Add ${name}`}
    </ButtonRounded>
  );

  return (
    <Layer data-testid={id ? `section-${id}` : ''}>
      <ContentIcon icon={icon}>
        <Text tag="H2" color="light">{name}</Text>
      </ContentIcon>
      <Styled.Type data-testid={`configuration-type-${type}`}>
        <Text tag="H5" color="dark">{type}</Text>
      </Styled.Type>
      <Styled.Content>
        {showAction && renderAction()}
        {children}
      </Styled.Content>
    </Layer>
  );
};

export default Section;
