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
import TextComponent from 'core/components/Text';
import ComponentContentIcon from 'core/components/ContentIcon';
import ComponentLayer from 'core/components/Layer';
import { slideInLeft } from 'core/assets/style/animate';

const Wrapper = styled.div`
  animation: 0.2s ${slideInLeft} linear;
`;

const Layer = styled(ComponentLayer)`
  span + span {
    margin-top: 10px;
  }
`;

const ContentIcon = styled(ComponentContentIcon)`
  align-items: center;
`;

const Form = styled.form`
  width: 271px;
`;

const Title = styled(TextComponent.h2)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  > :last-child {
    margin-left: 10px;
  }
`;

const Subtitle = styled(TextComponent.h5)`
  margin-bottom: 10px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-left: 8px;
`;

const Fields = styled.div`
  margin: 19px 0 30px 0;

  > * {
    margin-top: 19px;
  }
`;

export default {
  Wrapper,
  ContentIcon,
  Layer,
  Content,
  Title,
  Subtitle,
  Fields,
  Form
};
