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

import { useEffect, useState } from 'react';
import { copyToClipboard } from 'core/utils/clipboard';
import { useCircleDeployLogs } from './hooks';
import Styled from './styled';

type Props = {
  deploymentId: string;
  onGoBack: Function;
};

const LogsModal = ({ onGoBack, deploymentId }: Props) => {
  const { getLogsData } = useCircleDeployLogs();
  const [logsData, setLogsData] = useState([]);

  useEffect(() => {
    getLogsData(deploymentId).then((logsResponse) => {
      setLogsData(logsResponse);
    });
  }, [deploymentId, getLogsData]);

  return (
    <Styled.ModalFull
      onClose={() => onGoBack()}
      onCopy={() => copyToClipboard(JSON.stringify(logsData))}
    >
      <Styled.Editor height="100%" width="100%" data={logsData} mode="view" />
    </Styled.ModalFull>
  );
};

export default LogsModal;
