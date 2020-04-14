import styled from 'styled-components';
import CardBase from 'core/components/Card/Base';
import CardBody from 'core/components/Card/Body';

const CardCircle = styled(CardBase)`
  width: 303px;
  background: ${({ theme }) => theme.card.circle.background};
  transition: all 0.3s;

  :hover {
    transition: all 0.3s;
    transform: scale(1.03);
  }
`;

const CustomCardBody = styled(CardBody)`
  min-height: 100px;

  > * + * {
    margin-top: 10px;
  }
`;

export default {
  CardCircle,
  CardBody: CustomCardBody
};
