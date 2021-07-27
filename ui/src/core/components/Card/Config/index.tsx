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
import CardHeader from 'core/components/Card/Header';
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import Styled from './styled';

export interface Props {
  id?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon: string;
  description: string;
  actions?: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onClose?: (event: React.MouseEvent<unknown, MouseEvent>) => void;
  canClose?: boolean;
  children?: ReactNode;
  className?: string;
}

const Config = ({
  id,
  icon,
  description,
  actions,
  onClose,
  canClose = true,
  onClick,
  children,
  className,
  isLoading,
  isDisabled,
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
    <CardHeader icon={headerIcon} action={actions || headerAction} />
  );

  const renderBody = () => (
    <Styled.Body onClick={onClick}>
      <Text tag="H4" color="light">{description}</Text>
      {children}
    </Styled.Body>
  );

  return (
    <Styled.CardConfig
      data-testid={id}
      className={className}
      isDisabled={isDisabled}
    >
      {renderHeader()}
      {renderBody()}
    </Styled.CardConfig>
  );
};

export default Config;
