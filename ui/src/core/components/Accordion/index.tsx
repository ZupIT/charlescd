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

import React, { useState } from 'react';
import includes from 'lodash/includes';
import filter from 'lodash/filter';
import Styled from './styled';

type AccordionProps = {
  children: React.ReactElement[];
  multiples?: boolean;
};

type ItemProps = {
  children: React.ReactElement[];
  index?: number;
  onAccordionClick?: (index: number) => void;
  active?: number[];
};

type HeaderProps = Omit<ItemProps, 'children'> & {
  children: React.ReactElement;
};

const Accordion = ({ children, multiples }: AccordionProps) => {
  const [active, setActive] = useState([]);

  const onAccordionClick = (index: number) => {
    const isOpen = includes(active, index);

    if (isOpen) {
      setActive(filter(active, idx => idx !== index));
    } else if (multiples) {
      setActive([...active, index]);
    } else {
      setActive([index]);
    }
  };

  return (
    <Styled.Wrapper>
      {React.Children.map(children, (child, index) =>
        React.createElement(child.type, {
          ...child.props,
          index,
          active,
          onAccordionClick
        })
      )}
    </Styled.Wrapper>
  );
};

Accordion.Item = ({ children, active, index, onAccordionClick }: ItemProps) => {
  return (
    <Styled.Item>
      {React.Children.map(children, child =>
        React.createElement(child.type, {
          ...child.props,
          index,
          active,
          onAccordionClick
        })
      )}
    </Styled.Item>
  );
};

Accordion.Header = ({
  children,
  active,
  index,
  onAccordionClick
}: HeaderProps) => {
  const name = includes(active, index) ? 'arrow-up' : 'arrow-down';

  return (
    <Styled.Header onClick={() => onAccordionClick(index)}>
      {children}
      <Styled.Arrow name={name} color="light" />
    </Styled.Header>
  );
};

Accordion.Body = ({ children, active, index }: ItemProps) => {
  return includes(active, index) ? <Styled.Body>{children}</Styled.Body> : null;
};

export default Accordion;
