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
import ComponentButton from 'core/components/Button';

const Card = styled.div`
  height: 55px;
  width: 269px;
  padding: 10px 0;
  border-radius: 4px;
  background: ${({ theme }) => theme.board.createCard};

  input {
    background: transparent;
    border: none;
    padding: 0 20px 5px 20px;
  }

  label {
    padding-left: 20px;
  }
`;

const Button = styled(ComponentButton.Rounded)`
  height: 40px;
  width: 268px;
  padding: 15px 33px 15px 85px;
  background: ${({ theme }) => theme.board.createCard};
`;

export default {
  Button,
  Card
};
