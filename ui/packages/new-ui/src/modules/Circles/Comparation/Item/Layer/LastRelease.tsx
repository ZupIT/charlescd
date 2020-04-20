import React from 'react';
import Card from 'core/components/Card';
import ContentIcon from 'core/components/ContentIcon';
import Text from 'core/components/Text';
import { Circle } from 'modules/Circles/interfaces/Circle';
import Styled from '../styled';

type Props = Pick<Circle, 'deployment'>;

const LayerLastRelease = ({ deployment: { status, build } }: Props) => {
  const renderRelease = () => (
    <Styled.Release>
      <Card.Release
        status={status}
        description={build.tag}
        expandItems={build.artifacts}
      />
    </Styled.Release>
  );

  return (
    <Styled.Layer>
      <ContentIcon icon="release">
        <Text.h2 color="light">Last release deployed</Text.h2>
      </ContentIcon>
      <Styled.Content>{renderRelease()}</Styled.Content>
    </Styled.Layer>
  );
};

export default LayerLastRelease;
