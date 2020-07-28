import React from 'react';
import map from 'lodash/map';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { checkPoints } from './helpers';
import Styled from './styled';

interface Props {
  password: string;
  confirmPass: string;
}

const CheckPassword = ({ password, confirmPass }: Props) => {
  const renderCheckPoint = () => (
    <>
      {map(checkPoints, checkPoint => {
        const isValid = checkPoint.rule(password, confirmPass);
        const icon = isValid ? 'checkmark' : 'close';
        const color = isValid ? 'success' : 'dark';

        return (
          <Styled.Item key={checkPoint.name}>
            <Icon name={icon} color={color} size="14px" />
            <Text.h5 color={color}>{checkPoint.name}</Text.h5>
          </Styled.Item>
        );
      })}
    </>
  );

  return renderCheckPoint();
};

export default CheckPassword;
