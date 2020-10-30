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

import React, { Fragment, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import uppercase from 'lodash/upperCase';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import Form from 'core/components/Form';
import { useUpdateProfile } from 'modules/Users/hooks';
import { Profile } from 'modules/Users/interfaces/User';
import Styled from './styled';

export interface Props {
  size?: string;
  profile: Profile;
  onFinish?: Function;
}

const Avatar = ({ size, profile, onFinish }: Props) => {
  const [url, setUrl] = useState<string>();
  const { updateProfile, status } = useUpdateProfile();
  const { register, handleSubmit } = useForm<Profile>();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setUrl(profile.photoUrl);
  }, [profile]);

  useEffect(() => {
    if (status.isResolved && onFinish) {
      onFinish();
    }
  }, [status, onFinish]);

  const onSubmit = (user: Profile) => {
    setIsEditMode(false);
    setUrl(user.photoUrl);
    updateProfile(profile.id, {
      name: profile.name,
      email: profile.email,
      photoUrl: user.photoUrl
    });
  };

  const renderEditMode = () => (
    <Form.InputTitle
      name="photoUrl"
      ref={register}
      onClickSave={handleSubmit(onSubmit)}
    />
  );

  const renderInitials = () => (
    <Styled.Avatar.WithoutPhoto data-testid="avatar" size={size}>
      {uppercase(first(profile.name))}
    </Styled.Avatar.WithoutPhoto>
  );

  const renderPhoto = () => (
    <Styled.Avatar.WithPhoto data-testid="avatar" size={size} src={url} />
  );

  const renderEditButton = () => (
    <Styled.Avatar.Edit
      name="edit-avatar"
      onClick={() => setIsEditMode(true)}
    />
  );

  const renderAvatar = () => (
    <Fragment>
      {isEmpty(url) ? renderInitials() : renderPhoto()}
      {renderEditButton()}
    </Fragment>
  );

  const renderLoader = () => (
    <Styled.LoaderContainer>
      <Styled.Loader name="loading" size={size} />
    </Styled.LoaderContainer>
  );

  const render = () => (
    <Styled.Wrapper>
      {status.isPending ? renderLoader() : renderAvatar()}
    </Styled.Wrapper>
  );

  return isEditMode ? renderEditMode() : render();
};

export default Avatar;
