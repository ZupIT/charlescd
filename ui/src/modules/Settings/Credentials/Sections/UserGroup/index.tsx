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

import React, { useState, useRef, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import map from 'lodash/map';
import CardConfig from 'core/components/Card/Config';
import { UserGroup } from 'modules/Groups/interfaces/UserGroups';
import Section from 'modules/Settings/Credentials/Section';
import Layer from 'modules/Settings/Credentials/Section/Layer';
import { getWorkspaceId } from 'core/utils/workspace';
import { useDeleteUserGroup } from './hooks';
import { FORM_USER_GROUP } from './constants';
import FormUserGroup from './Form';
import ModalTrigger from 'core/components/Modal/Trigger';
import Text from 'core/components/Text';
import { getProfileByKey } from 'core/utils/profile';
import { useHistory } from 'react-router';
import routes from 'core/constants/routes';
import useOutsideClick from 'core/hooks/useClickOutside';
import { hasUserDuplication } from './helpers';

interface Props {
  form: string;
  setForm: Function;
  data: UserGroup[];
  onSave: () => void;
}

const SectionUserGroup = ({ form, setForm, onSave, data }: Props) => {
  const [userGroups, setUserGroups] = useState(data);
  const { remove, status } = useDeleteUserGroup();
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [currentUserGroup, setCurrentUserGroup] = useState(null);
  const history = useHistory();
  const modalRef = useRef<HTMLDivElement>();

  useOutsideClick(modalRef, () => setToggleModal(false));

  useEffect(() => {
    if (data !== userGroups) {
      setUserGroups(data);
    }
  }, [data, userGroups]);

  const confirmUserGroupDelete = async () => {
    const email = getProfileByKey('email');
    const { users } = currentUserGroup;
    const hasUser = find(users, (user) => user.email === email);
    const isUserDuplicated = !hasUserDuplication(userGroups, email);

    await remove(getWorkspaceId(), currentUserGroup.id);
    onSave();

    setToggleModal(false);

    if (hasUser && isUserDuplicated) {
      history.push(routes.workspaces);
    }
  };

  const handleClose = (userGroup: any) => {
    setCurrentUserGroup(userGroup);
    setToggleModal(true);
  };

  const renderWarningModal = () => (
    <ModalTrigger
      ref={modalRef}
      title="Do you want to remove this user group?"
      dismissLabel="Cancel, keep user group"
      onDismiss={() => setToggleModal(false)}
      continueLabel="Yes, remove user group"
      onContinue={() => confirmUserGroupDelete()}
    >
      <Text tag="H4" color="light" lineHeight={1.3}>
        When you remove a user group, all the users associated to the group will
        no longer access the workspace. Do you want to continue?
      </Text>
    </ModalTrigger>
  );

  const renderSection = () => (
    <Section
      name="User group"
      icon="users"
      showAction
      action={() => setForm(FORM_USER_GROUP)}
      type="Optional"
    >
      {toggleModal && renderWarningModal()}
      {userGroups &&
        map(userGroups, (userGroup) => (
          <CardConfig
            id={`user-group-${userGroup.id}`}
            key={userGroup.name}
            icon="users"
            description={userGroup.name}
            isLoading={status === 'pending'}
            onClose={() => handleClose(userGroup)}
          />
        ))}
    </Section>
  );

  const renderForm = () =>
    isEqual(form, FORM_USER_GROUP) && (
      <Layer action={() => setForm(null)}>
        <FormUserGroup
          onFinish={() => {
            onSave();
            setForm(null);
          }}
        />
      </Layer>
    );

  return form ? renderForm() : renderSection();
};

export default SectionUserGroup;
