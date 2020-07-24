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

import React, { useRef, useState } from 'react';
import map from 'lodash/map';
import debounce from 'lodash/debounce';
import Icon from 'core/components/Icon';
import { User } from 'modules/Users/interfaces/User';
import { UserChecked } from '../../interfaces/UserChecked';
import Styled from './styled';
import useOutsideClick from 'core/hooks/useClickOutside';
import Button from 'core/components/Button';

interface UserItemProps extends User {
  checked: boolean;
  onSelected: (id?: string, checked?: boolean) => void;
}

interface UserCheckedProps {
  checked: boolean;
  onSelected: (id: string, checked: boolean) => void;
}

export interface Props {
  users: UserChecked[];
  isOpen: boolean;
  onClose?: () => void;
  onSearch: (name: string) => void;
  onSelected: (id: string, checked: boolean) => void;
  className?: string;
  isOutsideClick?: boolean;
}

const MemberChecked = ({ checked }: UserCheckedProps) => (
  <Styled.Item.Checked>
    {checked ? (
      <Icon name="checkmark-circle" color="success" size="24px" />
    ) : (
      <Icon name="plus-circle" color="medium" size="24px" />
    )}
  </Styled.Item.Checked>
);

const UserItem = ({
  id,
  name,
  email,
  photoUrl,
  checked,
  onSelected
}: UserItemProps) => {
  const userItemRef = useRef<HTMLDivElement>();

  const [isSelected, setIsSelected] = useState(false);

  useOutsideClick(userItemRef, () => {
    setIsSelected(false);
  });

  const handleSelected = (id: string, checked: boolean) => {
    onSelected(id, checked);
    setIsSelected(true);
  };

  return (
    <Styled.Item.Wrapper
      onClick={() => handleSelected(id, checked)}
      isSelected={isSelected}
      ref={userItemRef}
    >
      <Styled.Item.Profile>
        <Styled.Item.Photo src={photoUrl} name={name} />
        <div>
          <Styled.Item.Name>{name}</Styled.Item.Name>
          <Styled.Item.Email>{email}</Styled.Item.Email>
        </div>
      </Styled.Item.Profile>
      <MemberChecked checked={checked} onSelected={onSelected} />
    </Styled.Item.Wrapper>
  );
};

const AddUserModal = ({
  users,
  isOpen,
  onClose,
  onSearch,
  className,
  onSelected,
  isOutsideClick
}: Props) => {
  const [userId, setUserId] = useState('');
  const [userChecked, setUserChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleChange = debounce(onSearch, 500);

  const modalRef = useRef<HTMLDivElement>();
  const contentRef = useRef<HTMLDivElement>();

  useOutsideClick(modalRef, () => {
    if (isOutsideClick) {
      onClose();
    }
  });

  useOutsideClick(contentRef, () => setIsDisabled(true));

  const setSelected = (id: string, checked: boolean) => {
    setUserId(id);
    setUserChecked(checked);
    setIsDisabled(false);
  };

  return (
    <Styled.Wrapper
      data-testid="modal-user"
      className={className}
      isOpen={isOpen}
    >
      <Styled.Background className="modal-user-background" />
      <Styled.Dialog className="modal-user-dialog" ref={modalRef}>
        <Styled.Container className="modal-user-content">
          <Styled.Button.Close>
            <Icon name="cancel" color="dark" size="22px" onClick={onClose} />
          </Styled.Button.Close>
          <Styled.Header>
            Add or remove people in this user group
            <Styled.Label>Add a user:</Styled.Label>
            <Styled.Search
              label="Enter the user's email"
              onChange={e => handleChange(e.currentTarget.value)}
            />
          </Styled.Header>
          <Styled.Content ref={contentRef}>
            {map(users, user => (
              <UserItem
                key={user.id}
                {...user}
                onSelected={(id: string, checked: boolean) =>
                  setSelected(id, checked)
                }
              />
            ))}
          </Styled.Content>
          <Styled.Button.Update>
            <Button.Default
              isDisabled={isDisabled}
              onClick={() => onSelected(userId, userChecked)}
            >
              Update
            </Button.Default>
          </Styled.Button.Update>
        </Styled.Container>
      </Styled.Dialog>
    </Styled.Wrapper>
  );
};

export default AddUserModal;
