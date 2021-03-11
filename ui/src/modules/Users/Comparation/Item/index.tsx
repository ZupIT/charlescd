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

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { copyToClipboard } from 'core/utils/clipboard';
import { useUser, useDeleteUser, useUpdateName } from 'modules/Users/hooks';
import { delParam } from 'core/utils/path';
import routes from 'core/constants/routes';
import TabPanel from 'core/components/TabPanel';
import Avatar from 'core/components/Avatar';
import ContentIcon from 'core/components/ContentIcon';
import Dropdown from 'core/components/Dropdown';
import LabeledIcon from 'core/components/LabeledIcon';
import Text from 'core/components/Text';
import Modal from 'core/components/Modal';
import Icon from 'core/components/Icon';
import InputTitle from 'core/components/Form/InputTitle';
import { User } from 'modules/Users/interfaces/User';
import { isIDMEnabled, isRoot } from 'core/utils/auth';
import { isRequired, maxLength } from 'core/utils/validations';
import { getProfileByKey } from 'core/utils/profile';
import { getUserPathByEmail } from './helpers';
import Loader from './Loaders';
import ModalResetPassword from './Modals/ResetPassword';
import Styled from './styled';
import useForm from 'core/hooks/useForm';

interface Props {
  email: string;
  onChange: (delUserStatus: string) => void;
}

const UsersComparationItem = ({ email, onChange }: Props) => {
  const loggedUserId = getProfileByKey('id');
  const history = useHistory();
  const [isOpenModalPassword, toggleModalPassword] = useState(false);
  const [action, setAction] = useState('');
  const [currentUser, setCurrentUser] = useState<User>();
  const { register, handleSubmit, errors } = useForm<User>({
    mode: 'onChange'
  });
  const { findByEmail, user } = useUser();
  const [delUser, delUserResponse] = useDeleteUser();
  const isAbleToReset = !isIDMEnabled() && loggedUserId !== user?.id;
  const { updateNameById, user: userUpdated, status } = useUpdateName();

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    } else if (email) {
      findByEmail(email);
    }
  }, [user, email, findByEmail]);

  useEffect(() => {
    if (userUpdated) {
      setCurrentUser(userUpdated);
    } else if (status === 'rejected') {
      findByEmail(email);
    }
  }, [userUpdated, status, email, findByEmail]);

  useEffect(() => {
    onChange(delUserResponse);
    if (delUserResponse === 'Deleted') {
      delParam('user', routes.usersComparation, history, currentUser.email);
    }
  });

  const onSubmit = (profile: User) => {
    setCurrentUser(null);
    updateNameById(currentUser.id, profile.name);
  };

  const handleDelete = (userId: string, userName: string) => {
    delUser(userId, userName);
    setAction('');
  };

  const renderWarning = () => (
    <Modal.Trigger
      title="Do you want to delete this user?"
      dismissLabel="Cancel, keep user"
      continueLabel="Yes, delete user"
      onContinue={() => handleDelete(currentUser.id, currentUser.name)}
      onDismiss={() => setAction('Cancel')}
    >
      <Text.h4 color="light">
        By deleting this user, all related information will also be deleted. Do
        you wish to continue?
      </Text.h4>
    </Modal.Trigger>
  );

  const renderDropdown = () => (
    <Dropdown>
      <Dropdown.Item
        icon="copy"
        name="Copy link"
        onClick={() => copyToClipboard(getUserPathByEmail(currentUser.email))}
      />
      {!isIDMEnabled() && (
        <Dropdown.Item
          icon="delete"
          name="Delete"
          onClick={() => setAction('Delete')}
        />
      )}
    </Dropdown>
  );

  const renderResetPassword = () =>
    isAbleToReset && (
      <LabeledIcon
        icon="shield"
        marginContent="5px"
        onClick={() => toggleModalPassword(true)}
      >
        <Text.h5 color="dark">Reset password</Text.h5>
      </LabeledIcon>
    );

  const renderActions = () => (
    <Styled.Actions>
      {renderResetPassword()}
      {renderDropdown()}
    </Styled.Actions>
  );

  const renderPanel = () => (
    <TabPanel
      title={currentUser.name}
      onClose={() => delParam('user', routes.usersComparation, history, email)}
      actions={renderActions()}
      name="user"
      size="15px"
    >
      {action === 'Delete' && renderWarning()}
      <Styled.Layer>
        <Styled.ContentIcon icon="picture">
          <Avatar key={currentUser.id} size="68px" profile={currentUser} />
        </Styled.ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="user">
          {isRoot() && !isIDMEnabled() ? (
            <>
              <InputTitle
                key={currentUser.name}
                name="name"
                resume
                ref={register({
                  required: isRequired(),
                  maxLength: maxLength()
                })}
                isDisabled={!!errors.name}
                defaultValue={currentUser.name}
                onClickSave={handleSubmit(onSubmit)}
              />
              {errors.name && (
                <Styled.FieldErrorWrapper>
                  <Icon name="error" color="error" />
                  <Text.h6 color="error">{errors.name.message}</Text.h6>
                </Styled.FieldErrorWrapper>
              )}
            </>
          ) : (
            <Text.h2 color="light">{currentUser.name}</Text.h2>
          )}
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="email">
          <Text.h2 color="light">Email</Text.h2>
          <Text.h4 color="dark">{currentUser.email}</Text.h4>
        </ContentIcon>
      </Styled.Layer>
      <Styled.Layer>
        <ContentIcon icon="users">
          <Text.h2 color="light">User groups</Text.h2>
        </ContentIcon>
      </Styled.Layer>
    </TabPanel>
  );

  return (
    <Styled.Wrapper data-testid={`users-comparation-item-${email}`}>
      {!currentUser ? <Loader.Tab /> : renderPanel()}
      {isOpenModalPassword && (
        <ModalResetPassword user={currentUser} onClose={toggleModalPassword} />
      )}
    </Styled.Wrapper>
  );
};

export default UsersComparationItem;
