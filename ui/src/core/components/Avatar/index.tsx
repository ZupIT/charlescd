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
  const [
    loadingProfile,
    loadingUpdate,
    updateProfile,
    ,
    status
  ] = useUpdateProfile();
  const { register, handleSubmit } = useForm<Profile>();
  const [editAvatar, setEditAvatar] = useState(false);

  useEffect(() => {
    setUrl(profile.photoUrl);
  }, [profile]);

  useEffect(() => {
    if (status === 'resolved') {
      onFinish && onFinish();
    }
  }, [status, onFinish]);

  const onSubmit = (user: Profile) => {
    setEditAvatar(false);
    setUrl(user.photoUrl);
    updateProfile(profile.id, {
      name: profile.name,
      email: profile.email,
      photoUrl: user.photoUrl
    });
  };

  const renderEditAvatar = () => (
    <Form.InputTitle
      name="photoUrl"
      ref={register}
      onClickSave={handleSubmit(onSubmit)}
    />
  );

  const renderProfilePicture = () => (
    <>
      {isEmpty(url) ? (
        <Styled.Avatar.WithoutPhoto data-testid="avatar" size={size}>
          {uppercase(first(profile.name))}
        </Styled.Avatar.WithoutPhoto>
      ) : (
        <Styled.Avatar.WithPhoto data-testid="avatar" size={size} src={url} />
      )}
      {
        <Styled.Avatar.Edit
          name="edit-avatar"
          onClick={() => setEditAvatar(true)}
        />
      }
    </>
  );

  const renderLoader = () => (
    <Styled.LoaderContainer>
      <Styled.Loader name="loading" size={size} />
    </Styled.LoaderContainer>
  );

  const renderAvatar = () => (
    <Styled.Wrapper>
      {loadingProfile || loadingUpdate
        ? renderLoader()
        : renderProfilePicture()}
    </Styled.Wrapper>
  );

  return editAvatar ? renderEditAvatar() : renderAvatar();
};

export default Avatar;
