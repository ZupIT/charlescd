import React from 'react';
import ContentIcon from 'core/components/ContentIcon';
import Text from 'core/components/Text';
import Segments from 'modules/Circles/Segments';
import { Circle } from 'modules/Circles/interfaces/Circle';
import Styled from '../styled';

type Props = Pick<Circle, 'rules'>;

const LayerSegments = ({ rules }: Props) => (
  <Styled.Layer>
    <ContentIcon icon="segments">
      <Text.h2 color="light">Segments</Text.h2>
    </ContentIcon>
    <Styled.Content>
      <Segments rules={rules} />
    </Styled.Content>
  </Styled.Layer>
);

export default LayerSegments;
