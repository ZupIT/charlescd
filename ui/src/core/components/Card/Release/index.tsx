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
  Ref,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  ReactNode,
  MutableRefObject
} from 'react';
import lowerCase from 'lodash/lowerCase';
import capitalize from 'lodash/capitalize';
import Card from 'core/components/Card';
import Badge from 'core/components/Badge';
import Icon from 'core/components/Icon';
import { Artifact } from 'modules/Circles/interfaces/Circle';
import Styled from './styled';
import CardExpand from '../Expand';

export interface Props {
  status: string;
  description: string;
  action?: ReactNode;
  children?: ReactNode;
  expandItems?: Artifact[];
}

const CardRelease = forwardRef(
  (
    { status, description, action, children }: Props,
    ref: Ref<HTMLDivElement>
  ) => {
    const [toggle, switchToggle] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null) as MutableRefObject<
      HTMLDivElement
    >;

    useImperativeHandle(ref, () => cardRef.current);

    const renderStatus = () => <Badge label={capitalize(lowerCase(status))} />;

    const renderIcon = () => <Icon name="info" color="light" size="15px" />;

    const renderHeader = () => (
      <Card.Header icon={renderIcon()} action={action}>
        {renderStatus()}
      </Card.Header>
    );

    const renderBody = () => (
      <Styled.CardBody>
        <Styled.Text color="light">{description}</Styled.Text>
      </Styled.CardBody>
    );

    return (
      <Styled.CardRelease
        ref={cardRef}
        status={status}
        onClick={() => switchToggle(!toggle)}
      >
        {renderHeader()}
        {renderBody()}
        {toggle && (
          <CardExpand onClick={() => switchToggle(!toggle)}>
            {children}
          </CardExpand>
        )}
      </Styled.CardRelease>
    );
  }
);

export default CardRelease;
