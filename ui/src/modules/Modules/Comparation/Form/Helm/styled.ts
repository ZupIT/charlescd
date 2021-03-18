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
import Text from 'core/components/Text';


const Form = styled.form``;

const Title = styled(Text.h2)`
  display: flex;
  align-items: center;

  > :last-child {
    margin-left: 10px;
  }
`;

const Input = styled(FormComponent.Input)`
  width: 271px;
  margin-bottom: 12px;
`;

const Helm = styled.div`
  margin-top: 40px;
  margin-bottom: 12px;
  width: 271px;
`;

const Fields = styled.div`
  margin-bottom: 12px;
  width: 271px;
`;

export default {
  Form,
  Title,
  Input,
  Helm,
  Fields
}