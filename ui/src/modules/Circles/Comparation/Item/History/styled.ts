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
import ComponentIcon from 'core/components/Icon';
import ComponentText from 'core/components/Text';
import { slideInRight } from 'core/assets/style/animate';
import LayerComponent from 'core/components/Layer';


const Icon = styled(ComponentIcon)`
  animation: ${slideInRight} 1s forwards;
  margin-bottom: 20px;
  margin-top: 22px;
`;

const Layer = styled(LayerComponent)`
  margin-top: 20px;
  margin-left: 40px;
`;

const Title = styled.div`
  display: flex;
  margin-bottom: 20px;

  span {
    margin-left: 15px;
    margin-top: 2px;
  }
`;

const DeploymentRow = styled.div`
  position: relative;
  background-color: ${({ theme }) =>
    theme.circleDeploymentHistory.content.table};
  margin-bottom: 5px;
  border-radius: 4px;
  height: 100px;
`;

const TableRow = styled.div`
  display: flex;
  padding-top: 5px;
  padding-bottom: 10px;
`;

const ReleaseRow = styled.div`
  margin: 0 10px 0 10px;
  border-radius: 4px;
  height: 40px;
  background-color: ${({ theme }) =>
    theme.circleDeploymentHistory.content.release};
  
`;

const TableTextName = styled(ComponentText.h4)`
  display: flex;
  align-items: center;
  padding-left: 10px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 120px;
`;

const TableTextRelease = styled(ComponentText.h4)`
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-top: 10px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 510px;
`;

const TableExpand = styled(ComponentIcon)`
  margin-top: 15px;
  margin-right: 10px;
`;

type DotProps = {
  status: string;
}

const Dot = styled.div<DotProps>`
  height: 16px;
  width: 16px;
  background-color: ${({ theme, status }) => 
  theme.circleDeploymentHistory.execution[status]};
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
`;

const TableDeployStatus = styled.div`

`;

const TabledeployStatusName = styled(ComponentText.h4)`
  display: flex;
  align-items: center;
  padding-left: 10px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 120px;
`;

export default {
  Icon,
  Layer,
  Title,
  DeploymentRow,
  TableRow,
  TableDeployStatus,
  TableTextName,
  TableTextRelease,
  TableExpand,
  TabledeployStatusName,
  Dot,
  ReleaseRow
};
