import React from 'react';
import map from 'lodash/map';
import ContentIcon from 'core/components/ContentIcon';
import Panel from 'core/components/Panel';
import Text from 'core/components/Text';
import { Artifact, Circle } from 'modules/Circles/interfaces/Circle';
import Styled from '../styled';

type Props = Pick<Circle, 'deployment'>;

const LayerModules = ({ deployment: { artifacts } }: Props) => {
  const renderArtifact = ({ id, artifact }: Artifact) => (
    <Panel.Section key={id}>
      <Text.h5 color="light">{artifact}</Text.h5>
    </Panel.Section>
  );

  const renderArtifacts = () =>
    artifacts && (
      <Panel.Content>
        {map(artifacts, artifact => renderArtifact(artifact))}
      </Panel.Content>
    );

  return (
    <Styled.Layer>
      <ContentIcon icon="modules">
        <Text.h2 color="light">Deployed modules</Text.h2>
      </ContentIcon>
      <Styled.Content>{renderArtifacts()}</Styled.Content>
    </Styled.Layer>
  );
};

export default LayerModules;
