import React, { ReactNode } from 'react';
import Text from 'core/components/Text';
import Button from 'core/components/Button';
import Icon, { Props as IIconProps } from 'core/components/Icon';
import Styled from './styled';

interface Props {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  onClose?: Function;
}

const TabPanel = ({
  title,
  children,
  onClose,
  actions,
  name,
  size
}: Props & IIconProps) => (
  <Styled.Panel>
    <Styled.Header>
      <Styled.Tab>
        <Styled.Title>
          <Icon name={name} size={size} />
          <Text.h5 color="light">{title}</Text.h5>
        </Styled.Title>
        {onClose && (
          <Button.Icon name="cancel" size="15px" onClick={() => onClose()} />
        )}
      </Styled.Tab>
      {actions}
    </Styled.Header>
    <Styled.Content>{children}</Styled.Content>
  </Styled.Panel>
);

export default TabPanel;
