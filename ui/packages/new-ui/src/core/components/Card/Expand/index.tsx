import React, { useRef } from 'react';
import map from 'lodash/map';
import Text from 'core/components/Text';
import Icon from 'core/components/Icon';
import { Artifact } from 'modules/Circles/interfaces/Circle';
import useOutsideClick from 'core/hooks/useClickOutside';
import Styled from './styled';

export interface Props {
  items: Artifact[];
  className?: string;
  onClick: () => void;
}

const CardExpand = ({ onClick, items, className }: Props) => {
  const ref = useRef<HTMLDivElement>();

  useOutsideClick(ref, () => onClick());

  const renderItems = () =>
    map(items, (item: Artifact, index: number) => (
      <Styled.Item key={`${item.version}-${index}`}>
        <Styled.Icon>
          <Icon name="git" color="light" />
        </Styled.Icon>
        <Text.h5 color="light">{`${item.moduleName}/${item.componentName}/${item.version}`}</Text.h5>
      </Styled.Item>
    ));

  return (
    <>
      <Styled.Expand ref={ref} className={className}>
        {renderItems()}
      </Styled.Expand>
      <Styled.Action onClick={onClick} />
    </>
  );
};

export default CardExpand;
