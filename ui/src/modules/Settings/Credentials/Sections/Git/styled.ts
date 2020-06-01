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
import ComponentText from 'core/components/Text';

const Title = styled(ComponentText.h2)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  > :last-child {
    margin-left: 10px;
  }
`;

const Subtitle = styled(ComponentText.h5)`
  margin-bottom: 10px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-left: 40px;
`;

const Form = styled.form`
  margin-top: 20px;
  width: 271px;
`;

const Fields = styled.div`
  margin: 19px 0 20px 0;

  > * {
    margin-top: 19px;
  }
`;

export default {
  Content,
  Title,
  Subtitle,
  Form,
  Fields
};
