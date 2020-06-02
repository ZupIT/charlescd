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

import { MutableRefObject } from 'react';
import styled from 'styled-components';
import { CardType } from 'modules/Hypotheses/Board/interfaces';
import CardBase, { Props as BaseProps } from 'core/components/Card/Base';
import ComponentDropdown from 'core/components/Dropdown';
import CardBody from 'core/components/Card/Body';
import Text from 'core/components/Text';
import AvatarName from 'core/components/AvatarName';

interface CardProps extends BaseProps {
  isSelectable?: boolean;
  type: CardType;
  ref?: MutableRefObject<HTMLDivElement>;
}

const CustomText = styled(Text.h4)``;

const CardBoard = styled(CardBase)<CardProps>`
  background-color: ${({ theme, type }) => theme.card.board[type].background};

  :hover {
    ${CustomText} {
      white-space: normal;
      overflow: visible;
    }
  }
`;

const Members = styled.div`
  display: flex;
  flex-direction: row;

  > :not(:first-child) {
    margin-left: 5px;
  }
`;

const CustomCardBody = styled(CardBody)`
  ${CustomText} {
    width: 235px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const Dropdown = styled(ComponentDropdown)`
  right: 14px;
  top: 0px;
`;

const MembersEllipsis = styled(AvatarName)`
  background-color: ${({ theme }) => theme.board.member.ellipsis.background};
`;

export default {
  CardBoard,
  CardBody: CustomCardBody,
  Dropdown,
  Members,
  MembersEllipsis,
  Text: CustomText
};
