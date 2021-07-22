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

import { ReactNode } from 'react';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import Styled from './styled';

export interface Props {
  icon: string;
  title?: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

const Placeholder = ({
  icon,
  title,
  subtitle,
  description,
  children,
  className,
}: Props) => (
  <Styled.Wrapper data-testid={`placeholder-${icon}`} className={className}>
    <Icon name={icon} />
    <Styled.Empty>
      {title && (
        <Text tag="H1" color="dark" weight="bold" align="center">
          {title}
        </Text>
      )}
      {subtitle && (
        <Text tag="H1" color="dark" weight="bold" align="center">
          {subtitle}
        </Text>
      )}
      {description && (
        <Styled.Description>
          <Text tag="H3" color="dark" align="center">
            {description}
          </Text>
        </Styled.Description>
      )}
    </Styled.Empty>
    {children}
  </Styled.Wrapper>
);

export default Placeholder;
