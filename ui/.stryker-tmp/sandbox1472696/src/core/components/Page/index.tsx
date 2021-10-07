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
// @ts-nocheck


import React, { ReactNode } from 'react';
import map from 'lodash/map';
import Icon from '../Icon';
import Text from '../Text';
import { PlaceholderCardItems } from './constants';
import Styled from './styled';

export interface Props {
  children?: ReactNode;
  icon?: string;
  title?: string;
  subtitle?: string;
  hasCards?: boolean;
  currentPage?: string;
  className?: string;
}

interface Action {
  icon?: string;
  text?: string;
  linkTo?: string;
}

const Page = ({ children, className }: Props) => (
  <Styled.Page data-testid="page" className={className}>
    {children}
  </Styled.Page>
);

Page.Menu = ({ children, className }: Props) => (
  <Styled.Menu data-testid="page-menu" className={className}>
    {children}
  </Styled.Menu>
);

Page.Content = ({ children, className }: Props) => (
  <Styled.Content data-testid="page-content" className={className}>
    {children}
  </Styled.Content>
);

Page.Placeholder = ({
  icon,
  title,
  subtitle,
  hasCards,
  currentPage,
  children,
  className,
}: Props) => {
  return (
    <Styled.Placeholder data-testid="page-placeholder" className={className}>
      <Icon name={icon} />
      <Styled.PlaceholderText>
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
      </Styled.PlaceholderText>
      {hasCards && (
        <Styled.PlaceholderCardWrapper>
          {map(PlaceholderCardItems, ({ icon, text, linkTo }: Action) => (
            <>
              {!(currentPage === icon) && (
                <Styled.PlaceholderCard
                  to={linkTo}
                  data-testid={icon}
                  key={icon}
                >
                  <Icon name={icon} color="dark" size="15px" />
                  <Text tag="H4" color="dark" weight="bold">
                    {text}
                  </Text>
                </Styled.PlaceholderCard>
              )}
            </>
          ))}
        </Styled.PlaceholderCardWrapper>
      )}
      {children}
    </Styled.Placeholder>
  );
};

export default Page;
