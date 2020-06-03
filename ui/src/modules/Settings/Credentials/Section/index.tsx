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
import Button from 'core/components/Button';
import ContentIcon from 'core/components/ContentIcon';
import Layer from 'core/components/Layer';
import Text from 'core/components/Text';
import Styled from '../styled';

export interface Props {
  name: string;
  icon: string;
  action: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  showAction: boolean;
  children?: ReactNode;
}

const Section = ({ children, name, icon, action, showAction }: Props) => {
  const renderAction = () => (
    <Button.Rounded name="add" color="dark" onClick={action}>
      {`Add ${name}`}
    </Button.Rounded>
  );

  return (
    <Layer>
      <ContentIcon icon={icon}>
        <Text.h2 color="light">{name}</Text.h2>
      </ContentIcon>
      <Styled.Content>
        {showAction && renderAction()}
        {children}
      </Styled.Content>
    </Layer>
  );
};

export default Section;
