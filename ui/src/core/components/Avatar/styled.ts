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

import styled from 'styled-components';
import IconComponent from 'core/components/Icon';
import { Props } from '.';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
`;

const AvatarWithPhoto = styled.img<Partial<Props>>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`;

const AvatarWithoutPhoto = styled.div<Partial<Props>>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
  background: ${({ theme }) => theme.avatar.background};
  color: ${({ theme }) => theme.avatar.color};
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const EditAvatar = styled(IconComponent)`
  position: relative;
  margin-left: -20px;
`;

const LoaderContainer = styled.div<Partial<Props>>`
  position: relative;
  margin-left: 20px;
  border: none;
  border-radius: 50%;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

const Loader = styled(IconComponent)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default {
  Wrapper,
  Avatar: {
    Edit: EditAvatar,
    WithPhoto: AvatarWithPhoto,
    WithoutPhoto: AvatarWithoutPhoto
  },
  Loader,
  LoaderContainer,
  Form
};
