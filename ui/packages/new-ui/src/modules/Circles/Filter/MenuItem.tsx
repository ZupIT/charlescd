import React, { memo } from 'react';
import { useHistory } from 'react-router';
import useQueryStrings from 'core/helpers/query';
import Text from 'core/components/Text';
import { addParamCircle, delParamCircle } from 'modules/Circles/helpers';
import Styled from './styled';

interface Props {
  id: string;
  name: string;
}

const MenuItem = ({ id, name }: Props) => {
  const history = useHistory();
  const query = useQueryStrings();

  const isActive = () => query.getAll('circle').includes(id);

  const toggleCircle = () =>
    isActive() ? delParamCircle(history, id) : addParamCircle(history, id);

  return (
    <Styled.Link onClick={toggleCircle} isActive={isActive()}>
      <Styled.ListItem icon="circle-menu" marginContent="8px">
        <Text.h4 color="light">{name}</Text.h4>
      </Styled.ListItem>
    </Styled.Link>
  );
};

export default memo(MenuItem);
