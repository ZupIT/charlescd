import React from 'react';
import Dropdown from 'core/components/Dropdown';
import Styled from './styled';

type Props = {
  onReset: () => void;
};

const ChartMenu = ({ onReset }: Props) => (
  <Styled.ChartMenu>
    <Dropdown icon="horizontal-dots" size="24px">
      <Dropdown.Item icon="refresh" name="Reset" onClick={onReset} />
    </Dropdown>
  </Styled.ChartMenu>
);

export default ChartMenu;
