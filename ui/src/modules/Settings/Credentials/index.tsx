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

import { useState, useEffect } from 'react';
import useForm from 'core/hooks/useForm';
import isEmpty from 'lodash/isEmpty';
import { copyToClipboard } from 'core/utils/clipboard';
import { useWorkspaceUpdateName } from 'modules/Settings/hooks';
import { useActionData } from './Sections/MetricAction/hooks';
import { getWorkspaceId } from 'core/utils/workspace';
import ContentIcon from 'core/components/ContentIcon';
import TabPanel from 'core/components/TabPanel';
import Layer from 'core/components/Layer';
import Form from 'core/components/Form';
import Section from './Sections';
import Loader from './Loaders';
import Styled from './styled';
import Dropdown from 'core/components/Dropdown';
import { useDatasource } from './Sections/MetricProvider/hooks';
import { Datasource } from './Sections/MetricProvider/interfaces';
import { useGlobalState } from 'core/state/hooks';

interface Props {
  onClickHelp?: (status: boolean) => void;
  onChangeWorkspace: () => void;
}

type FormState = {
  name: string;
}

const Credentials = ({ onChangeWorkspace, onClickHelp }: Props) => {
  const { item: workspace } = useGlobalState(({ workspaces }) => workspaces);
  const id = getWorkspaceId();
  const [form, setForm] = useState<string>('');
  const { updateWorkspaceName } = useWorkspaceUpdateName();
  const {
    responseAll: datasources,
    getAll: getAllDatasources
  } = useDatasource();
  const {
    getActionData,
    actionResponse,
    status: actionDataStatus
  } = useActionData();
  const { register, handleSubmit, errors } = useForm<FormState>({
    mode: 'onChange'
  });

  const handleSaveClick = ({ name }: Record<string, string>) => {
    updateWorkspaceName(name);
  };

  const getActions = () => getActionData();

  const getDatasources = () => getAllDatasources();

  useEffect(() => {
    if (actionDataStatus.isIdle) {
      getActionData();
    }
  }, [getActionData, actionDataStatus]);

  useEffect(() => {
    getAllDatasources();
  }, [getAllDatasources]);

  const renderContent = () => (
    <Layer>
      <ContentIcon icon="workspace">
        <Form.InputTitle
          {...register('name', { required: true })}
          resume={true}
          defaultValue={workspace?.name}
          onClickSave={handleSubmit(handleSaveClick)}
          isDisabled={!!errors?.name}
        />
      </ContentIcon>
    </Layer>
  );

  const renderDropdown = () => (
    <Dropdown>
      <Dropdown.Item
        icon="copy"
        name="Copy ID"
        onClick={() => copyToClipboard(id)}
      />
      <Dropdown.Item
        icon="help"
        name="Help"
        onClick={() => onClickHelp(true)}
      />
    </Dropdown>
  );

  const renderActions = () => (
    <Styled.Actions>{renderDropdown()}</Styled.Actions>
  );

  const renderPanel = () => (
    <TabPanel
      title={workspace.name}
      name="workspace"
      size="15px"
      actions={renderActions()}
    >
      {isEmpty(form) && renderContent()}
      <Section.Registry
        form={form}
        setForm={setForm}
        onChange={onChangeWorkspace}
        data={workspace?.registryConfiguration}
      />
      <Section.DeploymentConfiguration
        form={form}
        setForm={setForm}
        onSave={onChangeWorkspace}
        data={workspace.deploymentConfiguration}
      />
      <Section.CircleMatcher
        form={form}
        setForm={setForm}
        onChange={onChangeWorkspace}
        data={workspace.circleMatcherUrl}
      />
      <Section.MetricProvider
        form={form}
        setForm={setForm}
        data={datasources as Datasource[]}
        getNewDatasources={getDatasources}
      />
      {actionDataStatus.isResolved && (
        <Section.MetricAction
          form={form}
          setForm={setForm}
          actions={actionResponse}
          getNewActions={getActions}
        />
      )}
      <Section.Webhook
        form={form}
        setForm={setForm}
        onSave={onChangeWorkspace}
        data={workspace.webhookConfiguration}
      />
      <Section.UserGroup
        form={form}
        setForm={setForm}
        onSave={onChangeWorkspace}
        data={workspace.userGroups}
      />
    </TabPanel>
  );

  return (
    <Styled.Wrapper data-testid="credentials">
      {isEmpty(workspace?.id) || !datasources ? (
        <Loader.Tab />
      ) : (
        renderPanel()
      )}
    </Styled.Wrapper>
  );
};

export default Credentials;
