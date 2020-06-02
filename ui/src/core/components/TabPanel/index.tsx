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
import Icon, { Props as IconProps } from 'core/components/Icon';
import { NEW_TAB } from './constants';
import Styled from './styled';

interface Props {
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
  onClose?: (event: React.MouseEvent<unknown, MouseEvent>) => void;
  className?: string;
}

const TabPanel = ({
  title = NEW_TAB,
  children,
  onClose,
  actions,
  name,
  className,
  size
}: Props & IconProps) => (
  <Styled.Panel className={className}>
    <Styled.Header>
      <Styled.Tab>
        <Styled.Title>
          <Icon name={name} size={size} color="light" />
          <Styled.Text color="light">{title}</Styled.Text>
        </Styled.Title>
        {onClose && (
          <Icon name="cancel" size="15px" color="dark" onClick={onClose} />
        )}
      </Styled.Tab>
      {actions}
    </Styled.Header>
    <Styled.Content className="tabpanel-content">{children}</Styled.Content>
  </Styled.Panel>
);

export default TabPanel;
