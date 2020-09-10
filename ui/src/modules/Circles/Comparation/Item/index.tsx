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

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { copyToClipboard } from 'core/utils/clipboard';
import {
  useCircle,
  useDeleteCircle,
  useSaveCircleManually,
  useSaveCircleWithFile,
  useCircleUndeploy
} from 'modules/Circles/hooks';
import { delParam, updateParam } from 'core/utils/path';
import { useDispatch } from 'core/state/hooks';
import routes from 'core/constants/routes';
import Can from 'core/components/Can';
import TabPanel from 'core/components/TabPanel';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import Dropdown from 'core/components/Dropdown';
import Modal from 'core/components/Modal';
import { NEW_TAB } from 'core/components/TabPanel/constants';
import { Circle, Deployment } from 'modules/Circles/interfaces/Circle';
import CreateRelease from 'modules/Circles/Release';
import { updateCirclesAction } from 'modules/Circles/state/actions';
import { DEPLOYMENT_STATUS } from 'core/enums/DeploymentStatus';
import { useCirclePolling } from 'modules/Circles/hooks';
import LayerName from './Layer/Name';
import LayerSegments from './Layer/Segments';
import LayerRelease from './Layer/Release';
import LayerComponents from './Layer/Components';
import LayerMetrics from './Layer/Metrics';
import LayerMetricsGroups from './Layer/MetricsGroups';
import CreateSegments from './CreateSegments';
import MetricsGroups from './MetricsGroups';
import Loader from './Loaders';
import {
  isDefaultCircle,
  pathCircleById,
  isUndeployable,
  isBusy
} from './helpers';
import { SECTIONS } from './enums';
import Styled from './styled';

interface Props {
  id: string;
  onChange: (delCircleStatus: string) => void;
}

const CirclesComparationItem = ({ id, onChange }: Props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState<SECTIONS>();
  const [isEditing, setIsEditing] = useState(false);
  const [data, circleActions] = useCircle();
  const { circleResponse, components, loading } = data;
  const { loadCircle, loadComponents } = circleActions;
  const [delCircle, delCircleResponse] = useDeleteCircle();
  const {
    undeployRelease,
    status: undeployStatus,
    resetStatus: resetUndeployStatus
  } = useCircleUndeploy();
  const [updateManualResponse, updateCircleManually] = useSaveCircleManually(
    id
  );
  const [, updateCircleWithFile] = useSaveCircleWithFile(id);
  const [action, setAction] = useState('');
  const [circle, setCircle] = useState<Circle>();
  const { pollingCircle, response } = useCirclePolling();
  const POLLING_DELAY = 15000;

  useEffect(() => {
    if (circleResponse) {
      setCircle(circleResponse);
    }
  }, [circleResponse]);

  useEffect(() => {
    if (response) {
      setCircle(response);
    }
  }, [response]);

  useEffect(() => {
    let timeout = 0;
    if (isBusy(circle?.deployment?.status)) {
      timeout = setTimeout(() => {
        pollingCircle(circle?.id);
      }, POLLING_DELAY);
    }

    return () => clearTimeout(timeout);
  }, [pollingCircle, circle]);

  useEffect(() => {
    if (updateManualResponse) {
      setCircle(updateManualResponse);
      dispatch(updateCirclesAction([updateManualResponse]));
    }
  }, [dispatch, updateManualResponse]);

  useEffect(() => {
    if (circle?.deployment) {
      loadComponents(id);
    }
  }, [id, loadComponents, circle]);

  useEffect(() => {
    if (undeployStatus === 'resolved') {
      resetUndeployStatus();
      setCircle({
        ...circle,
        deployment: {
          ...circle.deployment,
          status: DEPLOYMENT_STATUS.undeploying
        }
      });
    }
  }, [undeployStatus, setCircle, circle, resetUndeployStatus]);

  useEffect(() => {
    if (id === NEW_TAB) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
      loadCircle(id);
    }
  }, [id, loadCircle]);

  useEffect(() => {
    if (delCircleResponse === 'Deleted') {
      onChange(delCircleResponse);
      delParam('circle', routes.circlesComparation, history, id);
    }
  }, [delCircleResponse, history, id, onChange]);

  const handleDelete = (deployStatus: string) => {
    delCircle(id, deployStatus, circle?.name);
    setAction('');
  };

  const saveCircleName = (name: string) => {
    if (isEditing && circle?.matcherType === 'REGULAR') {
      updateCircleManually({ ...circle, name });
    } else if (isEditing && circle?.matcherType === 'SIMPLE_KV') {
      updateCircleWithFile({ name });
    } else {
      setCircle({ ...circle, name });
    }
  };

  const onSaveCircle = (circleData: Circle) => {
    if (isEditing) {
      loadCircle(id);
    } else {
      updateParam(
        'circle',
        routes.circlesComparation,
        history,
        NEW_TAB,
        circleData.id
      );
    }
    setActiveSection(undefined);
  };

  const onCreateRelease = (deployment: Deployment) => {
    setCircle({ ...circle, deployment });
    setActiveSection(undefined);
  };

  const renderDropdown = () => (
    <Dropdown>
      <Can I="write" a="circles" passThrough>
        <Dropdown.Item
          icon="edit"
          name="Edit segments"
          onClick={() => setActiveSection(SECTIONS.SEGMENTS)}
        />
      </Can>
      {isUndeployable(circle) && (
        <Can I="write" a="deploy" passThrough>
          <Dropdown.Item
            icon="undeploy"
            name="Undeploy"
            onClick={() => undeployRelease(circle?.deployment)}
          />
        </Can>
      )}
      <Can I="read" a="circles" passThrough>
        <Dropdown.Item
          icon="copy"
          name="Copy ID"
          onClick={() => copyToClipboard(id)}
        />
      </Can>
      <Can I="read" a="circles" passThrough>
        <Dropdown.Item
          icon="copy"
          name="Copy link"
          onClick={() => copyToClipboard(pathCircleById(id))}
        />
      </Can>
      <Can I="write" a="circles" passThrough>
        <Dropdown.Item
          icon="delete"
          name="Delete"
          onClick={() => setAction('Delete')}
        />
      </Can>
    </Dropdown>
  );

  const renderWarning = () => (
    <Modal.Trigger
      title="Do you want to delete this circle?"
      dismissLabel="Cancel, keep circle"
      continueLabel="Yes, delete circle"
      onContinue={() => handleDelete(circle?.deployment?.status)}
      onDismiss={() => setAction('Cancel')}
    >
      When deleting this circle, users will be sent to Default and all metrics
      in this circle will be lost. Do you wish to continue?
    </Modal.Trigger>
  );

  const renderActions = () => (
    <Styled.Actions>
      {circle?.deployment && !isBusy(circle?.deployment?.status) && (
        <Can I="write" a="deploy" passThrough>
          <LabeledIcon
            icon="override"
            marginContent="5px"
            onClick={() => setActiveSection(SECTIONS.RELEASE)}
          >
            <Text.h5 color="dark">Override release</Text.h5>
          </LabeledIcon>
        </Can>
      )}
      {renderDropdown()}
    </Styled.Actions>
  );

  const renderComponents = () =>
    isDefaultCircle(circle?.name) && (
      <LayerComponents components={components} />
    );

  const renderPanelContent = () => (
    <>
      {action === 'Delete' && renderWarning()}
      <LayerName name={circle?.name} onSave={saveCircleName} />
      <LayerSegments
        circle={circle}
        isEditing={isEditing}
        onClickCreate={() => setActiveSection(SECTIONS.SEGMENTS)}
      />
      <LayerRelease
        circle={circle}
        onClickCreate={() => setActiveSection(SECTIONS.RELEASE)}
      />
      <LayerMetricsGroups
        circleId={id}
        onClickCreate={() => setActiveSection(SECTIONS.GROUP_METRICS)}
      />
      {renderComponents()}
      {!isDefaultCircle(circle?.name) && circle?.deployment && (
        <LayerMetrics id={id} />
      )}
    </>
  );

  const renderActiveSection = () => {
    return (
      <>
        {activeSection === SECTIONS.SEGMENTS && (
          <CreateSegments
            onGoBack={() => setActiveSection(undefined)}
            id={id}
            circle={circle}
            onSaveCircle={onSaveCircle}
          />
        )}
        {activeSection === SECTIONS.RELEASE && (
          <CreateRelease
            id={id}
            onGoBack={() => setActiveSection(undefined)}
            onCreateRelease={onCreateRelease}
          />
        )}
        {activeSection === SECTIONS.GROUP_METRICS && (
          <MetricsGroups id={id} onGoBack={() => setActiveSection(undefined)} />
        )}
      </>
    );
  };

  const renderPanel = () => (
    <TabPanel
      title={circle?.name}
      onClose={() => delParam('circle', routes.circlesComparation, history, id)}
      actions={isEditing && renderActions()}
      name="circles"
      size="15px"
    >
      {activeSection ? renderActiveSection() : renderPanelContent()}
    </TabPanel>
  );

  return (
    <Styled.Wrapper data-testid={`circle-comparation-item-${id}`}>
      {loading && isEditing ? <Loader.Tab /> : renderPanel()}
    </Styled.Wrapper>
  );
};

export default CirclesComparationItem;
