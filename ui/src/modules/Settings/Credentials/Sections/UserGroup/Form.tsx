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

import { useState, useEffect } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import debounce from 'debounce-promise';
import useForm from 'core/hooks/useForm';
import Text from 'core/components/Text';
import ButtonDefault from 'core/components/Button/ButtonDefault';
import { CHARLES_DOC } from 'core/components/Popover';
import { Option } from 'core/components/Form/Select/interfaces';
import CustomOption from 'core/components/Form/Select/CustomOptions';
import Link from 'core/components/Link';
import { getWorkspaceId } from 'core/utils/workspace';
import Loader from './Loader';
import { useUserGroup, useRole } from './hooks';
import { UserGroup, Role } from './interfaces';
import { Props } from '../interfaces';
import { reduce } from './helpers';
import Styled from './styled';

const FormUserGroup = ({ onFinish }: Props<UserGroup>) => {
  const {
    responseSave,
    responseAll,
    save,
    loadingSave,
    loadingAdd,
    loadingAll,
    getAll,
    findUserGroupByName
  } = useUserGroup();
  const {
    getAll: getAllRoles,
    responseAll: rolesAll,
    loadingAll: loadingRolesAll
  } = useRole();
  const { control, getValues, watch } = useForm<UserGroup>();
  const watchedRoleId = watch('roleId');
  const [isDisableSave, setIsDisableSave] = useState(true);
  const [roleOptions, setRoleOptions] = useState(null);
  const [group, setGroup] = useState(null);

  useEffect(() => {
    const options = map(rolesAll as Role[], (role: Role) => ({
      value: role.id,
      label: role.name,
      description: role.description
    }));

    setRoleOptions(options);
  }, [rolesAll]);

  useEffect(() => {
    getAll();
  }, [getAll]);

  useEffect(() => {
    if (responseSave) onFinish();
  }, [onFinish, responseSave]);

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  useEffect(() => {
    setIsDisableSave(isEmpty(watchedRoleId));
  }, [watchedRoleId]);

  const onSelectGroup = (option: Option) => {
    setGroup(option);
  };

  const onSubmit = () => {
    const { roleId } = getValues();
    save(getWorkspaceId(), {
      userGroupId: group.value,
      roleId
    });
  };

  const renderRoles = () =>
    loadingRolesAll ? (
      <Loader.Roles />
    ) : (
      <Styled.Roles>
        <Styled.Select
          control={control}
          name="roleId"
          customOption={CustomOption.Description}
          options={roleOptions}
          label="Choose a permission"
          isDisabled={loadingAll}
        />
      </Styled.Roles>
    );

  const renderForm = () => (
    <>
      <Styled.Description>
        <Text tag="H5" color="dark">
          Select permissions for the group selected above.
        </Text>
        <Text tag="H5" color="dark" fontStyle="italic">
          After saving it, you can combine another group of users with different
          permissions.
        </Text>
      </Styled.Description>
      {renderRoles()}
    </>
  );

  const loadUserGroups = debounce(
    name =>
      findUserGroupByName(name).then(
        ({ content }: { content: UserGroup[] }) => {
          return reduce(content);
        }
      ),
    500
  );

  const renderFields = () => (
    <Styled.Fields>
      <Styled.SelectAsync
        control={control}
        name="userGroup"
        customOption={CustomOption.Icon}
        options={reduce(responseAll as UserGroup[])}
        label="Select a user group"
        isDisabled={loadingAll}
        loadOptions={loadUserGroups}
        onChange={group => onSelectGroup(group)}
      />
    </Styled.Fields>
  );

  return (
    <Styled.Content>
      <Styled.Title>
        <Text tag="H2" weight="bold" color="light">
          Add user group
        </Text>
      </Styled.Title>
      <Styled.Description>
        <Text tag="H4" color="dark" data-testid="user-group-help-text">
          With the user group you have more control over the entire application.
          You can choose which accesses this group will have in this workspace.
          See our{' '}
          <Link href={`${CHARLES_DOC}/reference/users-group`} >
            documentation
          </Link>{' '}
          for further details.
        </Text>
      </Styled.Description>
      {renderFields()}
      {group && renderForm()}
      <ButtonDefault
        id="save"
        type="submit"
        onClick={onSubmit}
        isDisabled={isDisableSave}
        isLoading={loadingSave || loadingAdd}
      >
        Save
      </ButtonDefault>
    </Styled.Content>
  );
};

export default FormUserGroup;
