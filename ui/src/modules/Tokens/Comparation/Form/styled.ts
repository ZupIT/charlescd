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
import FormComponent from 'core/components/Form';
import ButtonComponent from 'core/components/Button';
import IconComponent from 'core/components/Icon';
import Text from 'core/components/Text';

const Title = styled(Text.h2)`
  display: flex;
  align-items: center;

  > :last-child {
    margin-left: 10px;
  }
`;

const Info = styled.div`
  > :first-child {
    margin-bottom: 5px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  margin-left: 8px;
`;

const Form = styled.form`
  > * {
    margin-top: 20px;
  }
`;

const Input = styled(FormComponent.Input)`
  width: 271px;
  margin-bottom: 12px;
`;

const Button = styled(ButtonComponent.Default)`
  margin-top: 10px;
`;

const Icon = styled(IconComponent)`
  margin-bottom: 30px;
`;

export default {
  Content,
  Title,
  Info,
  Form,
  Input,
  Button,
  Icon
};
