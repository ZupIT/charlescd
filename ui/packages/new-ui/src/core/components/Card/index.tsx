import React from 'react';
import CardBase, { Props as ICardBase } from 'core/components/Card/Base';
import CardCircle, { Props as ICardCircle } from 'core/components/Card/Circle';
import CardHeader, { Props as ICardHeader } from 'core/components/Card/Header';
import CardBody, { Props as ICardBody } from 'core/components/Card/Body';
import CardExpand, { Props as ICardExpand } from 'core/components/Card/Expand';
import CardRelease, {
  Props as ICardRelease
} from 'core/components/Card/Release';

const Card = {
  Base: (props: ICardBase) => <CardBase {...props} />,
  Body: (props: ICardBody) => <CardBody {...props} />,
  Circle: (props: ICardCircle) => <CardCircle {...props} />,
  Header: (props: ICardHeader) => <CardHeader {...props} />,
  Release: (props: ICardRelease) => <CardRelease {...props} />,
  Expand: (props: ICardExpand) => <CardExpand {...props} />
};

export default Card;
