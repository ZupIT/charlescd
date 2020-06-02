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
import ComponentSelect from 'core/components/Form/Select';
import { fadeIn } from 'core/assets/style/animate';

const Title = styled.div`
  display: flex;

  > :last-child {
    margin-left: 10px;
  }
`;

const Roles = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  > * {
    margin-bottom: 10px;
  }

  > :nth-child(odd) {
    margin-left: 0px;
  }
`;

const Description = styled.div`
  margin: 20px 0;

  > :first-child {
    margin-bottom: 3px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  animation: 0.3s ${fadeIn} linear;
  margin-top: 10px;
  margin-left: 40px;

  > :last-child {
    margin-top: 20px;
  }
`;

const Select = styled(ComponentSelect)`
  width: 271px;
`;

const Fields = styled.div`
  margin-top: 19px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;

  > :last-child {
    margin-left: 10px;
  }
`;

export default {
  Content,
  Title,
  Select,
  Fields,
  Roles,
  Description
};
