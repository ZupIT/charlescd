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

import React, {
  ReactNode,
  forwardRef,
  useRef,
  Ref,
  useImperativeHandle,
  MutableRefObject
} from 'react';
import Card from 'core/components/Card';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Styled from './styled';

export interface Props {
  icon?: string;
  iconColor?: string;
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  onClick?: Function;
}

const CardCircle = forwardRef(
  (
    {
      icon = 'circle',
      iconColor = 'light',
      title,
      description,
      children,
      action,
      onClick
    }: Props,
    ref: Ref<HTMLDivElement>
  ) => {
    const cardRef = useRef<HTMLDivElement>(null) as MutableRefObject<
      HTMLDivElement
    >;

    useImperativeHandle(ref, () => cardRef.current);

    const handleClick = () => {
      onClick && onClick();
    };

    const renderHeader = () => (
      <Card.Header
        icon={<Icon name={icon} size="15px" color={iconColor} />}
        action={action}
      />
    );

    const renderBody = () => (
      <Styled.CardBody>
        <Text.h4 color="light" align="left">
          {title}
        </Text.h4>
        <Text.h5 color="light" align="left">
          {description}
        </Text.h5>
        {children}
      </Styled.CardBody>
    );

    return (
      <Styled.CardCircle onClick={handleClick} ref={cardRef}>
        {renderHeader()}
        {renderBody()}
      </Styled.CardCircle>
    );
  }
);

export default CardCircle;
