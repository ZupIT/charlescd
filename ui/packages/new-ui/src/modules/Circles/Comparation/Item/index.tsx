import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import copyToClipboard from 'clipboard-copy';
import { useCircle } from 'modules/Circles/hooks';
import { delParamCircle } from 'modules/Circles/helpers';
import TabPanel from 'core/components/TabPanel';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import Dropdown from 'core/components/Dropdown';
import { goToV2 } from 'core/helpers/path';
import LayerName from './Layer/Name';
import LayerSegments from './Layer/Segments';
import LayerLastRelease from './Layer/LastRelease';
import LayerModules from './Layer/Modules';
import LayerMetrics from './Layer/Metrics';
import { pathCircleById, pathCircleEditById, isDefaultCircle } from './helpers';
import Loader from './Loaders';
import Styled from './styled';

interface Props {
  id: string;
}

const CirclesComparationItem = ({ id }: Props) => {
  const history = useHistory();
  const [circle, loadCircle] = useCircle();

  const actions = [
    {
      icon: 'edit',
      name: 'Edit',
      onClick: () => goToV2(pathCircleEditById(id))
    },
    {
      icon: 'copy',
      name: 'Copy link',
      onClick: () => copyToClipboard(pathCircleById(id))
    }
  ];

  useEffect(() => {
    loadCircle(id);
  }, [id, loadCircle]);

  const renderActions = () => (
    <Styled.Actions>
      <Styled.A href={`${pathCircleEditById(id)}?tabName=RELEASE`}>
        <LabeledIcon icon="override" marginContent="5px">
          <Text.h5 color="dark">Override release</Text.h5>
        </LabeledIcon>
      </Styled.A>
      <Dropdown actions={actions} />
    </Styled.Actions>
  );

  const renderRelease = () =>
    circle.deployment && <LayerLastRelease deployment={circle.deployment} />;

  const renderModules = () =>
    isDefaultCircle(circle.name) && (
      <LayerModules deployment={circle.deployment} />
    );

  const renderPanel = () => (
    <TabPanel
      title={circle.name}
      onClose={() => delParamCircle(history, id)}
      actions={renderActions()}
      name="circles"
      size="15px"
    >
      <LayerName name={circle.name} />
      <LayerSegments rules={circle.rules} />
      {renderRelease()}
      {renderModules()}
      <LayerMetrics id={id} />
    </TabPanel>
  );

  return (
    <Styled.Wrapper data-testid={`circles-comparation-item-${id}`}>
      {!circle ? <Loader.Tab /> : renderPanel()}
    </Styled.Wrapper>
  );
};

export default CirclesComparationItem;
