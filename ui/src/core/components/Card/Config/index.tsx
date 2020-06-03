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

import React from 'react';
import Card from 'core/components/Card';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import Styled from './styled';

export interface Props {
  isLoading?: boolean;
  icon: string;
  description: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onClose?: (event: React.MouseEvent<unknown, MouseEvent>) => void;
  canClose?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const CardConfig = ({
  icon,
  description,
  onClose,
  canClose = true,
  onClick,
  children,
  className,
  isLoading
}: Props) => {
  const headerIcon = <Icon name={icon} color="light" size="15px" />;

  const handleClose = (event: React.MouseEvent<unknown, MouseEvent>) => {
    event.stopPropagation();
    onClose && onClose(event);
  };

  const headerAction = canClose && onClose && (
    <Icon
      name={isLoading ? 'loading' : 'cancel'}
      color="light"
      size="15px"
      onClick={handleClose}
    />
  );

  const renderHeader = () => (
    <Card.Header icon={headerIcon} action={headerAction} />
  );

  const renderBody = () => (
    <Card.Body>
      <Text.h4 color="light">{description}</Text.h4>
      {children}
    </Card.Body>
  );

  return (
    <Styled.CardConfig className={className} onClick={onClick}>
      {renderHeader()}
      {renderBody()}
    </Styled.CardConfig>
  );
};

export default CardConfig;
