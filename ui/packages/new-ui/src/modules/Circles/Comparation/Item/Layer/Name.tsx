import React from 'react';
import ContentIcon from 'core/components/ContentIcon';
import Text from 'core/components/Text';
import { Circle } from 'modules/Circles/interfaces/Circle';
import Styled from '../styled';

type Props = Pick<Circle, 'name'>;

const LayerName = ({ name }: Props) => (
  <Styled.Layer>
    <ContentIcon icon="circles">
      <Text.h2 color="light">{name}</Text.h2>
    </ContentIcon>
  </Styled.Layer>
);

export default LayerName;
