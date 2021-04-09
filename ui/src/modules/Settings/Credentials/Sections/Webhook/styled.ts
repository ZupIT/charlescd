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

const Content = styled.div`
  display: flex;
  flex-direction: column;
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

const Form = styled.form``;

const Fields = styled.div`
  width: 310px;
  margin: 19px 0 20px 0;

  > * {
    margin-top: 19px;
  }
`;

const Field = styled.div`
  > :last-child {
    margin-top: 5px;
    margin-left: 30px;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;

  > * {
    margin-top: 19px;
  }
`;

export default {
  Form,
  Content,
  Fields,
  Field,
  Actions
};
