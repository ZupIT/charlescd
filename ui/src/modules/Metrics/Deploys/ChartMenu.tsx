import React from 'react';
import Dropdown from 'core/components/Dropdown';

type Props = {
  onReset: () => void;
};

const ChartMenu = ({ onReset }: Props) => (
  <Dropdown>
    <Dropdown.Item icon="refresh" name="Reset" onClick={onReset} />
  </Dropdown>
);

export default ChartMenu;
