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
import Card from 'core/components/Card';
import Styled from './styled';

export interface Props {
  color?: 'error' | 'success' | 'dark' | 'primary';
  title: string;
  description: string;
  width?: string;
  children?: ReactNode;
  header?: ReactNode;
  action?: ReactNode;
}

const Main = (props: Props) => {
  const {
    color = 'dark',
    title,
    description,
    header,
    width,
    children,
    action
  } = props;

  return (
    <Styled.Card data-testid="card-main" color={color} width={width}>
      {header && <Card.Header action={action}>{header}</Card.Header>}
      <Card.Body>
        {title && <Styled.Title color="light">{title}</Styled.Title>}
        <Styled.Description color="light">{description}</Styled.Description>
        {children && <Styled.Content>{children}</Styled.Content>}
      </Card.Body>
    </Styled.Card>
  );
};

export default Main;
