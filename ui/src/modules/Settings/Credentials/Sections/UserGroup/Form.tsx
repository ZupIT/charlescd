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

import React, { useState, useEffect } from 'react';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { useForm } from 'react-hook-form';
import Text from 'core/components/Text';
import Card from 'core/components/Card';
import Button from 'core/components/Button';
import Popover, { CHARLES_DOC } from 'core/components/Popover';
import { Option } from 'core/components/Form/Select/interfaces';
import CustomOption from 'core/components/Form/Select/CustomOption';
import { getWorkspaceId } from 'core/utils/workspace';
import Loader from './Loader';
import { useUserGroup, useRole } from './hooks';
import { UserGroup, Role } from './interfaces';
import { Props } from '../interfaces';
import { reduce } from './helpers';
import Styled from './styled';

const FormUserGroup = ({ onFinish }: Props) => {
  const {
    responseSave,
    responseAll,
    save,
    loadingSave,
    loadingAdd,
    loadingAll,
    getAll
  } = useUserGroup();
  const {
    getAll: getAllRoles,
    responseAll: rolesAll,
    loadingAll: loadingRolesAll
  } = useRole();
  const { control, getValues, watch } = useForm<UserGroup>();
  const watchedRoleId = watch('roleId');
  const [isDisableAdd, setIsDisableAdd] = useState(true);
  const [isDisableSave, setIsDisableSave] = useState(true);
  const [form, setForm] = useState(false);
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

  useEffect(() => getAll(), [getAll]);

  useEffect(() => {
    if (responseSave) onFinish();
  }, [onFinish, responseSave]);

  useEffect(() => {
    if (form) getAllRoles();
  }, [getAllRoles, form]);

  useEffect(() => {
    setIsDisableSave(isEmpty(watchedRoleId));
  }, [watchedRoleId]);

  const onSelectGoup = (option: Option) => {
    setIsDisableAdd(!option);
    setGroup(option);
  };

  const onRemove = () => {
    setGroup(null);
    setForm(false);
    setIsDisableAdd(true);
    setIsDisableSave(true);
  };

  const onSubmit = () => {
    const { roleId } = getValues();
    save(getWorkspaceId(), {
      userGroupId: group.value,
      roleId
    });
  };

  const renderSelectedGroup = () => (
    <Card.Config
      icon="info"
      description={group.label}
      onClose={() => onRemove()}
    />
  );

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
      {renderSelectedGroup()}
      <Styled.Description>
        <Text.h5 color="dark">
          Select permissions for the group selected above.
        </Text.h5>
        <Text.h5 color="dark" fontStyle="italic">
          After saving it, you can combine another group of users with different
          permissions.
        </Text.h5>
      </Styled.Description>
      {renderRoles()}
    </>
  );

  const renderFields = () => (
    <Styled.Fields>
      <Styled.Select
        control={control}
        name="userGroup"
        customOption={CustomOption.Icon}
        options={reduce(responseAll as UserGroup[])}
        label="Select a user group"
        isDisabled={loadingAll}
        onChange={group => onSelectGoup(group)}
      />
      <Button.Default
        isLoading={loadingAll}
        isDisabled={isDisableAdd}
        size="EXTRA_SMALL"
        onClick={() => setForm(true)}
      >
        Add
      </Button.Default>
    </Styled.Fields>
  );

  return (
    <Styled.Content>
      <Styled.Title>
        <Text.h2 weight="bold" color="light">
          Add user group
        </Text.h2>
        <Popover
          title="How does a user group work?"
          icon="info"
          link={`${CHARLES_DOC}/primeiros-passsos/configurando-workspace`}
          linkLabel="View documentation"
          description="With the user group you have more control over the entire application. You can choose which accesses this group will have in this workspace. Consult the our documentation for further details."
        />
      </Styled.Title>
      {form ? renderForm() : renderFields()}
      <Button.Default
        type="submit"
        onClick={onSubmit}
        isDisabled={isDisableSave}
        isLoading={loadingSave || loadingAdd}
      >
        Save
      </Button.Default>
    </Styled.Content>
  );
};

export default FormUserGroup;
