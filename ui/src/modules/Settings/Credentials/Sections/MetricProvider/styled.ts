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
import ComponentInput from 'core/components/Form/Input';
import ComponentSelect from 'core/components/Form/Select';
import { fadeIn } from 'core/assets/style/animate';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  animation: 0.3s ${fadeIn} linear;
  margin-top: 10px;
  margin-left: 40px;

  > :first-child {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    > :last-child {
      margin-left: 10px;
    }
  }
`;

const Form = styled.form`
  width: 269px;

  > :first-child {
    margin-bottom: 20px;
  }
`;

const Input = styled(ComponentInput)`
  margin-bottom: 20px;
`;

const Select = styled(ComponentSelect)`
  margin-bottom: 20px;
  width: 271px;
`;

const Field = styled.div`
  width: 500px;
  display: flex;
  flex-direction: row;
  align-items: center;

  > :first-child {
    width: 200px;
  }

  > * + * {
    margin-left: 10px;
  }
`;

export default {
  Form,
  Content,
  Input,
  Field,
  Select
};
