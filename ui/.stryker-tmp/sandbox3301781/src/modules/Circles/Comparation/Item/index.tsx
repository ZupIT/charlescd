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
// @ts-nocheck


import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { copyToClipboard } from 'core/utils/clipboard';
import {
  useCircle,
  useDeleteCircle,
  useSaveCircleManually,
  useSaveCircleWithFile,
  useCircleUndeploy,
} from 'modules/Circles/hooks';
import { delParam, updateParam } from 'core/utils/path';
import { useDispatch } from 'core/state/hooks';
import routes from 'core/constants/routes';
import Can from 'containers/Can';
import TabPanel from 'core/components/TabPanel';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import Dropdown from 'core/components/Dropdown';
import ModalTrigger from 'core/components/Modal/Trigger';
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
import LayerMetricsGroups from './Layer/MetricsGroups';
import CreateSegments from './CreateSegments';
import MetricsGroups from './MetricsGroups';
import DeployHistory from './History';
import Loader from './Loaders';
import {
  isDefaultCircle,
  pathCircleById,
  isUndeployable,
  isBusy,
  getTooltipMessage,
  cannotCircleBeDeleted,
} from './helpers';
import { SECTIONS } from './enums';
import Styled from './styled';
import get from 'lodash/get';
import { CirclePercentagePagination } from 'modules/Circles/interfaces/CirclesPagination';

interface Props {
  id: string;
  onChange: (delCircleStatus: string) => void;
  updateCircle: () => void;
  circlesListResponse: CirclePercentagePagination;
}

const CirclesComparationItem = ({
  id,
  onChange,
  updateCircle,
  circlesListResponse,
}: Props) => {
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
    resetStatus: resetUndeployStatus,
  } = useCircleUndeploy();
  const [updateManualResponse, updateCircleManually] = useSaveCircleManually(
    id
  );
  const [, updateCircleWithFile] = useSaveCircleWithFile(id);
  const [action, setAction] = useState('');
  const [circle, setCircle] = useState<Circle>();
  const { pollingCircle, response } = useCirclePolling();
  const POLLING_DELAY = 15000;
  const [releaseEnabled, setReleaseEnabled] = useState<boolean>(true);

  useEffect(() => {
    if (circleResponse) {
      setCircle(circleResponse);
    }
  }, [circleResponse]);

  useEffect(() => {
    if (
      response &&
      !response?.deployment &&
      circle?.deployment?.status === DEPLOYMENT_STATUS.undeploying
    ) {
      updateCircle();
      setCircle(response);
    }
  }, [response, circle, updateCircle]);

  useEffect(() => {
    if (response) {
      setCircle(response);
    }
  }, [response]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
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
          status: DEPLOYMENT_STATUS.undeploying,
        },
      });
    }
  }, [undeployStatus, setCircle, circle, resetUndeployStatus, updateCircle]);

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

  const checkIfReleaseIsEnabled = () => {
    const sumPercentage: number = get(
      circlesListResponse,
      'content[0].sumPercentage',
      0
    );
    const availablePercentage = 100 - sumPercentage;
    if (availablePercentage < circle.percentage && !circle.deployment) {
      return setReleaseEnabled(false);
    }
    return setReleaseEnabled(true);
  };

  useEffect(() => {
    if (circlesListResponse && circle) {
      checkIfReleaseIsEnabled();
    }
  });

  const handleDelete = (deployStatus: string) => {
    delCircle(id, deployStatus, circle?.name);
    setAction('');
    updateCircle();
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
    updateCircle();
    setActiveSection(undefined);
  };

  const onCreateRelease = (deployment: Deployment) => {
    setCircle({ ...circle, deployment });
    setActiveSection(undefined);
    updateCircle();
  };

  const isInactive = () =>
    cannotCircleBeDeleted(circle);
  const renderDropdown = () => (
    <Dropdown>
      {!circle?.default && (
        <Can I="write" a="circles" passThrough>
          <Dropdown.Item
            icon="edit"
            name="Edit segments"
            onClick={() => setActiveSection(SECTIONS.SEGMENTS)}
          />
        </Can>
      )}
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
      <Dropdown.Item
        id="dropdown-item-delete-circle"
        icon="delete"
        name="Delete"
        tooltip={getTooltipMessage(circle)}
        isInactive={isInactive()}
        onClick={() => setAction('Delete')}
      />
    </Dropdown>
  );

  const renderWarning = () => (
    <ModalTrigger
      title="Do you want to delete this circle?"
      dismissLabel="Cancel, keep circle"
      continueLabel="Yes, delete circle"
      onContinue={() => handleDelete(circle?.deployment?.status)}
      onDismiss={() => setAction('Cancel')}
    >
      <Text tag="H4" color="light">
        When deleting this circle, users will be sent to Default and all metrics
        in this circle will be lost. Do you wish to continue?
      </Text>
    </ModalTrigger>
  );

  const renderActions = () => (
    <Styled.Actions>
      {circle?.deployment && !isBusy(circle?.deployment?.status) && (
        <Can I="write" a="deploy" passThrough>
          <Styled.A onClick={() => setActiveSection(SECTIONS.RELEASE)}>
            <LabeledIcon
              icon="override"
              marginContent="5px"
            >
              <Text tag="H5" color="dark">
                Override release
              </Text>
            </LabeledIcon>
          </Styled.A>
        </Can>
      )}
      <LabeledIcon
        icon="clock"
        marginContent="5px"
        onClick={() => setActiveSection(SECTIONS.HISTORY)}
      >
        <Text tag="H5" color="dark">
          History
        </Text>
      </LabeledIcon>
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
      <LayerName
        name={circle?.name}
        onSave={saveCircleName}
        isDefault={circle?.default}
      />
      <LayerSegments
        circle={circle}
        isEditing={isEditing}
        onClickCreate={() => setActiveSection(SECTIONS.SEGMENTS)}
        percentageCircles={circlesListResponse}
        setActiveSection={setActiveSection}
      />
      <LayerRelease
        circle={circle}
        releaseEnabled={releaseEnabled}
        onClickCreate={() => setActiveSection(SECTIONS.RELEASE)}
      />
      <LayerMetricsGroups
        circle={circle}
        circleId={id}
        onClickCreate={() => setActiveSection(SECTIONS.GROUP_METRICS)}
      />
      {renderComponents()}
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
        {activeSection === SECTIONS.HISTORY && (
          <DeployHistory id={id} onGoBack={() => setActiveSection(undefined)} />
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
