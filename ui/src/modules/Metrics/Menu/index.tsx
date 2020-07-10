/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';

import map from 'lodash/map';
import Text from 'core/components/Text';
import LabeledIcon from 'core/components/LabeledIcon';
import MenuItem from './MenuItem';
import { items } from './constants';
import Styled from './styled';

const Menu = () => {
  const [, setToggleModal] = useState(false);
  const renderItems = () =>
    map(items, ({ id, text, to }) => (
      <MenuItem key={id} id={id} name={text} route={to} />
    ));

  return (
    <>
      <Styled.CreateMetricDashboard
        onClick={() => setToggleModal(true)}
        isDisabled={true}
      >
        <LabeledIcon icon="plus-circle" marginContent="5px">
          <Text.h5 color="dark">Create dashboard</Text.h5>
        </LabeledIcon>
      </Styled.CreateMetricDashboard>
      <Styled.Content>
        <Styled.List>{renderItems()}</Styled.List>
      </Styled.Content>
    </>
  );
};

export default Menu;
