import styled from 'styled-components';
import CardBase from 'core/components/Card/Base';
import CardBody from 'core/components/Card/Body';
import Text from 'core/components/Text';

const CustomText = styled(Text.h4)``;

const CardRelease = styled(CardBase)`
  background-color: ${({ theme }) => theme.card.release.background};

  :hover {
    ${CustomText} {
      white-space: normal;
      overflow: visible;
    }
  }
`;

const CustomCardBody = styled(CardBody)`
  ${CustomText} {
    width: 235px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export default {
  CardRelease,
  CardBody: CustomCardBody,
  Text: CustomText
};
