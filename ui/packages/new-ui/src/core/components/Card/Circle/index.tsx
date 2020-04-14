import React, { ReactNode } from 'react';
import Card from 'core/components/Card';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { dateFrom } from 'core/utils/date';
import Styled from './styled';

export interface Props {
  circle: string;
  deployedAt: string;
  children: ReactNode;
  footer?: ReactNode;
}

const CardCircle = ({ circle, deployedAt, children }: Props) => {
  const renderHeader = () => (
    <Card.Header icon={<Icon name="circles" size="15px" color="success" />} />
  );

  const renderBody = () => (
    <Styled.CardBody>
      <Text.h4 color="light" align="left">
        {circle}
      </Text.h4>
      <Text.h5 color="light" align="left">
        Deployed at {dateFrom(deployedAt)}
      </Text.h5>
      {children}
    </Styled.CardBody>
  );

  return (
    <Styled.CardCircle>
      {renderHeader()}
      {renderBody()}
    </Styled.CardCircle>
  );
};

export default CardCircle;
