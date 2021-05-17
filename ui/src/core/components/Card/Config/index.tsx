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
import Icon from 'core/components/Icon';
import Text from 'core/components/Text';
import Styled from './styled';
import ReactTooltip from 'react-tooltip';

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
  tooltip?: string;
  dataTip?: boolean;
  dataFor?: string;
}

const CardConfig = ({
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
  tooltip,
  dataTip,
  dataFor
}: Props) => {
  const headerIcon = <Icon name={icon} color="light" size="15px" />;

  const handleClose = (event: React.MouseEvent<unknown, MouseEvent>) => {
    event.stopPropagation();
    onClose && onClose(event);
  };

  const headerAction = canClose && onClose && (
    <Icon
      name={isLoading ? 'loading' : 'cancel'}
      color={tooltip ? 'dark' : 'light'}
      size="15px"
      onClick={!tooltip && handleClose}
      data-tip={dataTip}
      data-for={dataFor}
    />
  );

  const renderHeader = () => {
    return (
      <>
        <Card.Header icon={headerIcon} action={actions || headerAction} />
        {tooltip && renderTooltip()}
      </>
    );
  };

  const renderTooltip = () => (
    <ReactTooltip id={dataFor} place="right" effect="solid">
      <Styled.Tooltip color='dark'>
        {tooltip}
      </Styled.Tooltip>
    </ReactTooltip>
  );

  const renderBody = () => (
    <Styled.Body onClick={onClick}>
      <Text.h4 color="light">{description}</Text.h4>
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

export default CardConfig;
