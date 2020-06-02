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
  MutableRefObject
} from 'react';
import map from 'lodash/map';
import size from 'lodash/size';
import last from 'lodash/last';
import isEmpty from 'lodash/isEmpty';
import AvatarName from 'core/components/AvatarName';
import Card from 'core/components/Card';
import Dropdown from 'core/components/Dropdown';
import { CardType } from 'modules/Hypotheses/Board/interfaces';
import { Author } from 'modules/Hypotheses/interfaces';
import Styled from './styled';

export interface Props {
  description: string;
  type: CardType;
  members?: Author[];
  onClick?: Function;
  onRemove: Function;
  onArchive: Function;
  hideAction?: boolean;
}

const CardBoard = forwardRef(
  (
    {
      description,
      type,
      members,
      onClick,
      onRemove,
      onArchive,
      hideAction,
      ...rest
    }: Props,
    ref: Ref<HTMLDivElement>
  ) => {
    const MAX_MEMBERS = 6;
    const cardRef = useRef<HTMLDivElement>(null) as MutableRefObject<
      HTMLDivElement
    >;

    useImperativeHandle(ref, () => cardRef.current);

    const renderAction = () =>
      !hideAction && (
        <Styled.Dropdown color="light">
          <Dropdown.Item
            icon="folder"
            name="Archive"
            onClick={() => onArchive()}
          />
          <Dropdown.Item
            icon="delete"
            name="Delete"
            onClick={() => onRemove()}
          />
        </Styled.Dropdown>
      );

    const renderHeader = () => <Card.Header action={renderAction()} />;

    const renderBody = () => (
      <Styled.CardBody onClick={() => onClick()}>
        <Styled.Text color="light">{description}</Styled.Text>
      </Styled.CardBody>
    );

    const renderLastMember = () => {
      const member = last(members);
      console.log('member', member);

      return (
        <AvatarName
          key={`body-member-${member.name}`}
          size="25px"
          src={member.photoUrl}
          name={member.name}
        />
      );
    };

    const renderMembersEllipsis = () => {
      if (size(members) === MAX_MEMBERS + 1) {
        return renderLastMember();
      } else if (size(members) > MAX_MEMBERS) {
        return (
          <Styled.MembersEllipsis
            size="25px"
            src="/"
            initials={`+${size(members) - MAX_MEMBERS}`}
          />
        );
      }
    };

    const renderMembers = () =>
      map(
        members,
        (member, index) =>
          index < MAX_MEMBERS && (
            <AvatarName
              key={`body-member-${member.name}`}
              size="25px"
              src={member.photoUrl}
              name={member.name}
            />
          )
      );

    const renderFooter = () => (
      <Styled.CardBody onClick={() => onClick()}>
        <Styled.Members>
          {!isEmpty(members) && renderMembers()}
          {!isEmpty(members) && renderMembersEllipsis()}
        </Styled.Members>
      </Styled.CardBody>
    );

    return (
      <Styled.CardBoard
        ref={cardRef}
        type={type}
        onClick={() => onClick()}
        {...rest}
      >
        {renderHeader()}
        {renderBody()}
        {renderFooter()}
      </Styled.CardBoard>
    );
  }
);

export default CardBoard;
