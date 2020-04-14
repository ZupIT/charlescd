import React, { useState } from 'react';
import Card from 'core/components/Card';
import Badge from 'core/components/Badge';
import { ReactComponent as InfoSVG } from 'resources/svgs/info.svg';
import { Artifact } from 'modules/Circles/interfaces/Circle';
import Styled from './styled';
import CardExpand from '../Expand';

export interface Props {
  status: string;
  description: string;
  expandItems?: Artifact[];
}

const CardRelease = ({ status, description, expandItems }: Props) => {
  const renderStatus = () => <Badge label={status} />;
  const [toggle, switchToggle] = useState(false);

  const renderHeader = () => (
    <Card.Header icon={<InfoSVG />}>{renderStatus()}</Card.Header>
  );

  const renderBody = () => (
    <Styled.CardBody onClick={() => switchToggle(!toggle)}>
      <Styled.Text color="light">{description}</Styled.Text>
    </Styled.CardBody>
  );

  return (
    <Styled.CardRelease>
      <>
        {renderHeader()}
        {renderBody()}
        {toggle && (
          <CardExpand
            onClick={() => switchToggle(!toggle)}
            items={expandItems}
          />
        )}
      </>
    </Styled.CardRelease>
  );
};

export default CardRelease;
